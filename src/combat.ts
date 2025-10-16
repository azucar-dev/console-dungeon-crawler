import { Status, entity } from "./types"

export function attack(moves: string, stamina: number) {
    let damage: number = 0;
    let blocked: number = 0;
    let healed: number = 0;
    let status: Status = Status.okay;
    let stamUsed: number = 0;

    switch (moves.toLowerCase()) {
        case "punch":
            if (moveResult(1, 4) < 2) {
                console.log("You take a swing at the enemies head but miss horribly.");
                damage = 0;
            } else {
                damage = moveResult(15, 30);
                console.log(`\nYou hit the enemy for ${damage}!`);
                if (moveResult(0, 100) >= 75) {
                    status = Status.stunned;
                    console.log("You stunned the enemy!");
                }
            }
                stamUsed = stamina * 0.05;
            break;
        case "kick":
            

    }
    return { damage, blocked, healed, status, stamUsed };
}

function moveResult(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
