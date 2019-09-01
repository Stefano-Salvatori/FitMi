import { SessionType } from './session-type';
import { PedometerData } from 'src/app/miband/pedometer-data';

export interface HeartRateValue {
    timestamp: Date;
    value: number;
}

export const HeartRateRange = {
    LIGHT: {
        low: 0,
        high: 60
    },
    WEIGHT_LOSS: {
        low: 60,
        high: 100
    },
    AEROBIC: {
        low: 100,
        high: 160
    },
    ANAEROBIC: {
        low: 160,
        high: 250
    },
};


export interface Session {
    start: Date;
    end: Date;
    type: SessionType;
    pedometer: PedometerData;
    heart_frequency: HeartRateValue[];
    gps_path: Coordinates[];
}
