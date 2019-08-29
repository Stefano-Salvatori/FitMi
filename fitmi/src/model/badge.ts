import { GoalType } from './goal';
import { User } from './user';
import { Session } from './session';

export enum BadgeGoal {
    STEPS = 'STEPS',
    CALORIES = 'CALORIES',
    TIME = 'TIME',
    DISTANCE = 'DISTANCE',
    SESSION_STREAK = 'SESSION_STREAK'
}

export enum BadgeScope {
    GLOBAL = 'GLOBAL',
    SESSION = 'SESSION',
}

export interface DatabaseBadge {
    _id: string;
    name: string;
    description: string;
    type: BadgeGoal;
    scope: BadgeScope;
    threshold: number;
    image: string;

}

export interface Badge<T> extends DatabaseBadge {
    check: (s: T) => boolean;

}

export class SessionBadge implements Badge<Session> {
    // tslint:disable-next-line: variable-name
    _id: string;
    name: string;
    description: string;
    type: BadgeGoal;
    scope: BadgeScope = BadgeScope.SESSION;
    threshold: number;
    image: string;
    check: (s: Session) => boolean;
    constructor(dbBadge: DatabaseBadge) {
        this._id = dbBadge._id;
        this.name = dbBadge.name;
        this.description = dbBadge.description;
        this.type = BadgeGoal[dbBadge.type];
        this.scope = BadgeScope[dbBadge.scope];

        this.threshold = dbBadge.threshold;
        this.image = dbBadge.image;
        switch (this.type) {
            case BadgeGoal.STEPS:
                this.check = (s: Session) => s.pedometer.steps >= this.threshold;
                break;
            case BadgeGoal.CALORIES:
                this.check = (s: Session) => s.pedometer.calories >= this.threshold;
                break;
            case BadgeGoal.DISTANCE:
                this.check = (s: Session) => s.pedometer.distance >= this.threshold;
                break;
            case BadgeGoal.TIME:
                this.check = (s: Session) => {
                    const diffMs = (s.end.getTime() - s.start.getTime());
                    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
                    return diffMins >= this.threshold;
                };
                break;
            default:
                this.check = (s: Session) => false;
                break;
        }
    }




}

export class GlobalBadge implements Badge<User> {
    // tslint:disable-next-line: variable-name
    _id: string;
    name: string;
    description: string;
    type: BadgeGoal;
    scope: BadgeScope = BadgeScope.SESSION;
    threshold: number;
    image: string;
    check: (s: User) => boolean;
    constructor(dbBadge: DatabaseBadge) {
        this._id = dbBadge._id;
        this.name = dbBadge.name;
        this.description = dbBadge.description;
        this.type = BadgeGoal[dbBadge.type];
        this.scope = BadgeScope[dbBadge.scope];
        this.threshold = dbBadge.threshold;
        this.image = dbBadge.image;
        switch (this.type) {
            case BadgeGoal.SESSION_STREAK:
                this.check = (u: User) => u.statistics.sessionStreak >= this.threshold;
                break;
            default:
                this.check = (u: User) => false;
                break;
        }
    }

}
