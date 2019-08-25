import { SessionType } from './session-type';

export interface HeartRateValue{
    timestamp: string;
    value: number
}

export interface Session {
    start: string;
    end: string;
    type: SessionType;
    steps: number;
    calories: number;
    distance: number;
    heart_frequency: HeartRateValue[];
}