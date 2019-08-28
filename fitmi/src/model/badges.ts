import { Badge, BadgeGoal } from './badge';
import { Session } from './session';
import { User } from './user';

export class Badges {
    private static readonly BADGE_IMAGES_EXTENSION = '.svg';

    static readonly DISTANCE_5: Badge<Session> = Badges.createDistanceBadge(5);
    static readonly DISTANCE_10: Badge<Session> = Badges.createDistanceBadge(10);
    static readonly DISTANCE_50: Badge<Session> = Badges.createDistanceBadge(50);

    static readonly STEPS_15000: Badge<Session> = Badges.createStepsBadge(15000);
    static readonly STEPS_20000: Badge<Session> = Badges.createStepsBadge(20000);
    static readonly STEPS_25000: Badge<Session> = Badges.createStepsBadge(25000);
    static readonly STEPS_30000: Badge<Session> = Badges.createStepsBadge(30000);
    static readonly STEPS_40000: Badge<Session> = Badges.createStepsBadge(40000);
    static readonly STEPS_50000: Badge<Session> = Badges.createStepsBadge(50000);

    static readonly TIME_1: Badge<Session> = Badges.createTimeBadge(1);
    static readonly TIME_100: Badge<Session> = Badges.createTimeBadge(100);
    static readonly TIME_150: Badge<Session> = Badges.createTimeBadge(150);
    static readonly TIME_200: Badge<Session> = Badges.createTimeBadge(200);
    static readonly TIME_300: Badge<Session> = Badges.createTimeBadge(300);

    static readonly SESSION_STREAK_2: Badge<User> = Badges.createSessionStreakBadge(2);
    static readonly SESSION_STREAK_5: Badge<User> = Badges.createSessionStreakBadge(5);

    static readonly SESSION_BADGES: Badge<Session>[] = [
        Badges.DISTANCE_5, Badges.DISTANCE_10, Badges.DISTANCE_50,

        Badges.STEPS_15000, Badges.STEPS_20000, Badges.STEPS_25000, Badges.STEPS_30000, Badges.STEPS_40000, Badges.STEPS_50000,

        Badges.TIME_1, Badges.TIME_100, Badges.TIME_150, Badges.TIME_200, Badges.TIME_300
    ];

    static readonly GLOBAL_BADGES: Badge<User>[] = [
        Badges.SESSION_STREAK_2, Badges.SESSION_STREAK_5
    ];

    constructor() { }


    private static createDistanceBadge(distanceThreshold: number): Badge<Session> {
        return new Badge<Session>('Distanza ' + distanceThreshold + 'km',
            'Percorri ' + distanceThreshold + 'km in una sessione',
            BadgeGoal.DISTANCE,
            distanceThreshold,
            'badge_distance_' + distanceThreshold + Badges.BADGE_IMAGES_EXTENSION,
            s => {
                return s.pedometer.distance >= distanceThreshold;
            });
    }

    private static createStepsBadge(stepsThreshold: number): Badge<Session> {
        return new Badge<Session>('Passi ' + stepsThreshold,
            'Fai ' + stepsThreshold + 'passi in una sessione',
            BadgeGoal.STEPS,
            stepsThreshold,
            'badge_steps_' + stepsThreshold + Badges.BADGE_IMAGES_EXTENSION,
            s => {
                return s.pedometer.steps >= stepsThreshold;
            });
    }

    private static createTimeBadge(timeThreshold: number): Badge<Session> {
        return new Badge<Session>('Tempo ' + timeThreshold + 'minuti',
            'Raggiungi ' + timeThreshold + 'minuti in una sessione',
            BadgeGoal.TIME,
            timeThreshold,
            'badge_time_' + timeThreshold + Badges.BADGE_IMAGES_EXTENSION,
            s => {
                const diffMs = (s.end.getTime() - s.start.getTime());
                const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                return diffMins >= timeThreshold;
            });
    }

    private static createSessionStreakBadge(sessionStreak: number): Badge<User> {
        return new Badge<User>('Session Streak ' + sessionStreak,
            'Registra un attività per ' + sessionStreak + 'giorni di fila',
            BadgeGoal.SESSION_STREAK,
            sessionStreak,
            'badge_session_streak_' + sessionStreak + Badges.BADGE_IMAGES_EXTENSION,
            u => {
                return u.statistics.sessionStreak >= sessionStreak;
            });
    }
}
