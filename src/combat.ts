import { entity, Status } from "./types";

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
export async function attack(moves: string, player: entity, enemy: entity, turn: boolean) {
    const attacker = turn ? player : enemy;
    const agility = attacker.stats[3];
    const strength = attacker.stats[1];
    const attackerStatus = attacker.status;
    const enemystatuss = turn ? enemy.status : player.status;
    let dodged: boolean = false;
    let blocked: boolean = false;

    const name: string = enemy.name;
    let damage: number = 0;
    let healed: number = 0;
    let enemyStatus: Status = Status.okay;
    let playerStatus: Status = Status.okay;
    let stamUsed: number = 0;
    const agilityBonus = agility * 3;
    const hitChancePercent = Math.min(95, 50 + agilityBonus);
    const hitChance = 21 - Math.floor(hitChancePercent / 5);
    let strengthBonus = strength * 3;
    const baseStam = 320;

    const rollPercent = randomInt(1, 20);
    const statusRoll = randomInt(0, 100);

    const logAction = (playerMsg: string, enemyMsg: string) => {
        console.log(turn ? playerMsg : enemyMsg);
    };

    async function rollAnimation(moveName: string) {
        process.stdout.write(`\n🎲 Rolling for ${moveName}\n`);
        for (let i = 0; i < 3; i++) {
            process.stdout.write(".");
            await new Promise(r => setTimeout(r, 200));
        }
        console.log(`Rolled: ${rollPercent} (Need ${hitChance}+ to hit)`);
    }
    let statusdmg: number = 0;
    switch (attackerStatus) {
        case 1:
            statusdmg = player.health - player.health * 0.1;
            logAction(
                `🩸You bled for ${statusdmg} damage.`,
                `🩸${name} bled for ${statusdmg} damage.`
            );
            break;
        case 2:
            statusdmg = player.health - player.health * 0.1;
            logAction(
                `☣️You were poisoned and took ${statusdmg} damage.`,
                `☣️${name} took ${statusdmg} damage.}`
            );
            break;
        case 3:
            logAction(
                `🥶 You are frozen in place and can't attack.`,
                `🥶${enemy} is frozen in place and can't attack.`
            );
            return [0, 0, 0, 0, 0, 0];
        case 4:
            statusdmg = player.health - player.health * 0.11;
            logAction(
                `🔥 You are burning for ${statusdmg} damage.`,
                `🔥${name} is burning for ${statusdmg} damage.`
            )
            break;
        case 5:
            logAction(
                `😲 You are stunned and can't attack.`,
                `😲${enemy} is stunned and can't attack.`
            );
            return [0, 0, 0, 0, 0, 0];
        case 6:
            strengthBonus -= strengthBonus * 0.75;

            logAction(
                `♿ You are crippled and can't attack properly`,
                `♿ ${name} is crippled and can't attack properly.`
            );
            return [0, 0, 0, 0, 0, 0];
        case 9:


    }

    switch (enemystatuss) {
        case 7:
            dodged = true;
            enemyStatus = 0;
            break;
        case 8:
            blocked = true;
            enemyStatus = 0;
            break;
    }

    switch (moves.toLowerCase()) {
        // unarmed
        case "punch": {
            const statusThreshold = 75 - agilityBonus;

            await rollAnimation("punch");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You take a swing at ${name}'s head, but miss horribly.`,
                    `❌ ${name} took a swing at your head, but missed horribly.`
                );
                damage = 0;
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {

                    damage += randomInt(15, 30) + strengthBonus;

                    if (rollPercent >= 19) {
                        logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                        damage = Math.floor(damage * 1.25);
                        logAction(
                            `😵 Your critical hit stunned ${name}!`,
                            `😵 ${name}'s critical hit stunned you!`
                        );
                        if (turn) {
                            enemyStatus = Status.stunned;
                        } else {
                            playerStatus = Status.stunned;
                        }
                    }

                    logAction(
                        `✅ You hit ${name} for ${damage} damage!`,
                        `✅ ${name} hit you for ${damage} damage!`
                    );

                    if (statusRoll >= statusThreshold && rollPercent < 19) {
                        if (turn) {
                            logAction("😵 You stunned the enemy!", "");
                            enemyStatus = Status.stunned;
                        } else {
                            logAction(`😵 ${name} stunned you!`, "");
                            playerStatus = Status.stunned;
                        }
                    }
                }
            }
            stamUsed = baseStam * 0.08;
            break;
        }

        case "hook": {
            const statusThreshold = 70 - (agilityBonus * 1.2);

            await rollAnimation("hook");

            if (rollPercent < hitChance) {
                logAction(
                    `❌As you struggle with ${name}, you try to go for a surprise hook; but it was underpowered`,
                    `❌${name} tries to catch you offgaurd with a hook, but misses.`);
                damage = 0;
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {
                    damage = randomInt(30, 60) + strengthBonus;

                    if (rollPercent >= 18) {
                        logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                        damage = Math.floor(damage * 1.25);
                        logAction(
                            `🤕Your critical hit stunned ${name}!`,
                            `🤕${name}'s critical hit stunned you!`);
                        if (turn) {
                            enemyStatus = Status.crippled;
                        } else {
                            playerStatus = Status.crippled;
                        }
                    }
                    logAction(
                        `✅Remembering your form, you go for a powerful right hook to ${name}'s jaw, turning it to dust. (${damage} damage)`,
                        `✅${name} goes for a powerful right hook, shattering your jaw, dealing ${damage} damage!`);

                    if (statusRoll >= statusThreshold && rollPercent <= 18) {
                        logAction(
                            `🤕Your hook stunned ${name}!`,
                            `🤕${name}'s hook stunned you!`
                        );
                        if (turn) {
                            enemyStatus = Status.crippled;
                        } else {
                            playerStatus = Status.crippled;
                        }
                    }
                }
                stamUsed = baseStam * 0.10;
            }
            break;
        }

        case "kick": {
            const statusThreshold = 70 - (agilityBonus * 1.1);

            await rollAnimation("kick");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You try to kick ${name} in the shin, but miss.`,
                    `❌ ${name} tries to kick you in the shin, but misses.`
                );
                damage = 0;
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {
                    damage = randomInt(25, 35) + strengthBonus;

                    if (rollPercent >= 19) {
                        logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                        damage = Math.floor(damage * 1.25);
                        logAction(
                            `🦵 Your critical kick crippled ${name}'s leg!`,
                            `🦵 ${name}'s critical kick crippled your leg!`
                        );
                        if (turn) {
                            enemyStatus = Status.crippled;
                        } else {
                            playerStatus = Status.crippled;
                        }
                    }

                    logAction(
                        `✅ You kicked ${name} in the shin and did ${damage} damage!`,
                        `✅ ${name} kicked you in the shin and did ${damage} damage!`
                    );

                    if (statusRoll >= statusThreshold && rollPercent < 19) {
                        if (turn) {
                            enemyStatus = Status.crippled;
                            logAction(`🦵 You crippled ${name}'s leg!`, "");
                        } else {
                            playerStatus = Status.crippled;
                            logAction(`🦵 ${name} crippled your leg!`, "");
                        }
                    }
                }
            }
            stamUsed = baseStam * 0.08;
            break;
        }

        case "dodge": {
            await rollAnimation("dodge");

            if (rollPercent < hitChance) {
                logAction(
                    "❌ You try to dodge, but fall over your own feet, leaving yourself open!",
                    `❌ ${name} tries to dodge, but falls over, leaving themselves open!`
                );
            } else {
                logAction(
                    `🛡️ You get ready to dodge ${name}'s next attack...`,
                    `🛡️ ${name} gets ready to dodge your next attack...`
                );
                playerStatus = Status.dodging;
            }
            stamUsed = baseStam * 0.07;
            break;
        }

        case "strike": {
            const statusThreshold = 70 - agilityBonus;

            await rollAnimation("strike");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You take a swing at ${name} (just like you practiced), but miss narrowly.`,
                    `❌ ${name} takes a swing at you, but misses narrowly.`
                );
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {
                    damage = randomInt(20, 35) + strengthBonus;
                    logAction(
                        `🗡️ You strike ${name} in the shoulder and did ${damage} damage!`,
                        `🗡️ ${name} strikes you in the shoulder and did ${damage} damage!`
                    );
                    if (rollPercent >= 19) {
                        logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                        damage = Math.floor(damage * 1.25);
                        logAction(
                            `😵 Your swing put ${name}'s shoulder out of its socket!`,
                            `😵 ${name}'s swing put your shoulder out of its socket!`
                        );
                        enemyStatus = Status.crippled;
                    }
                    if (statusRoll >= statusThreshold && rollPercent < 19) {
                        logAction(
                            `😵 Your swing put ${name}'s shoulder out of its socket!`,
                            `😵 ${name}'s swing put your shoulder out of its socket!`
                        );
                        enemyStatus = Status.crippled;
                    }
                }
            }
            stamUsed = baseStam * 0.07;
            break;
        }

        case "stab": {
            await rollAnimation("stab");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You try to find an opening for a stab, but ${name} redirected your blade as you went for it.`,
                    `❌You manage to redirect ${name}'s blade as he tries to go for a stab.`
                );
                damage = 0;
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {
                    damage = randomInt(30, 60) + strengthBonus;

                    if (rollPercent >= 18) {
                        logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                        damage = Math.floor(damage * 1.25);
                    }
                    logAction(
                        `🗡️ You stab ${name} in the neck, he doesnt start bleeding, but it sure as hell hurt (${damage} damage)`,
                        `🗡️ ${name} stabs you in the neck, dealing ${damage} damage!`
                    );
                }
            }
            stamUsed = stamUsed * 0.08;
            break;
        }

        case "parry": {
            let riposted: boolean = false;

            await rollAnimation("parry");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You attempt a parry, but ${name} overpowers you, leaving you open to an attack.`,
                    `❌ ${name} attempts a parry, but you overpower them, leaving them open.`
                );
                healed = -10;
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {
                    logAction(
                        `🗡️ You parry ${name}'s attack, leaving them open to a riposte.`,
                        `🗡️ ${name} parries your attack, leaving you open to a riposte.`
                    );
                    if (turn) {
                        const answer = await askQuestionWithTimeout("❗ Riposte? (TYPE 'R')❗", 3000);
                        if (answer === "r") {
                            riposted = true;
                        }
                    } else {
                        const res: number = randomInt(0, 1);
                        if (res === 1) {
                            riposted = true;
                        }
                    }

                    if (riposted) {
                        damage = randomInt(30, 40);
                        if (rollPercent >= 19) {
                            logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                            damage = Math.floor(damage * 1.25);
                        }
                        logAction(
                            "🗡️ You riposte successfully, dealing massive damage!",
                            "🗡️ Your opponent ripostes successfully, dealing massive damage!"
                        );
                    } else {
                        logAction(
                            "❌ You didn't respond in time, riposte failed.",
                            "❌ Your opponent hesitated and missed their riposte opportunity."
                        );
                    }
                }
            }
            stamUsed = baseStam * 0.10;
            break;
        }

        case "step back": {
            await rollAnimation("step back");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You try to step back, but ${name} started their attack before you could move.`,
                    `❌ ${name} tries to step back, but you attack before they can move.`
                );
            } else {
                logAction(
                    `🛡️ You step out of range of ${name}'s next attack...`,
                    `🛡️ ${name} steps out of range of your next attack...`
                );
                playerStatus = Status.dodging;
            }
            stamUsed = baseStam * 0.06;
            break;
        }

        // Poisoned knife
        case "quick stab": {
            const statusThreshold = 70 - (agilityBonus * 0.75);

            await rollAnimation("quick stab");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You try to stab ${name}... but can't find an opening.`,
                    `❌ ${name} tries to stab you... but can't find an opening.`
                );
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {
                    logAction(
                        `🔪 You stab ${name} in the chest!`,
                        `🔪 ${name} stabs you in the chest!`
                    );
                    damage = randomInt(30, 40) + strengthBonus;
                    if (rollPercent >= 19) {
                        damage = Math.floor(damage * 1.25);
                    }
                    if (statusRoll >= statusThreshold) {
                        logAction(
                            `🩸 ${name} starts bleeding!`,
                            `🩸 You start bleeding!`
                        );
                        enemyStatus = Status.bleeding;
                    }
                }
            }
            stamUsed = baseStam * 0.07;
            break;
        }

        case "venom jab": {
            const statusThreshold = 50 - agilityBonus;

            await rollAnimation("venom jab");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You attempt to poison ${name} with your knife...`,
                    `❌ ${name} attempts to poison you with their knife...`
                );
                if (rollPercent < 4) {
                    logAction(
                        `☣️ You accidentally scrape yourself with the blade, poisoning yourself.`,
                        `☣️ ${name} accidentally poisons themselves with their own blade.`
                    );
                    playerStatus = Status.poisoned;
                } else {
                    logAction(
                        `❌ You try to get in close to attack ${name}, but they push you back, making you lose balance.`,
                        `❌ ${name} tries to get in close to attack you, but you push them back and they lose balance.`
                    );
                }
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {
                    logAction(
                        `☠️ You hit ${name} with a slice across the forearm!`,
                        `☠️ ${name} hits you with a slice across your forearm!`
                    );
                    damage = randomInt(25, 35) + strengthBonus;
                    if (rollPercent >= 19) {
                        logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                        damage = Math.floor(damage * 1.25);
                    }

                    if (statusRoll >= statusThreshold) {
                        logAction(
                            `☠️ The poison starts affecting ${name}...`,
                            `☠️ The poison starts affecting you...`
                        );
                        enemyStatus = Status.poisoned;
                    } else {
                        logAction(
                            `🤢 ${name} throws up but seems unaffected...`,
                            `🤢 You throw up but seem unaffected...`
                        );
                    }
                }
            }
            stamUsed = baseStam * 0.09;
            break;
        }

        case "retreat": {
            await rollAnimation("retreat");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You make for a retreat, but ${name} catches on and attacks!`,
                    `❌ ${name} tries to retreat, but you catch them and attack!`
                );
            } else {
                logAction(
                    `🛡️ You retreat into the shadows, making yourself invisible to ${name}.`,
                    `🛡️ ${name} retreats into the shadows, disappearing from view.`
                );
                playerStatus = Status.dodging;
            }
            stamUsed = baseStam * 0.07;
            break;
        }

        // Damned sword
        case "cursed slash": {
            const statusThreshold = 70 - agilityBonus;

            await rollAnimation("cursed slash");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You go for a feinting slash at ${name}, but it is blocked.`,
                    `❌ ${name} goes for a feinting slash at you, but it is blocked.`
                );
                damage = 0;
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {
                    damage = randomInt(30, 45) + strengthBonus;
                    if (rollPercent >= 19) {
                        logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                        damage = Math.floor(damage * 1.25);
                    }
                    logAction(
                        `⚔️ You slash ${name} with your cursed blade, doing ${damage} damage!`,
                        `⚔️ ${name} slashes you with their cursed blade, doing ${damage} damage!`
                    );

                    if (statusRoll >= statusThreshold) {
                        logAction(
                            `☠️ The cursed blade's poison takes hold on ${name}.`,
                            `☠️ The cursed blade's poison takes hold on you.`
                        );
                        enemyStatus = Status.poisoned;
                    }
                }
            }
            stamUsed = baseStam * 0.07;
            break;
        }

        case "dark strike": {
            const statusThreshold = 65 - agilityBonus;

            await rollAnimation("dark strike");

            if (rollPercent < hitChance) {
                logAction(
                    `❌ You attempt a dark strike on ${name}, but miss.`,
                    `❌ ${name} attempts a dark strike on you, but misses.`
                );
            } else {
                if (dodged) {
                    damage = 0;
                    logAction(
                        `💨 ${name} dodged your attack!`,
                        `💨You dodged ${name}'s attack!`
                    );
                } else if (blocked) {
                    damage = 0;
                    logAction(
                        `🛡️ ${name} blocked your attack!`,
                        `🛡️You blocked ${name}'s attack!`
                    );
                } else {
                    damage = randomInt(30, 50) + strengthBonus;
                    if (rollPercent >= 19) {
                        logAction("💥 CRITICAL HIT!", "💥 CRITICAL HIT!");
                        damage = Math.floor(damage * 1.25);
                    }
                    logAction(
                        `🌑 You hit ${name} with a dark strike for ${damage} damage!`,
                        `🌑 ${name} hits you with a dark strike for ${damage} damage!`
                    );

                    if (statusRoll >= statusThreshold) {
                        logAction(
                            `😵 ${name} is weakened by the dark strike!`,
                            `😵 You are weakened by the dark strike!`
                        );
                        enemyStatus = Status.crippled;
                    }
                }
            }
            stamUsed = baseStam * 0.08;
            break;
        }

        case "lifedrain": {

            break;
        }

        default: {
            logAction(`❌ Unknown move "${moves}". No action taken.`, `❌ Unknown move "${moves}". No action taken.`);
            stamUsed = 0;
            break;
        }
    }

    if (turn) {
        return [damage, healed, stamUsed, enemyStatus, playerStatus, statusdmg];
    } else {
        return [damage, healed, stamUsed, playerStatus, enemyStatus, statusdmg];
    }
}

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
