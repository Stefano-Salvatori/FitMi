import { Injectable } from '@angular/core';
import { BluetoothLE, OperationResult, Device } from '@ionic-native/bluetooth-le/ngx';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Authentication } from './authentication';
import { MiBandGatt } from './mibandGatt';
import { Platform } from '@ionic/angular';
import { StorageService } from '../storage.service';

export enum Notification {
    MESSAGE = 1,
    PHONE = 2,
    VIBRATE = 3,
    OFF = 4

}

export enum ConnectionState {
    IDLE = "Idle",
    SEARCHING_DEVICE = "Searching Device...",
    CONNECTING = "Connecting...",
    CONNECTED = "Connected",
    AUTHENTICATING = "Authenticating...",
    AUTHENTICATED = "Authenticated",
    DISCONNECTING = "Disconnecting...",
    DISCONNECTED = "Disconnected",
    NOT_FOUND = "Device Not Found",
    ERROR = "An Error Occured"
}

@Injectable({
    providedIn: 'root',
})
export class MiBandService {

    private readonly MAX_SCAN_TIME = 30000 //ms
    private readonly MI_BAND_ADDRESS_KEY = "miband-address"


    private address: string
    private connectionState: ConnectionState = ConnectionState.IDLE;
    private connectionStateBehaviour: BehaviorSubject<ConnectionState> =
        new BehaviorSubject(this.connectionState)


    constructor(private ble: BluetoothLE, private storage: StorageService) {

    }

    /**
     * Look for the MiBand address. If the band is already connected the address can be found in the local storage; otherwise start ble Scan and find the address of the MiBand searching for a device that expose the miband's autentication service.
     * This must always be called the first time we use this service so that the adress of the band is correctly set up. 
     */
    public async findMiBand() {
        return new Promise<void>(async (resolve, reject) => {
            if((await this.storage.retrieve(this.MI_BAND_ADDRESS_KEY)) != undefined){
                this.address = await this.storage.retrieve(this.MI_BAND_ADDRESS_KEY)
                resolve();
            } else {
                this.notifyNewConnectionState(ConnectionState.SEARCHING_DEVICE);
                const timer = setTimeout(() => {
                    this.ble.stopScan();
                    this.notifyNewConnectionState(ConnectionState.NOT_FOUND);
                    reject();
                }, this.MAX_SCAN_TIME)

                if((await this.ble.isScanning()).isScanning){
                    await this.ble.stopScan();
                }
                this.ble.startScan({}).subscribe(async device => {
                    if (device.name === MiBandGatt.DEVICE_NAME) {
                        clearTimeout(timer)
                        this.address = device.address;
                        this.storage.store(this.MI_BAND_ADDRESS_KEY, this.address);
                        this.ble.stopScan()
                        resolve();
                    }
                }, err => {
                    console.log(err);
                    this.notifyNewConnectionState(ConnectionState.ERROR);
                    reject();
                })
            }
        });
    }

    public async disconnect() {
        this.notifyNewConnectionState(ConnectionState.DISCONNECTING);
        await this.storage.remove(this.MI_BAND_ADDRESS_KEY);
        const wasConnected = await this.ble.wasConnected({ address: this.address });
        if (wasConnected.wasConnected) {
            const isConnected = await this.ble.isConnected({ address: this.address });
            if (isConnected.isConnected) {
                await this.ble.disconnect({ address: this.address }).catch(() => { })
                await this.ble.close({ address: this.address }).catch(() => { })
            }
            this.notifyNewConnectionState(ConnectionState.DISCONNECTED);
        }
    }


