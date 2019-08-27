import { GoalType } from './goal';



export enum SessionType {
    RUN = 'Corsa',
    WALK = 'Camminata',
    CYCLING = 'Ciclismo',
    GYM = 'Palestra',
    SWIM = 'Nuoto',
    RUN_INDOOR = 'Indoor'
}

// tslint:disable-next-line: no-namespace
export namespace SessionType {
    const BASE_ICON_PATH = '../../assets/icon/fit_activities_icons';
    const ICON_EXTENSION = '.png';

    export function getPossibleGoals(sessionType: SessionType): GoalType[] {
        switch (sessionType) {
            case SessionType.RUN:
                return [GoalType.DISTANCE, GoalType.CALORIES, GoalType.TIME, GoalType.STEPS];
            case SessionType.WALK:
                return [GoalType.DISTANCE, GoalType.CALORIES, GoalType.TIME, GoalType.STEPS];
            case SessionType.CYCLING:
                return [GoalType.DISTANCE, GoalType.CALORIES, GoalType.TIME];
            case SessionType.GYM:
                return [GoalType.CALORIES, GoalType.TIME];
            case SessionType.SWIM:
                return [GoalType.DISTANCE, GoalType.CALORIES, GoalType.TIME];
            case SessionType.RUN_INDOOR:
                return [GoalType.DISTANCE, GoalType.CALORIES, GoalType.TIME, GoalType.STEPS];
            default:
                return [];
        }
    }

    export function getIcon(sessionType: SessionType): string {
        switch (sessionType) {
            case SessionType.RUN:
                return BASE_ICON_PATH + '/running' + ICON_EXTENSION;
            case SessionType.WALK:
                return BASE_ICON_PATH + '/walking' + ICON_EXTENSION;
            case SessionType.CYCLING:
                return BASE_ICON_PATH + '/bicycle' + ICON_EXTENSION;
            case SessionType.GYM:
                return BASE_ICON_PATH + '/gym' + ICON_EXTENSION;
            case SessionType.SWIM:
                return BASE_ICON_PATH + '/swimming' + ICON_EXTENSION;
            case SessionType.RUN_INDOOR:
                return BASE_ICON_PATH + '/training' + ICON_EXTENSION;
            default:
                return '';
        }
    }

    export function getRoute(sessionType: SessionType): string {
        switch (sessionType) {
            case SessionType.RUN:
                return 'running/goal_settings';
            case SessionType.WALK:
                return 'walking/goal_settings';
            case SessionType.CYCLING:
                return 'cycling/goal_settings';
            case SessionType.GYM:
                return 'gym/goal_settings';
            case SessionType.SWIM:
                return 'swimming/goal_settings';
            case SessionType.RUN_INDOOR:
                return 'indoor-run/goal_settings';
            default:
                return '';
        }

    }
}
