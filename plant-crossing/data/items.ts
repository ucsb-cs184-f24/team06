// data/items.ts
import { Seed, Rarity } from '../types/Seed';

// base growth time and max water are on scales of 1-10, 5 as default
export const availableSeeds = [
  // common seeds
  new Seed("roses", Rarity.common, 5, 5, 20),
  new Seed("violets", Rarity.common, 3, 3, 21),
  new Seed("sunflower", Rarity.common, 3, 6, 24),
  new Seed("wildflowers", Rarity.common, 5, 5, 28),

  // uncommon seeds
  new Seed("wildflowers", Rarity.common, 5, 5, 28),

  // rare seeds
  new Seed("tulips", Rarity.uncommon, 4, 6, 27),

  // unique seeds
  new Seed("cherry_blossom", Rarity.rare, 5, 5, 6),

  // legendary seeds
  new Seed("chromafruit", Rarity.legendary, 2, 4, 24),
];

// Starting seeds: seeds available to the player when they register an account
export const startingSeeds = availableSeeds.filter(
  seed => seed.rarity === Rarity.common || 
  seed.rarity === Rarity.uncommon
);
