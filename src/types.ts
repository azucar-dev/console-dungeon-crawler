export enum Status {
    "okay",
    "bleeding",
    "poisoned",
    "frozen",
    "burning",
    "stunned",
    "crippled",
    "dodging",
    "blocking"
}

export interface entity {
    lvl: number;
    name: string;
    health: number;
    stamina: number;
    stats: number[];
    weapon: string;
    turn: boolean;
    status: Status;
}
