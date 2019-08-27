export interface User {
    _id: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: Date;
    height: number;
    weight: number;
    score: number;
    badges: [];
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
}
