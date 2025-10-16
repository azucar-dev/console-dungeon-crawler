import * as readline from 'readline';

enum Status {
    "okay",
    "bleeding",
    "poisoned",
    "frozen",
    "burning",
    "stunned"
}

interface entity {
    lvl: number;
    name: string;
    health: number;
    stamina: number;
    stats: number[];
    weapon: string;
    turn: boolean;
    status: Status;
}

function askQuestion(query: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise<string>((resolve) => {
        rl.question(query, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

const weapons: string[] = [
    "Divine Falchion of God (SS)",
    "Sword of Light (S)",
    "Sword of Dark (S)",
    "Gigantic slab of Steel (S)",
    "Mythical Mace (A)",
    "Magic Staff (A)",
    "Royal Spear (A)",
    "Frost Scalibur (B)",
    "Sword of Pain (B)",
    "Bow of Giants (B)",
    "Ptonomeus' Zweihander (B)",
    "Damned Sword (C)",
    "Knight's Halberd (C)",
    "Orphan's Sword (C)",
    "Poisoned Knife (C)",
    "Crossbow (C)",
    "Practice Sword (D)",
    "Orc's dagger (D)",
    "Unarmed (D)"
];

function moves(weapon: string): string[] {
    let moves: string[] = [];

    const match = weapon.match(/^(.*?)\s*\(.*\)$/);
    const weaponName = match ? match[1] : weapon;
    switch (weaponName.toLowerCase()) {
        case "divine falchion of god":
            moves = ["holy strike", "light wave", "divine judgment"];
            break;
        case "sword of light":
            moves = ["radiant slash", "blinding flash", "light barrier"];
            break;
        case "sword of dark":
            moves = ["shadow strike", "curse edge", "dark mist"];
            break;
        case "gigantic slab of steel":
            moves = ["overhead smash", "earth shatter", "slow swing"];
            break;
        case "mythical mace":
            moves = ["crushing blow", "heavenly crush", "stun bash"];
            break;
        case "magic staff":
            moves = ["fireball", "ice lance", "arcane shield"];
            break;
        case "royal spear":
            moves = ["piercing thrust", "whirlwind stab", "guard stance"];
            break;
        case "frost scalibur":
            moves = ["ice slash", "frost nova", "freeze strike"];
            break;
        case "sword of pain":
            moves = ["bleeding cut", "anguish thrust", "scream slash"];
            break;
        case "bow of giants":
            moves = ["giant shot", "arrow rain", "knockback shot"];
            break;
        case "ptonomeus' zweihander":
            moves = ["titan cleave", "brutal swing", "guard break"];
            break;
        case "damned sword":
            moves = ["cursed slash", "life drain", "ghost lunge"];
            break;
        case "knight's halberd":
            moves = ["sweeping arc", "defensive jab", "high thrust"];
            break;
        case "orphan's sword":
            moves = ["desperate strike", "quick slash", "evade"];
            break;
        case "poisoned knife":
            moves = ["quick stab", "venom jab", "retreat"];
            break;
        case "crossbow":
            moves = ["rapid fire", "aimed shot", "reload"];
            break;
        case "practice sword":
            moves = ["strike", "parry", "step back"];
            break;
        case "orc's dagger":
            moves = ["stab", "slice", "block"];
            break;
        case "unarmed":
            moves = ["punch", "kick", "dodge"];
            break;
        default:
            moves = ["Weapon not found."];
    }

    return moves;
}

function attack(moves: string) {
    let damage: number = 0;
    let blocked: number = 0;
    let healed: number = 0;
    let status: Status = Status.okay;
    let stamUsed: number = 0;

    switch (moves.toLowerCase()) {
        case "punch":
            damage = moveResult(15, 30);
            console.log(`\nYou hit the enemy for ${damage}!`);
            if (moveResult(0, 100) >= 75) {
                status = Status.stunned;
                console.log("You stunned the enemy!");
            }
            break;
        case "kick":

    }
    return { damage, blocked, healed, status, stamUsed };
}

function moveResult(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


async function statsInitialize(): Promise<[number[], string[]]> {
    let points: number = 25;
    const stats: number[] = [];
    const statNames: string[] = ["Vitality", "Strength", "Dexterity", "Agility", "Charisma"]

    for (let i: number = 0; i < 5; i++) {
        let isvalid: boolean = false;
        while (!isvalid) {
            console.log(`Current points: ${points}\n`);

            const input = await askQuestion(`${statNames[i]}: `);
            const inputInt = parseInt(input);

            if (isNaN(inputInt) || inputInt < 0) {
                console.log("Invalid input. Please enter a valid number.");
                continue;
            }

            if (inputInt > 20) {
                console.log("Stat cant be more than 20!");
                continue;
            }

            if (inputInt > points) {
                console.log(`You only have ${points} points left!`)
                continue;
            }

            points -= inputInt;
            stats.push(inputInt);
            isvalid = true;
        }
    }
    while (points > 0) {
        console.log(`You didnt use all your points! (points left: ${points})`);
        const confirm: string = await askQuestion("Are you sure you want to continue? (y/n) ");
        switch (confirm.toLowerCase()) {
            case "y":
                points = 0;
                break;
            case "n":
                console.log("Restarting stat selection...\n")
                return await statsInitialize();
            default:
                console.log("Please respond with y or n")
                continue;
        }
    }

    return [stats, statNames];
}

function generateEnemyStats(playerstats: number[]): number[] {
    const stats: number[] = [0, 0, 0, 0, 0];
    let total: number = 0;

    for (let i = 0; i < playerstats.length; i++) {
        total += playerstats[i];
    }

    for (let i = 0; i < total; i++) {
        const index = Math.floor(Math.random() * playerstats.length);
        stats[index]++;
    }
    return stats;
}

function createEnemy(playerstats: number[], playerlevel: number): entity {

    const names: string[] = ["Sir Diesalot of Lothric",
        "Baron of Backstabs",
        "Mournful Greg, Wielder of Two Left Feet",
        "Vex the Roll-Spammer",
        "Lady Agony of Frame-Drop Keep",
        "Dread Knight Parrius the Unskilled",
        "Old Man Ganksworth",
        "Grimgut, Devourer of Estus",
        "Soltaire the Forever Summoned",
        "Father Falloff, First of the Ledge",
        "Pontiff Cringehardt",
        "Archbishop of Lag",
        "The Nameless No-Hit Tryhard",
        "Dungbro the Flatulent",
        "Count Disconnectus",
        "Jort the Rotund, Bane of Stamina Bars",
        "Sir Stunlock-a-Lot",
        "Mistress Marginalia, AFK in the Catacombs",
        "The Forgotten Build, Scaler of Nothing",
        "Hollow Chad of Irithyll",
        "Peter the undivine"];

    const random: number = Math.floor(Math.random() * names.length);
    const weapon: number = Math.floor(Math.random() * weapons.length);
    const enemyStats = generateEnemyStats(playerstats);

    const enemy: entity = {
        lvl: playerlevel,
        name: names[random],
        health: 100 * (enemyStats[0] * 0.64),
        stamina: 100 * (enemyStats[3] * 0.64),
        stats: generateEnemyStats(playerstats),
        weapon: weapons[weapon],
        turn: false,
        status: Status.okay
    }

    return enemy;
}

async function main() {
    let statconfirm: boolean = false;
    let stats: number[] = [];
    let statname: string[] = [];

    console.log("WELCOME TO THE AZUCAR DUNGEON CRAWLER!");
    const name = await askQuestion("For starters, what is your name? ");
    console.log(`\nHello, ${name}! Please enter your stats!`);
    console.log("Assign points to stats to make your character stronger!");

    while (!statconfirm) {
        const statsresult = await statsInitialize();
        stats = statsresult[0];
        statname = statsresult[1];
        console.log(`\nYour current stats are: `);
        for (let i: number = 0; i < stats.length; i++) {
            console.log(`${statname[i]}: ${stats[i]}`);
        }
        while (true) {
            const statreset: string = await askQuestion("\nWould you like to redo your stats? (Y/N) ");
            switch (statreset.toLowerCase()) {
                case "y":
                    statconfirm = false;
                    break;
                case "n":
                    statconfirm = true;
                    break;
                default:
                    console.log("Not a valid answer! please reply with (y or n)");
                    continue;
            }
            break;
        }
    }
    if (stats[0] === 0) {
        stats[0] = 1;
    }
    console.log("Stats locked! Proceeding...\n");

    const player: entity = {
        lvl: 1,
        name: name,
        health: 50 * (stats[0] * 0.64),
        stamina: 100 * (stats[0] * 0.64),
        stats: stats,
        weapon: weapons[18],
        turn: false,
        status: Status.okay
    }

    const enemy: entity = createEnemy(stats, player.lvl);

    console.log(enemy);
    console.log(player);
    console.log(moves(player.weapon));
    console.log(attack("punch"));

}

main();