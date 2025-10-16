import { Status } from "./types"

export async function attack(moves: string, stamina: number, playerStats: number[]) {
    const agility = playerStats[3];
    let damage: number = 0;
    let blocked: number = 0;
    let healed: number = 0;
    let status: Status = Status.okay;
    let stamUsed: number = 0;

    const baseHitChance = 50;          // 50% base
    const agilityBonus = agility * 3;  // each Agility point adds 3%
    const hitChancePercent = Math.min(95, baseHitChance + agilityBonus); // cap at 95%
    const hitChance = Math.ceil(hitChancePercent / 5); // scale to 1-20

    const rollPercent = randomInt(1, 100);
    const roll = Math.ceil(rollPercent / 5); // 1-20 scale
    const statusRoll = randomInt(0, 100);

    // Helper function for rolling animation
    async function rollAnimation(moveName: string) {
        process.stdout.write(`\n🎲 Rolling for ${moveName}`);
        for (let i = 0; i < 3; i++) {
            process.stdout.write(".");
            await new Promise(r => setTimeout(r, 200));
        }
        console.log(` Rolled: ${roll} (Hit chance: ${hitChancePercent.toFixed(1)}%)`);
    }

    switch (moves.toLowerCase()) {
        case "punch": {
            const statusThreshold = 75 - agilityBonus;

            await rollAnimation("punch");

            if (roll < hitChance) {
                console.log("❌ You take a swing at the enemy's head, but miss horribly.");
                damage = 0;
            } else {
                damage = randomInt(15, 30);
                if (roll >= 18) {
                    console.log("💥 CRITICAL HIT!");
                    damage = Math.floor(damage * 1.25);
                    console.log("😵 Your critical hit stunned the enemy!");
                    status = Status.crippled;
                }
                console.log(`✅ You hit the enemy for ${damage} damage!`);
                if (statusRoll <= statusThreshold && roll < 18) {
                    status = Status.stunned;
                    console.log("😵 You stunned the enemy!");
                }
            }
            stamUsed = stamina * 0.05;
            break;
        }

        case "kick": {
            const statusThreshold = 70 - (agilityBonus * 1.1);

            await rollAnimation("kick");

            if (roll < hitChance) {
                console.log("❌ You try to kick the enemy in the shin, but miss.");
                damage = 0;
            } else {
                damage = randomInt(25, 50);
                if (roll >= 18) {
                    console.log("💥 CRITICAL HIT!");
                    damage = Math.floor(damage * 1.25);
                    console.log("🦵 Your critical hit crippled the enemies leg!");
                    status = Status.crippled;
                }
                console.log(`✅ You kicked the enemy in the shin and did ${damage} damage!`);
                if (statusRoll <= statusThreshold && roll < 18) {
                    status = Status.crippled;
                    console.log("🦵 You crippled the enemy's leg!");
                }
            }
            stamUsed = stamina * 0.07;
            break;
        }

        case "dodge": {
            await rollAnimation("dodge");

            if (roll < hitChance) {
                console.log("❌ You try to dodge, but fall over your own feet, leaving yourself open!");
            } else {
                console.log("🛡️ You get ready to dodge your opponent's next attack...");
                status = Status.dodging;
            }
            stamUsed = stamina * 0.05;
            break;
        }
    }

    return { damage, blocked, healed, status: Status[status], stamUsed: Math.round(stamUsed) };
}

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
