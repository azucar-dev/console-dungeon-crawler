
export const weapons: string[] = [
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

export function moves(weapon: string): string[] {
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