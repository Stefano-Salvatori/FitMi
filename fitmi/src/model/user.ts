import { Badge } from './badge';

export class User {
    // tslint:disable-next-line: variable-name
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    profileImg: string;
    gender: string;
    birthDate: Date;
    height: number;
    weight: number;
    score: number;
    badges: string[];
    statistics: {
        totalCalories: number,
        totalSteps: number,
        totalKm: number,
        totalSessions: number,
        sessionStreak: number
    };
    sessions: [];
    accessToken: {
        id: string,
        expirationTime: number
    };

    constructor() { }
}
