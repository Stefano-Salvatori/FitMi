import { Injectable } from '@angular/core';
import { BluetoothLE, OperationResult, Device } from '@ionic-native/bluetooth-le/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Authentication } from './authentication';
import { MiBandGatt } from './mibandGatt';
import { StorageService } from '../storage.service';
import { map, filter } from 'rxjs/operators';
import { PedometerData } from './pedometer-data';

export enum Notification {
    MESSAGE = 1,
    PHONE = 2,
    VIBRATE = 3,
    OFF = 4

}

export enum ConnectionState {
    IDLE = 'Idle',
    SEARCHING_DEVICE = 'Searching Device...',
    CONNECTING = 'Connecting...',
    CONNECTED = 'Connected',
    AUTHENTICATING = 'Authenticating...',
    AUTHENTICATED = 'Authenticated',
    DISCONNECTING = 'Disconnecting...',
    DISCONNECTED = 'Disconnected',
    NOT_FOUND = 'Device Not Found',
    ERROR = 'An Error Occured'
}

@Injectable({
    providedIn: 'root'
})
export class MiBandService {

    private readonly MAX_SCAN_TIME = 30000; // ms
    private readonly MI_BAND_ADDRESS_KEY = 'miband-address';


    private heartRateTimer;
    private address: string;
    private connectionState: ConnectionState = ConnectionState.IDLE;
    private connectionStateBehaviour: BehaviorSubject<ConnectionState> =
        new BehaviorSubject(this.connectionState);


    constructor(private ble: BluetoothLE, private storage: StorageService) {
    }

    public async isConnected() {
        return this.address !== undefined && this.address !== null && (await this.ble.isConnected({address: this.address})).isConnected;
    }



