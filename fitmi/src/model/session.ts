import { SessionType } from './session-type';
import { PedometerData } from 'src/app/miband/pedometer-data';

export interface HeartRateValue {
    timestamp: Date;
    value: number;
}

export interface Session {
    start: Date;
    end: Date;
    type: SessionType;
    pedometer: PedometerData;
    heart_frequency: HeartRateValue[];
}
