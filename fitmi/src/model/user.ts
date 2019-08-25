export interface User {
    _id: String;
    usernamame: String;
    password: String;
    firstName: String,
    lastName: String,
    gender: String,
    birthDate: Date,
    height: number,
    weight: number,
    score: number,
    badges: [],
    statistics: {
        totalCalories: number,
        totalSteps: number,
        totalKm: number,
        totalSessions: number,
        sessionStreak: number
    },
    sessions: [],
    accessToken: {
        id: String,
        expirationTime: number
    }
}