    /**
     * Look for the MiBand address. If the band is already connected the address can be
     * found in the local storage; otherwise start ble Scan and find the address of the
     * MiBand searching for a device that expose the miband's authentication service.
     * This must always be called the first time we use this service so that the adress of the band is correctly set up.
     */
    public async findMiBand(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            const storedAddress = await this.storage.retrieve(this.MI_BAND_ADDRESS_KEY);
            if (storedAddress !== null && storedAddress !== undefined) {
                this.address = storedAddress;
                resolve();
            } else {
                this.notifyNewConnectionState(ConnectionState.SEARCHING_DEVICE);
                const timer = setTimeout(() => {
                    this.ble.stopScan();
                    this.notifyNewConnectionState(ConnectionState.NOT_FOUND);
                    reject();
                }, this.MAX_SCAN_TIME);

                if ((await this.ble.isScanning()).isScanning) {
                    await this.ble.stopScan();
                }
                this.ble.startScan({}).subscribe(async device => {
                    if (device.name === MiBandGatt.DEVICE_NAME) {
                        clearTimeout(timer);
                        this.address = device.address;
                        this.storage.store(this.MI_BAND_ADDRESS_KEY, this.address);
                        this.ble.stopScan();
                        resolve();
                    }
                }, err => {
                    console.log(err);
                    this.notifyNewConnectionState(ConnectionState.ERROR);
                    reject();
                });
            }
        });
    }

    /**
     * Disconnect from the smart band.
     */
    public async disconnect() {
        this.notifyNewConnectionState(ConnectionState.DISCONNECTING);
        await this.storage.remove(this.MI_BAND_ADDRESS_KEY);
        const wasConnected = await this.ble.wasConnected({ address: this.address });
        if (wasConnected.wasConnected) {
            const isConnected = await this.ble.isConnected({ address: this.address });
            if (isConnected.isConnected) {
                await this.ble.disconnect({ address: this.address }).catch(() => { });
                await this.ble.close({ address: this.address }).catch(() => { });
            }
            this.notifyNewConnectionState(ConnectionState.DISCONNECTED);
        }
    }


    /**
     * Connect to the smart band. This function also performs authentication if it's the first time we connect.
     */
    public async connect(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.notifyNewConnectionState(ConnectionState.CONNECTING);
            const wasConnected = await this.ble.wasConnected({ address: this.address });
            if (wasConnected.wasConnected) {
                console.log('Was Connected');
                const isConnected = await this.ble.isConnected({ address: this.address });
                // If the device is already connected we don't need to perform authentication
                if (isConnected.isConnected) {
                    await this.discoverServices();
                    this.notifyNewConnectionState(ConnectionState.CONNECTED);
                    resolve();
                } else {
                    console.log('RECONNECTING...');
                    this.ble.reconnect({ address: this.address })
                        .subscribe(async () => {
                            this.notifyNewConnectionState(ConnectionState.CONNECTED);
                            await this.discoverServices();
                            this.notifyNewConnectionState(ConnectionState.AUTHENTICATING);
                            await new Authentication(this.address, this.ble).authenticate();
                            this.notifyNewConnectionState(ConnectionState.AUTHENTICATED);
                            resolve();
                        }, async err => {
                            console.log(err);
                            reject();
                        });
                }
            } else {
                console.log('First Connection');
                this.ble.connect({ address: this.address, autoConnect: true })
                    .subscribe(async () => {
                        this.notifyNewConnectionState(ConnectionState.CONNECTED);
                        await this.discoverServices();
                        this.notifyNewConnectionState(ConnectionState.AUTHENTICATING);
                        await new Authentication(this.address, this.ble).authenticate();
                        this.notifyNewConnectionState(ConnectionState.AUTHENTICATED);
                        resolve();
                    }, err => console.log(err));
            }
        });
    }


    /**
     * @returns an observable that represents the state of the connection.
     */
    public getConnectionStateObservable(): Observable<ConnectionState> {
        return this.connectionStateBehaviour;
    }

    public setUserInfo(user: {
        date: string,
        gender: string,
        height: number,
        weight: number,
        id: number
    }) {
        const data = new Buffer(16);
        data.writeUInt8(0x4f, 0); // Set user info command

        const date: Date = new Date(user.date);
        data.writeUInt16LE(date.getFullYear(), 3);
        data.writeUInt8(date.getMonth() + 1, 5);
        data.writeUInt8(date.getDate(), 6);
        switch (user.gender) {
            case 'male': data.writeUInt8(0, 7); break;
            case 'female': data.writeUInt8(1, 7); break;
            default: data.writeUInt8(2, 7); break;
        }
        data.writeUInt16LE(user.height, 8); // cm
        data.writeUInt16LE(user.weight, 10); // kg
        data.writeUInt32LE(user.id, 12); // id

        this.write(Array.prototype.slice.call(data, 0),
            MiBandGatt.UUID_SERVICE_MIBAND_1,
            MiBandGatt.UUID_CHARACTERISTIC_USER_INFO);
    }

    /**
     * Subscribe to the button click events.
     */
    public subscribeButtonClick(): Observable<OperationResult> {
        return this.ble.subscribe({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_BUTTON_EVENT
        })
            .pipe(filter(value => value.status !== 'subscribed'));

    }

    public unsubscribeButtonClick() {
        return this.ble.unsubscribe({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_BUTTON_EVENT
        }).catch(() => { });
    }

    /**
     * Unsubscribe from heart rate values.
     */
    public async unsubscribeHeartRate() {
        await this.ble.unsubscribe({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_HART_RATE,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_HRM_DATA
        }).catch(() => { });


    }

    /**
     * Subscribe to heart rate values.
     */
    public subscribeHeartRate(): Observable<number> {
        this.unsubscribeHeartRate();
        return this.ble.subscribe({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_HART_RATE,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_HRM_DATA
        })
            .pipe(filter(heartRateValue => heartRateValue.status !== 'subscribed'))
            .pipe(map(heartRateValue => {
                const data = this.ble.encodedStringToBytes(heartRateValue.value);
                return Buffer.from(data).readUInt16BE(0);
            }));
    }

    /**
     * Tells the smart band to start monitoring heart rate continously.
     */
    public async startHeartRateMonitoring() {
        // Stop previous measurements
        await this.write([0x15, 0x02, 0x00],
            MiBandGatt.UUID_SERVICE_HART_RATE,
            MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL);
        await this.write([0x15, 0x01, 0x00],
            MiBandGatt.UUID_SERVICE_HART_RATE,
            MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL);

        // Start continuous
        await this.write([0x15, 0x01, 0x01],
            MiBandGatt.UUID_SERVICE_HART_RATE,
            MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL);

        // ping to avoid automatic stop
        this.heartRateTimer = setInterval(() => {
            this.write([0x16], MiBandGatt.UUID_SERVICE_HART_RATE,
                MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL);
        }, 12000);
    }

    /**
     * Tells the smart band to stop monitoring heart rate.
     */
    public async stopHeartRateMonitoring() {
        clearTimeout(this.heartRateTimer);
        await this.write([0x15, 0x01, 0x00],
            MiBandGatt.UUID_SERVICE_HART_RATE,
            MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL);
    }

    /**
     * @returns the device name
     */
    public getDeviceName(): Promise<string> {
        return this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_GENERIC_ACCESS,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_DEVICE_NAME
        }).then(res => {
            return this.ble.bytesToString(this.ble.encodedStringToBytes(res.value));
        });


    }

    /**
     * @returns the serial number of the device.
     */
    public getSerial(): Promise<string> {
        return this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_DEVICE_INFORMATION,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_SERIAL_NUMBER
        }).then(res => {
            return this.ble.bytesToString(this.ble.encodedStringToBytes(res.value));
        });
    }


    /**
     * @returns hardware version.
     */
    public getHardwareVersion(): Promise<string> {
        return this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_DEVICE_INFORMATION,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_HW_REVISION
        }).then(res => {
            return this.ble.bytesToString(this.ble.encodedStringToBytes(res.value));
        });
    }

    /**
     * @returns software version.
     */
    public getSoftwareVersion(): Promise<string> {
        return this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_DEVICE_INFORMATION,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_SW_REVISION
        }).then(res => {
            return this.ble.bytesToString(this.ble.encodedStringToBytes(res.value));
        });
    }


    /**
     * Perform a single read of the heart rate.
     */
    public async readHeartRate(): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            this.unsubscribeHeartRate();
            this.subscribeHeartRate()
                .subscribe(heartRateValue => {
                    resolve(heartRateValue);
                    this.unsubscribeHeartRate();
                }, err => {
                    console.log(err);
                    reject();
                });

            await this.write([0x15, 0x01, 0x00],
                MiBandGatt.UUID_SERVICE_HART_RATE,
                MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL);
            await this.write([0x15, 0x02, 0x00],
                MiBandGatt.UUID_SERVICE_HART_RATE,
                MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL);
            await this.write([0x15, 0x02, 0x01],
                MiBandGatt.UUID_SERVICE_HART_RATE,
                MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL);
        });

    }

    /**
     * Read steps, distance and calories.
     */
    public getPedometerData(): Promise<PedometerData> {
        return this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandGatt.UUID_CHARACTERISTIC_STEPS
        }).then(res => {
            const data = Buffer.from(this.ble.encodedStringToBytes(res.value));
            const result = { steps: 0, distance: 0, calories: 0 };
            // unknown = data.readUInt8(0)
            result.steps = data.readUInt16LE(1);
            // unknown = data.readUInt16LE(3) // 2 more bytes for steps? ;)
            if (data.length >= 8) { result.distance = data.readUInt32LE(5); }
            if (data.length >= 12) { result.calories = data.readUInt32LE(9); }
            return result;
        });
    }

    /**
     * Read date.
     */
    public getDate(): Promise<Date> {
        return this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandGatt.UUID_CHARACTERISTIC_TIME
        }).then(res => {
            return this.parseDate(Buffer.from(this.ble.encodedStringToBytes(res.value)));
        });
    }

    /**
     * Read battery status.
     */
    public getBatteryInfo(): Promise<number> {
        return this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandGatt.UUID_CHARACTERISTIC_BATTERY
        }).then(res => {
            if (res.value.length <= 2) {
                return -1;
            } else {
                return this.ble.encodedStringToBytes(res.value)[1];
            }
        });
    }

    /**
     * Send a notification to the smart band.
     * @param notificationType
     * The type of notification to send
     */
    public async sendNotification(notificationType: Notification): Promise<void> {
        await this.writeWithoutResponse([notificationType],
            MiBandGatt.UUID_SERVICE_IMMEDIATE_ALERT,
            MiBandGatt.UUID_CHARATERISTIC_VIBRATE);
    }


    /**
     * Discover smart band services.
     */
    public async discoverServices(): Promise<Device> {
        return this.ble.discover({ address: this.address });
    }

    private async write(value: number[], service: string, characteristic: string): Promise<void> {
        this.ble.write({
            address: this.address,
            service,
            characteristic,
            value: this.ble.bytesToEncodedString(Uint8Array.from(value))
        });
    }

    private async writeWithoutResponse(value: number[], service: string, characteristic: string): Promise<void> {
        this.ble.write({
            address: this.address,
            service,
            characteristic,
            type: 'noResponse',
            value: this.ble.bytesToEncodedString(Uint8Array.from(value))
        });
    }


    private parseDate(buff: Buffer): Date {
        const year = buff.readUInt16LE(0),
            mon = buff[2] - 1,
            day = buff[3],
            hrs = buff[4],
            min = buff[5],
            sec = buff[6];
        return new Date(year, mon, day, hrs, min, sec);
    }

    private notifyNewConnectionState(newState: ConnectionState) {
        // notify observers
        this.connectionState = newState;
        this.connectionStateBehaviour.next(this.connectionState);
    }

}
