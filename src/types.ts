export enum Status {
    "okay",
    "bleeding",
    "poisoned",
    "frozen",
    "burning",
    "stunned",
    "crippled",
    "dodging",
    "blocking",
    "cursed",
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

export interface Move {
    name: string;
    desc: string;
    status?: Status;
    staminacost?: number;
}

export interface ItemDetails {
    name: string;
    desc: string;
    moves?: Move[];
}

export interface Item {
    falchion: ItemDetails;
    darksword: ItemDetails;
    slab: ItemDetails;
    mace: ItemDetails;
    frostsword: ItemDetails;
    painsword: ItemDetails;
    damnsword: ItemDetails;
    poisonknife: ItemDetails;
    practicesword: ItemDetails;
    unarmed: ItemDetails;
}
