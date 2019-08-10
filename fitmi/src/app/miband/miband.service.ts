import { Injectable } from '@angular/core';
import { BluetoothLE, OperationResult, Device } from '@ionic-native/bluetooth-le/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Authentication } from './authentication';

export enum Notification {
    MESSAGE = 1,
    PHONE = 2,
    VIBRATE = 3,
    OFF = 4

}

export enum ConnectionState{
    IDLE,
    CONNECTING,
    CONNECTED,
    AUTHENTICATING,
    AUTHENTICATED,
    DISCONNECTING,
    DISCONNECTED
}

@Injectable({
    providedIn: 'root',
})
export class MiBandService {
    public static UUID_SERVICE_GENERIC_ACCESS = '1800';
    public static UUID_SERVICE_GENERIC_ATTRIBUTE = '1801';
    public static UUID_SERVICE_DEVICE_INFORMATION = '180A';
    public static UUID_SERVICE_ALERT_NOTIFICATION = '1811';
    public static UUID_SERVICE_IMMEDIATE_ALERT = '1802';
    public static UUID_CHARATERISTIC_VIBRATE = '2A06';
    public static UUID_SERVICE_HRM = '180D';
    public static UUID_CHARATERISTIC_HRM_CONTROL = '2A39'
    public static UUID_CHARATERISTIC_HRM_DATA = '2A37'

    public static UUID_SERVICE_MIBAND_1 = 'FEE0';
    public static UUID_SERVICE_AUTH = 'FEE1';
    public static UUID_CHARACTERISTIC_AUTH = '00000009-0000-3512-2118-0009AF100700';
    public static UUID_CHARACTERISTIC_BATTERY = '00000006-0000-3512-2118-0009AF100700';
    public static UUID_CHARACTERISTIC_STEPS = '00000007-0000-3512-2118-0009AF100700';

    public static UUID_CHARACTERISTIC_TIME = '2A2B';


    private address: string
    private ble: BluetoothLE
    private connectionState: BehaviorSubject<ConnectionState>;

    constructor() {}

    public getConnectionStateObservable(){
        return this.connectionState.asObservable();
    }

    public async unsubscribeHeartRate() {
        //unsubscribe to avoid 'Already subscribed errors
        await this.ble.unsubscribe({
            address: this.address,
            service: MiBandService.UUID_SERVICE_HRM,
            characteristic: MiBandService.UUID_CHARATERISTIC_HRM_DATA
        }).catch(() => { })


    }
    public getHeartRate(): Observable<OperationResult> {
        return this.ble.subscribe({
            address: this.address,
            service: MiBandService.UUID_SERVICE_HRM,
            characteristic: MiBandService.UUID_CHARATERISTIC_HRM_DATA
        })
    }

    public async startHeartRateMonitoring() {
        await this.write([0x15, 0x02, 0x00],
            MiBandService.UUID_SERVICE_HRM,
            MiBandService.UUID_CHARATERISTIC_HRM_CONTROL)
        await this.write([0x15, 0x01, 0x00],
            MiBandService.UUID_SERVICE_HRM,
            MiBandService.UUID_CHARATERISTIC_HRM_CONTROL)
        await this.write([0x15, 0x01, 0x01],
            MiBandService.UUID_SERVICE_HRM,
            MiBandService.UUID_CHARATERISTIC_HRM_CONTROL)
    }

    public async stopHeartRateMonitoring() {
        await this.write([0x15, 0x01, 0x00],
            MiBandService.UUID_SERVICE_HRM,
            MiBandService.UUID_CHARATERISTIC_HRM_CONTROL)
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
                MiBandService.UUID_SERVICE_HRM,
                MiBandService.UUID_CHARATERISTIC_HRM_CONTROL)
            await this.write([0x15, 0x02, 0x00],
                MiBandService.UUID_SERVICE_HRM,
                MiBandService.UUID_CHARATERISTIC_HRM_CONTROL)
            await this.write([0x15, 0x02, 0x01],
                MiBandService.UUID_SERVICE_HRM,
                MiBandService.UUID_CHARATERISTIC_HRM_CONTROL)
        });

    }

    public async getPedometerStats() {
        const res = await this.ble.read({
            address: this.address,
            service: MiBandService.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandService.UUID_CHARACTERISTIC_STEPS
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
            service: MiBandService.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandService.UUID_CHARACTERISTIC_TIME
        });
        return this.parseDate(Buffer.from(this.ble.encodedStringToBytes(res.value)))
    }

    public async getBatteryInfo() {
        const res = await this.ble.read({
            address: this.address,
            service: MiBandService.UUID_SERVICE_MIBAND_1,
            characteristic: MiBandService.UUID_CHARACTERISTIC_BATTERY
        });

        console.log("response: " + this.ble.encodedStringToBytes(res.value))

        if (res.value.length <= 2) return -1;
        else return this.ble.encodedStringToBytes(res.value)[1]

    }

    public async sendNotification(notificationType: Notification): Promise<void> {
        await this.writeWithoutResponse([notificationType],
            MiBandService.UUID_SERVICE_IMMEDIATE_ALERT,
            MiBandService.UUID_CHARATERISTIC_VIBRATE);
    }


    public async disconnect() {
        this.notifyNewConnectionState(ConnectionState.DISCONNECTING);
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
                            console.log("CONNECTED");
                            await this.discoverServices();
                            this.notifyNewConnectionState(ConnectionState.AUTHENTICATING);
                            await new Authentication(this.address,this.ble).authenticate();
                            console.log("resolve");
                            this.notifyNewConnectionState(ConnectionState.AUTHENTICATED);

                            this.notifyNewConnectionState(ConnectionState.CONNECTED);
                            resolve();
                        }, async err => {
                            await this.disconnect();
                            await this.connect();

                            this.notifyNewConnectionState(ConnectionState.CONNECTED);
                            resolve()
                        });
                }
            } else {
                console.log("First Connection");
                this.ble.connect({ address: this.address, autoConnect: true })
                    .subscribe(async () => {
                        console.log("CONNECTED");
                        await this.discoverServices();
                        this.notifyNewConnectionState(ConnectionState.AUTHENTICATING);
                        await new Authentication(this.address,this.ble).authenticate();
                        this.notifyNewConnectionState(ConnectionState.AUTHENTICATED);
                        console.log("resolve");
                        this.notifyNewConnectionState(ConnectionState.CONNECTED);
                        resolve()
                    }, err => console.log(err));
            }

        })

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

    /**
     * Start ble Scan and find the address of the MiBand searching for a device that expose the miband's autentication service.
     * This must always be called the first time we use the service. 
     */
    public async findMiBand() {
        this.address = (await this.ble.startScan({ services: [MiBandService.UUID_SERVICE_AUTH] }).toPromise()).address
    }

    private notifyNewConnectionState(newState: ConnectionState){
        //notify observers
        this.connectionState.next(newState);
    }

}