import { SessionType } from './session-type';

export interface HeartRateValue{
    timestamp: Date;
    value: number
}

export interface Session {
    start: Date;
    end: Date;
    type: SessionType;
    steps: number;
    calories: number;
    distance: number;
    heart_frequency: HeartRateValue[]

}