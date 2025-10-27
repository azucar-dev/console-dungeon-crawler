import * as readline from 'readline';
import { entity, Status } from "./types";
import { attack, randomInt } from "./combat";
import { weapons, moves } from "./items";

export function askQuestion(query: string): Promise<string> {
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
        "Peter the undivine",
        "The knight who says 'NI'"];

    const random: number = Math.floor(Math.random() * names.length);

    const weapon: number = Math.floor(Math.random() * weapons.length);
    const enemyStats = generateEnemyStats(playerstats);

    const enemy: entity = {
        lvl: playerlevel,
        name: names[random],
        health: 100 * (enemyStats[0] * 0.64),
        stamina: 10 * (enemyStats[3] * 0.64),
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
        weapon: weapons[1],
        turn: false,
        status: Status.okay
    }

    const enemy: entity = createEnemy(stats, player.lvl);


    async function combat() {
        while (player.health > 0 && enemy.health > 0) {
            const availableMoves = moves(player.weapon);
            console.log("\n⚔️ Your turn...");
            console.log(`❤️CURRENT HEALTH: ${Math.round(player.health)}`);
            console.log(`💚CURRENT STAMINA: ${Math.round(player.stamina)}`);

            let validMove = false;

            while (!validMove) {
                console.log("Which move do you want to use? ");
                const chosenMove = await askQuestion(`Available moves: ${availableMoves.join(", ")}`);

                const normalizedMove = chosenMove.toLowerCase();

                if (chosenMove === "q") {
                    process.exit(0);
                }

                if (!availableMoves.map(m => m.toLowerCase()).includes(normalizedMove)) {
                    console.log("That move isn't available for your weapon!");
                } else {
                    const result = await attack(normalizedMove, player, enemy, true);
                    validMove = true;


                    enemy.health -= result[0];
                    player.health += result[1];
                    player.stamina -= result[2];
                    enemy.status = result[3];
                    player.status = result[4]

                    console.log(player)

                }
            }

            if (enemy.health <= 0) {
                console.log("💀 The enemy has been defeated!");
                break;
            }
            await new Promise(res => setTimeout(res, 3000));

            console.log("\n⚔️ Enemy's turn...");
            console.log(`❤️CURRENT HEALTH: ${Math.round(enemy.health)}`);
            console.log(`💚CURRENT STAMINA: ${Math.round(enemy.stamina)}`);
            const weaponMoves = moves(enemy.weapon);
            const chosenMoveIndex = randomInt(0, weaponMoves.length - 1);
            const enemyMove = weaponMoves[chosenMoveIndex].toLowerCase();

            console.log(`⚔️ Enemy uses ${enemyMove}!`);
            const enemyResult = await attack(enemyMove, player, enemy, false);
            console.log(player);


            player.health -= enemyResult[0];
            enemy.health += enemyResult[1];
            enemy.stamina -= enemyResult[2];
            player.status = enemyResult[3];

            console.log(player);

            if (player.health <= 0) {
                console.log("☠️ You have been defeated...");
                process.exit(0);
            }
        }
    }
    combat();
}
main();
