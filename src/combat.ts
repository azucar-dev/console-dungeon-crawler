import { Status } from "./types";

async function askQuestionWithTimeout(question: string, timeout: number): Promise<string | null> {
    const readline = await import("readline");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const questionPromise = new Promise<string>((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });

    const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => {
            rl.close();
            resolve(null);
        }, timeout);
    });

    return Promise.race([questionPromise, timeoutPromise]);
}


export async function attack(moves: string, playerStats: number[], turn: boolean) {
    const agility = playerStats[3];
    const strength = playerStats[1];
    let damage: number = 0;
    let healed: number = 0;
    let enemyStatus: Status = Status.okay;
    let playerStatus: Status = Status.okay;
    let stamUsed: number = 0;


    const baseHitChance = 50;
    const agilityBonus = agility * 3;
    const strengthBonus = strength * 3;
    const hitChancePercent = Math.min(95, baseHitChance + agilityBonus);
    const hitChance = Math.ceil(hitChancePercent / 5);
    const baseStam = 320;

    const rollPercent = randomInt(1, 100);
    const roll = Math.ceil(rollPercent / 5);
    const statusRoll = randomInt(0, 100);

    const logAction = (playerMsg: string, enemyMsg: string) => {
        console.log(turn ? playerMsg : enemyMsg);
    };

    async function rollAnimation(moveName: string) {
        process.stdout.write(`\n🎲 Rolling for ${moveName}`);
        for (let i = 0; i < 3; i++) {
            process.stdout.write(".");
            await new Promise(r => setTimeout(r, 200));
        }
        console.log(` Rolled: ${roll} (Hit chance: ${hitChancePercent.toFixed(1)}%)`);
    }

    switch (moves.toLowerCase()) {
        // unarmed
        case "punch": {
            const statusThreshold = 75 - agilityBonus;

            await rollAnimation("punch");

            if (roll < hitChance) {
                logAction("❌ You take a swing at the enemy's head, but miss horribly.", "❌ The enemy takes a swing at your head, but misses horribly.");
                damage = 0;
            } else {
                damage = randomInt(15, 30) + strengthBonus;
                if (roll >= 18) {
                    logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                    damage = Math.floor(damage * 1.25);
                    logAction("😵 Your critical hit stunned the enemy!","😵 The enemy's critical hit stunned you!");
                    if (turn) {
                        enemyStatus = Status.stunned;
                    } else {
                        playerStatus = Status.stunned;
                    }
                }
                logAction(`✅ You hit the enemy for ${damage} damage!`, `✅ The enemy hit you for ${damage} damage!` );
                if (statusRoll <= statusThreshold && roll < 18) {
                    if (turn) {
                        logAction("😵 You stunned the enemy!", "😵 the enemy stunned You!");
                        enemyStatus = Status.stunned;
                    } else {
                        enemylogAction("😵 The enemy stunned you!");
                        playerStatus = Status.stunned;
                    }
                }
            }
            stamUsed = baseStam * 0.05;
            break;
        }

        case "kick": {
            const statusThreshold = 70 - (agilityBonus * 1.1);

            await rollAnimation("kick");

            if (roll < hitChance) {
                logAction("❌ You try to kick the enemy in the shin, but miss.");
                damage = 0;
            } else {
                damage = randomInt(25, 50) + strengthBonus;
                if (roll >= 18) {
                    console.logAction("💥 CRITICAL HIT!");
                    damage = Math.floor(damage * 1.25);
                    logAction("🦵 Your critical hit crippled the enemies leg!");
                    enemylogAction("🦵 The enemy cripped your leg!");
                    if (turn) {
                        enemyStatus = Status.crippled;
                    } else {
                        playerStatus = Status.crippled;
                    }
                }
                logAction(`✅ You kicked the enemy in the shin and did ${damage} damage!`);
                if (statusRoll <= statusThreshold && roll < 18) {
                    enemyStatus = Status.crippled;
                    logAction("🦵 You crippled the enemy's leg!");
                }
            }
            stamUsed = baseStam * 0.07;
            break;
        }

        case "dodge": {
            await rollAnimation("dodge");

            if (roll < hitChance) {
                logAction("❌ You try to dodge, but fall over your own feet, leaving yourself open!");
            } else {
                logAction("🛡️ You get ready to dodge your opponent's next attack...");
                playerStatus = Status.dodging;
            }
            stamUsed = baseStam * 0.05;
            break;
        }

        // practice sword
        case "strike": {
            const statusThreshold = 70 - agilityBonus;

            await rollAnimation("strike");

            if (roll < hitChance) {
                logAction("❌ You take a swing (just like you practiced), but you miss the target narrowly.");
            } else {
                damage = randomInt(20, 35) + strengthBonus;
                logAction(`🗡️ You strike your enemy in the shoulder! and did ${damage} damge!`);
                if (roll > 18) {
                    logAction("💥 CRITICAL HIT!");
                    damage = Math.floor(damage * 1.25);
                    logAction("😵 Your swing put your enemies' shoulder out of it's socket!");
                    enemyStatus = Status.crippled;
                }
                if (roll <= statusThreshold && roll < 18) {
                    logAction("😵 Your swing put your enemies' shoulder out of it's socket!");
                    enemyStatus = Status.crippled;
                }
            }
            stamUsed = baseStam * 0.07;
            break;
        }

        case "parry": {
            let riposted: boolean = false;

            await rollAnimation("parry");

            if (roll < hitChance) {
                logAction("❌ You attempt a parry, but the enemy overpowers you, leaving you open to an attack.");
                healed = -10;
            } else {
                logAction(`🗡️ You parry the enemies' attack, leaving them open to a riposte`);
                const answer = await askQuestionWithTimeout("❗ Riposte? (type 'r') ", 2500);
                if (answer === "r") {
                    riposted = true;
                }

                if (riposted) {
                    damage = randomInt(30, 40);
                    if (roll > 18) {
                        logAction("💥 CRITICAL HIT!")
                        damage = Math.floor(damage * 1.25)
                    }
                    logAction("🗡️ You riposte successfully, dealing massive damage!");
                } else {
                    logAction("❌ You didn't respond in time, riposte failed.");
                }

            }
            stamUsed = baseStam * 0.10
            break;

        }

        case "step back": {
            await rollAnimation("step back");

            if (roll < hitChance) {
                logAction("❌ You try to step back, but the opponent started his attack before you could get out of the way.");
            } else {
                logAction("🛡️ You step out of range of your enemies next attack...");
                playerStatus = Status.dodging;
            }
            stamUsed = baseStam * 0.05;
            break;
        }

        // poisoned knife
        case "quick stab": {
            const statusThreshold = 70 - (agilityBonus * 0.75);

            await rollAnimation("quick stab");

            if (roll < hitChance) {
                logAction("❌ You try to stab your enemy... but you can't find an opening.");
            } else {
                logAction("🔪 You stab your opponent in the chest!");
                damage = randomInt(30, 40) + strengthBonus;
                if (roll > 18) {
                    damage = Math.floor(damage * 1.25);
                }
                if (roll <= statusThreshold) {
                    logAction("🩸 Your opponent starts bleeding!");
                    enemyStatus = Status.bleeding;
                }
            }
            stamUsed = baseStam * 0.06;
            break;
        }

        case "venom jab": {
            const statusThreshold = 50 - agilityBonus;

            await rollAnimation("venom jab");

            if (roll < hitChance) {
                logAction("❌ You attempt to poison your enemy with you knife...");
                if (roll < 4) {
                    logAction("☣️ You accidentally scrape yourself with the blade, poisoning yourself.");
                    playerStatus = Status.poisoned;
                } else {
                    logAction("❌ You try to get in close to attack your enemy, but he pushes you backwards, leading you to lose balance.");
                }
            } else {
                logAction("☠️ You hit your opponents with a slice across his forearm!");
                damage = randomInt(25, 35) + strengthBonus;
                if (roll > 18) {
                    logAction("💥 CRITICAL HIT!");
                    damage = Math.floor(damage * 1.25);
                }

                if (roll <= statusThreshold) {
                    logAction("☠️ The poison starts having an affect on your opponent...");
                    enemyStatus = Status.poisoned;
                } else {
                    logAction("🤢 Your enemy throws up but seem to be unaffected...");
                }
            }
            stamUsed = baseStam * 0.07;
            break;
        }

        case "retreat": {
            await rollAnimation("retreat");

            if (roll < hitChance) {
                logAction("❌ You make for a retreat, but your opponent catches on and stops you by attacking!");
            } else {
                logAction("🛡️ You step retreated to the shadows, making you invisible to the opponent");
                playerStatus = Status.dodging;
            }
            stamUsed = baseStam * 0.05;
            break;
        }

        // Damned sword
        case "cursed slash": {
            const statusThreshold = 70 - agilityBonus;

            await rollAnimation("cursed slash");

            if (roll < hitChance) {
                logAction("❌ You go for a feinting slash at the enemy, but it was blocked.");
            } else {
                logAction("🗡️ You go for a feinting slash at the enemy...");
                damage = randomInt(30, 40) + strengthBonus;
                if (roll > 18) {
                    logAction("💥 CRITICAL HIT!");
                    damage = Math.floor(damage * 1.25);
                }
                if (roll <= statusThreshold) {
                    logAction("🤬 Your slash cursed the enemy, his strength is waning...");
                    enemyStatus = Status.cursed;
                }
            }
            stamUsed = baseStam * 0.08;
            break;
        }

        case "life drain": {

            await rollAnimation("life drain");

            if (roll < hitChance) {
                logAction("❌ You try to steal your enemy's life force for yourself, but he resisted the spell.");
            } else {
                healed = randomInt(20, 45);
                damage = healed;
                logAction(`😈 You aim your sword at your enemy, a stream of black particles appear from his mouth, entering yours.. (HP UP: ${healed}`);
            }
            stamUsed = baseStam * 0.10;
            break;
        }

        case "ghost lunge": {
            await rollAnimation("ghost lunge");

            if (roll < hitChance) {
                logAction("❌ You attempt a spectral lunge, but your enemy sidesteps just in time.");
            } else {
                logAction("👻 You phase forward, your weapon passing through armor with ghostly precision!");
                damage = randomInt(40, 55) + strengthBonus;
                if (roll > 18) {
                    logAction("💥 CRITICAL HIT!");
                    damage = Math.floor(damage * 1.35);
                }
            }
            stamUsed = baseStam * 0.10;
            break;
        }

    }
    return { damage, healed, playerStatus: Status[playerStatus], enemyStatus: Status[enemyStatus], stamUsed: Math.round(stamUsed) };

}



export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
