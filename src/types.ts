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

export type PlayerStats = {
  vitality: number;
  strength: number;
  dexterity: number;
  agility: number;
};

export type MoveResult = {
  damage: number;
  blocked: boolean;
  healed: number;
  status: string | undefined;
  stamUsed: number;
};

export type MoveContext = {
  roll: number; 
  hitChance: number; 
  statusRoll: number; 
  agilityBonus: number;
  stamina: number; 
  playerStats: PlayerStats;
  rollAnimation: (name: string) => Promise<void>;
  randomInt: (min: number, max: number) => number;
};