// Similar to items.ts
// List of random seeds to choose for starting players
// Future issue: combine seeds.ts and items.ts
// Future issue: every user gets their own set of starting seeds

import { Seed } from '../data-structures/Seed';
import { Rarity } from '../data-structures/Plant';

export const startingSeeds = [
    new Seed("Rose Seed", Rarity.common, 3, 5),
    new Seed("Cactus Seed", Rarity.common, 7, 9),
    new Seed("Sunflower Seed", 2, 3),
    new Seed("Fern Seed", Rarity.common, 4, 7),
    new Seed("Daisy Seed", Rarity.common, 1, 3),
    new Seed("Lavender Seed", Rarity.common, 4, 5),
    new Seed("Marigold Seed", Rarity.common, 5, 5),
    new Seed("Carnation Seed", Rarity.common, 6, 6),
];

export function getStartingInventory(){
    let seeds = [];
    for(let i = 0; i < 8; i++){
        seeds.push(startingSeeds[Math.floor(Math.random()* startingSeeds.length)])
    }
    console.log(seeds);
    return seeds;
}

