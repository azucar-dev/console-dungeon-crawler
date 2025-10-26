import { Item } from "./types";

export const weapons: string[] = [
 //   "Divine Falchion of God (SS)",
   // "Sword of Dark (S)",
    //"Gigantic slab of Steel (S)",
    //"Mythical Mace (A)",
    //"Frost Scalibur (B)",
    //"Sword of Pain (B)",
    "Damned Sword (C)",
    "Poisoned Knife (C)",
    "Practice Sword (D)",
    "Unarmed (D)"
];

export function moves(weapon: string): string[] {
    let moves: string[] = [];

    const match = weapon.match(/^(.*?)\s*\(.*\)$/);
    const weaponName = match ? match[1] : weapon;
    switch (weaponName.toLowerCase()) {
        case "divine falchion of god":
            moves = ["holy strike", "light wave", "divine judgment"];
            break;
        case "sword of dark":
            moves = ["shadow strike", "curse edge", "Shroud"];
            break;
        case "gigantic slab of steel":
            moves = ["overhead smash", "earth shatter", "slow swing"];
            break;
        case "mythical mace":
            moves = ["crushing blow", "heavenly crush", "stun bash"];
            break;
        case "frost scalibur":
            moves = ["ice slash", "frost nova", "freezing strike"];
            break;
        case "sword of pain":
            moves = ["bleeding cut", "anguish thrust", "scream slash"];
            break;
        case "damned sword":
            moves = ["cursed slash", "overhead swing", "life drain", "ghost lunge"];
            break;
        case "poisoned knife":
            moves = ["quick stab", "slice", "venom jab", "retreat"];
            break;
        case "practice sword":
            moves = ["strike", "stab", "parry", "step back"];
            break;
        case "unarmed":
            moves = ["punch", "kick", "hook", "dodge"];
            break;
        default:
            moves = ["Weapon not found."];
    }

    return moves;
}

export const items: Item = {
    falchion: {
        name: "Divine Falchion of God (SS)",
        desc: "A sharp, curved sword, believed to be created for the local God, Helios.",
        moves: [
            { name: "holy strike", desc: "A swift strike imbued with divine light, cutting through darkness." },
            { name: "light wave", desc: "Unleashes a radiant wave of light powerful enough to cut through steel armor." },
            { name: "divine judgment", desc: "Calls down a powerful AOE beam of light, incinerating anything in its path." }
        ]
    },
    darksword: {
        name: "Sword of Dark (S)",
        desc: "A heavy black blade, absorbs 99.999% of light.",
        moves: [
            { name: "shadow strike", desc: "Makes surroundings dark, making it hard for the enemy to dodge." },
            { name: "curse edge", desc: "Slices enemy with the cursed edge of the Sword of Dark, causing them to gradually lose health." },
            { name: "Shroud", desc: "Makes surroundings dark, making it hard for the enemy to hit you." }
        ]
    },
    slab: {
        name: "Gigantic slab of Steel (S)",
        desc: "It was too big to be called a sword...",
        moves: [
            { name: "overhead smash", desc: "A crushing overhead swing that deals massive damage." },
            { name: "earth shatter", desc: "Smashes the ground, sending tremors that may stun enemies." },
            { name: "slow swing", desc: "A heavy, ponderous swing, hard to land but devastating if it hits." }
        ]
    },
    mace: {
        name: "Mythical Mace (A)",
        desc: "Mace once wielded by barbarian warriors invading civil society.",
        moves: [
            { name: "crushing blow", desc: "Jump attack using your bodyweight as the main force behind the blow, breaks bones easily." },
            { name: "heavenly crush", desc: "Brings your strike down onto the enemy's head, smashing them into the ground." },
            { name: "stun bash", desc: "Uses the butt of the mace to stun enemies." }
        ]
    },
    frostsword: {
        name: "Frost Scalibur (B)",
        desc: "Sword belonging to nordic king Hafuldor II, bathed in icewater for 200 years before recovery.",
        moves: [
            { name: "ice slash", desc: "A freezing slash that chills enemy limbs, slowing movement." },
            { name: "frost nova", desc: "Releases a burst of cold energy around the wielder." },
            { name: "freezing strike", desc: "A piercing attack that may freeze enemies solid." }
        ]
    },
    painsword: {
        name: "Sword of Pain (B)",
        desc: "A cruel blade forged in blood, created screaming in agony before being tempered.",
        moves: [
            { name: "bleeding cut", desc: "A vicious cut that causes the enemy to bleed over time." },
            { name: "anguish thrust", desc: "A stabbing strike designed to pierce vital areas." },
            { name: "scream slash", desc: "A wide slash accompanied by a horrifying scream, freezing foes with fear." }
        ]
    },
    damnsword: {
        name: "Damned Sword (C)",
        desc: "A cursed weapon once carried by an old king who was corrupted by it.",
        moves: [
            { name: "cursed slash", desc: "A dark strike that slowly drains the enemy's strength." },
            { name: "overhead swing", desc: "Surprise your opponent with an unexpected overhead swing, potentionally dealing massive stun damage."},
            { name: "life drain", desc: "Siphons vitality from the target to heal yourself." },
            { name: "ghost lunge", desc: "A sudden forward attack that passes through armor with spectral force." }
        ]
    },
    poisonknife: {
        name: "Poisoned knife",
        desc: "A small blade coated with toxins from a Brazilian wandering spider.",
        moves: [
            { name: "quick stab", desc: "A fast, precise stab aiming for weak points." },
            { name: "slice", desc: "Try to slice your opponents tendons crippling them."},
            { name: "venom jab", desc: "Delivers a poisonous jab that harms over time." },
            { name: "retreat", desc: "Step back quickly to evade in battle." }
        ]
    },
    practicesword: {
        name: "Practice Sword",
        desc: "A training blade used by young children, about the length of an arm.",
        moves: [
            { name: "strike", desc: "A simple but effective swing for training purposes." },
            { name: "stab", desc: "Stab your opponent in a soft part of his body."},
            { name: "parry", desc: "Deflects an incoming attack, opening a chance for a riposte." },
            { name: "step back", desc: "Move backward to evade an attack and regain composure." }
        ]
    },
    unarmed: {
        name: "Unarmed",
        desc: "Your bare fists.",
        moves: [
            { name: "punch", desc: "A basic but solid punch." },
            { name: "kick", desc: "A swift kick aimed at the opponent's body." },
            { name: "hook", desc: "Test your boxing skills with a skillfully placed right hook."},
            { name: "dodge", desc: "Quickly evade an incoming attack." }
        ]
    }
};
