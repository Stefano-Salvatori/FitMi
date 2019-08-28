
export enum BadgeGoal {
    STEPS= 'STEPS',
    CALORIES= 'CALORIES',
    TIME= 'TIME',
    DISTANCE= 'DISTANCE',
    SESSION_STREAK= 'SESSION_STREAK'
}

export class Badge<T> {
    // tslint:disable: variable-name
    constructor(private name: string,
                private description: string,
                private type: BadgeGoal,
                private threshold: number,
                private image: string,
                private check: (s: T) => boolean) {

    }

    getName(): string {
        return this.name;
    }

    getDescription(): string {
        return this.description;
    }

    getImage(): string {
        return this.image;
    }

    getType(): BadgeGoal {
        return this.type;
    }

    getThreshold(): number {
        return this.threshold;
    }

    checkSuccess(s: T): boolean {
        return this.check(s);
    }
}
