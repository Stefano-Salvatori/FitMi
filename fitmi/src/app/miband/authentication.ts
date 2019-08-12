import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { MiBandGatt } from './mibandGatt';

export enum AuthenticationState{
    STEP0,
    STEP1,
    STEP2,
    STEP3
}

export class Authentication {
    //Authentication constants
    private SECRET_KEY_STRING = '0123456789@ABCDE';
    private SECRET_KEY_BYTES = this.ble.stringToBytes(this.SECRET_KEY_STRING);
    private STEP1_MESSAGE = [0x01, 0x08].concat(Array.from(this.SECRET_KEY_BYTES));
    private STEP2_MESSAGE = [0x02, 0x08];
    private STEP3_MESSAGE = [0x03, 0x08];
    private SEND_SECRET_KEY_RESPONSE = [0x10, 0x01, 0x01];
    private REQ_AUTH_KEY_RESPONSE = [0x10, 0x02, 0x01];
    private AUTH_OK = [0x10, 0x03, 0x01];

    private authenticationState: BehaviorSubject<AuthenticationState> = new BehaviorSubject(AuthenticationState.STEP0);

    constructor(private address: string, private ble: BluetoothLE) {
    }

    public getAuthenticationStateObservable(): Observable<AuthenticationState>{
        return this.authenticationState;
    }

  
    public async authenticate(): Promise<void> {
        console.log("Starting auth");
        return new Promise((resolve, reject) => {
            this.ble.subscribe({
                address: this.address,
                service: MiBandGatt.UUID_SERVICE_AUTH,
                characteristic: MiBandGatt.UUID_CHARACTERISTIC_AUTH
            }).subscribe(async (res) => {
                if (res.status == 'subscribed') {
                    console.log("STEP 1");
                    this.authenticationState.next(AuthenticationState.STEP1);
                    await this.step1();
                }
                else {
                    const resBytes = this.ble.encodedStringToBytes(res.value).slice(0, 3);
                    switch (resBytes.toString()) {
                        case this.SEND_SECRET_KEY_RESPONSE.toString():
                            console.log("STEP 2");
                            this.authenticationState.next(AuthenticationState.STEP2);
                            await this.step2();
                            break;
                        case this.REQ_AUTH_KEY_RESPONSE.toString():
                            console.log("STEP 3");
                            this.authenticationState.next(AuthenticationState.STEP3);
                            await this.step3(this.ble.encodedStringToBytes(res.value).slice(3, 19));
                            break;
                        case this.AUTH_OK.toString():
                            console.log("authenticated");
                            resolve();
                            break;
                    }
                }
            }, () => {
                reject();
            });
        });
    }

    private async step1() {
        await this.writeWithoutResponse(this.STEP1_MESSAGE, MiBandGatt.UUID_SERVICE_AUTH, MiBandGatt.UUID_CHARACTERISTIC_AUTH);
    }
    private async step2() {
        await this.writeWithoutResponse(this.STEP2_MESSAGE, MiBandGatt.UUID_SERVICE_AUTH, MiBandGatt.UUID_CHARACTERISTIC_AUTH);
    }
    private async step3(bytesToEncode: Uint8Array) {
        var aesjs = require('aes-js');
        const aesCtr = new aesjs.ModeOfOperation.ecb(this.SECRET_KEY_BYTES);
        const encryptedBytes = aesCtr.encrypt(bytesToEncode);
        const bytesToSend = Array.from(this.STEP3_MESSAGE).concat(Array.from(encryptedBytes));
        await this.writeWithoutResponse(bytesToSend, MiBandGatt.UUID_SERVICE_AUTH, MiBandGatt.UUID_CHARACTERISTIC_AUTH);
    }
    private async writeWithoutResponse(value: number[], service: string, characteristic: string): Promise<void> {
        this.ble.write({
            address: this.address,
            service: service,
            characteristic: characteristic,
            type: 'noResponse',
            value: this.ble.bytesToEncodedString(Uint8Array.from(value))
        });
    }
}
