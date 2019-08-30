import { Badge } from './badge';

export class User {
    // tslint:disable-next-line: variable-name
    constructor(public _id: string = '',
                public username: string = '',
                public password: string = '',
                public firstName: string = '',
                public lastName: string = '',
                public profileImg: string = '',
                public gender: string = '',
                public birthDate: Date = new Date(),
                public height: number = 0,
                public weight: number = 0,
                public score: number = 0,
                public badges: string[] = [],
                public statistics: {
                    totalCalories: number,
                    totalSteps: number,
                    totalKm: number,
                    totalSessions: number,
                    sessionStreak: number
                } = {
                        totalCalories: 0,
                        totalSteps: 0,
                        totalKm: 0,
                        totalSessions: 0,
                        sessionStreak: 0
                    },
                public sessions: [] = [],
                public accessToken: {
                    id: string,
                    expirationTime: number
                } = { id: '', expirationTime: 0 },
    ) { }

    static fromUser(user: User): User {
        return new User(user._id,
            user.username, user.password, user.firstName, user.lastName,
            user.profileImg, user.gender, user.birthDate, user.height,
            user.weight, user.score, user.badges, user.statistics, user.sessions, user.accessToken);
    }

    get level(): number {
        return this.smallestPowerOf2GreaterThan(this.score / 100);
    }

    private smallestPowerOf2GreaterThan(n: number): number {
        let pow = 0;
        while (Math.pow(2, pow) < n) {
            pow++;
        }
        return pow;
    }
}