    public async connect(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.notifyNewConnectionState(ConnectionState.CONNECTING);
            const wasConnected = await this.ble.wasConnected({ address: this.address });
            if (wasConnected.wasConnected) {
                console.log("Was Connected");
                const isConnected = await this.ble.isConnected({ address: this.address });
                //If the device is already connected we don't need to perform authentication
                if (isConnected.isConnected) {
                    await this.discoverServices();
                    this.notifyNewConnectionState(ConnectionState.CONNECTED);
                    resolve();
                } else {
                    console.log("RECONNECTING...");
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
                console.log("First Connection");
                this.ble.connect({ address: this.address, autoConnect: true })
                    .subscribe(async () => {
                        this.notifyNewConnectionState(ConnectionState.CONNECTED);
                        await this.discoverServices();
                        this.notifyNewConnectionState(ConnectionState.AUTHENTICATING);
                        await new Authentication(this.address, this.ble).authenticate();
                        this.notifyNewConnectionState(ConnectionState.AUTHENTICATED);
                        resolve()
                    }, err => console.log(err));
            }

        })

    }


    public getConnectionStateObservable(): Observable<ConnectionState> {
        return this.connectionStateBehaviour;
    }

    public async unsubscribeHeartRate() {
        //unsubscribe to avoid 'Already subscribed errors
        await this.ble.unsubscribe({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_HRM,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_HRM_DATA
        }).catch(() => { })


    }

    public getHeartRate(): Observable<OperationResult> {
        return this.ble.subscribe({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_HRM,
            characteristic: MiBandGatt.UUID_CHARATERISTIC_HRM_DATA
        })
    }

    public async startHeartRateMonitoring() {
        await this.write([0x15, 0x02, 0x00],
            MiBandGatt.UUID_SERVICE_HRM,
            MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL)
        await this.write([0x15, 0x01, 0x00],
            MiBandGatt.UUID_SERVICE_HRM,
            MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL)
        await this.write([0x15, 0x01, 0x01],
            MiBandGatt.UUID_SERVICE_HRM,
            MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL)
    }

    public async stopHeartRateMonitoring() {
        await this.write([0x15, 0x01, 0x00],
            MiBandGatt.UUID_SERVICE_HRM,
            MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL)
    }


    public async readHeartRate(): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            this.unsubscribeHeartRate();
            this.getHeartRate()
                .subscribe(heartRateValue => {
                    if (heartRateValue.status != 'subscribed') {
                        const data = this.ble.encodedStringToBytes(heartRateValue.value);
                        this.unsubscribeHeartRate();
                        resolve(Buffer.from(data).readUInt16BE(0));
                    }
                }, err => {
                    console.log(err);
                    reject();
                })

            await this.write([0x15, 0x01, 0x00],
                MiBandGatt.UUID_SERVICE_HRM,
                MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL)
            await this.write([0x15, 0x02, 0x00],
                MiBandGatt.UUID_SERVICE_HRM,
                MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL)
            await this.write([0x15, 0x02, 0x01],
                MiBandGatt.UUID_SERVICE_HRM,
                MiBandGatt.UUID_CHARATERISTIC_HRM_CONTROL)
        });

    }

    public async getPedometerStats() {
        const res = await this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandGatt.UUID_CHARACTERISTIC_STEPS
        });
        const data = Buffer.from(this.ble.encodedStringToBytes(res.value))
        let result = { steps: 0, distance: 0, calories: 0 }
        //unknown = data.readUInt8(0)
        result.steps = data.readUInt16LE(1)
        //unknown = data.readUInt16LE(3) // 2 more bytes for steps? ;)
        if (data.length >= 8) result.distance = data.readUInt32LE(5)
        if (data.length >= 12) result.calories = data.readUInt32LE(9)
        return result;
    }

    public async getTime() {
        const res = await this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandGatt.UUID_CHARACTERISTIC_TIME
        });
        return this.parseDate(Buffer.from(this.ble.encodedStringToBytes(res.value)))
    }

    public async getBatteryInfo() {
        const res = await this.ble.read({
            address: this.address,
            service: MiBandGatt.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandGatt.UUID_CHARACTERISTIC_BATTERY
        });

        console.log("response: " + this.ble.encodedStringToBytes(res.value))

        if (res.value.length <= 2) return -1;
        else return this.ble.encodedStringToBytes(res.value)[1]

    }

    public async sendNotification(notificationType: Notification): Promise<void> {
        await this.writeWithoutResponse([notificationType],
            MiBandGatt.UUID_SERVICE_IMMEDIATE_ALERT,
            MiBandGatt.UUID_CHARATERISTIC_VIBRATE);
    }


   

    public async discoverServices(): Promise<Device> {
        return this.ble.discover({ address: this.address });
    }

    private async write(value: number[], service: string, characteristic: string): Promise<void> {
        this.ble.write({
            address: this.address,
            service: service,
            characteristic: characteristic,
            value: this.ble.bytesToEncodedString(Uint8Array.from(value))
        })
    }

    private async writeWithoutResponse(value: number[], service: string, characteristic: string): Promise<void> {
        this.ble.write({
            address: this.address,
            service: service,
            characteristic: characteristic,
            type: 'noResponse',
            value: this.ble.bytesToEncodedString(Uint8Array.from(value))
        })
    }


    private parseDate(buff: Buffer): Date {
        let year = buff.readUInt16LE(0),
            mon = buff[2] - 1,
            day = buff[3],
            hrs = buff[4],
            min = buff[5],
            sec = buff[6],
            msec = buff[8] * 1000 / 256;
        return new Date(year, mon, day, hrs, min, sec)
    }

    private notifyNewConnectionState(newState: ConnectionState) {
        //notify observers
        this.connectionState = newState;
        this.connectionStateBehaviour.next(this.connectionState);
    }

}