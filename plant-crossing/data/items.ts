import { Seed, Rarity } from '../types/Seed';

export const availableSeeds = [

  // common
  new Seed("roses", Rarity.common, 5, 4),
  new Seed("violets", Rarity.common, 4, 5),
  new Seed("sunflower", Rarity.common, 5, 6),

  // uncommon
  new Seed("wildflowers", Rarity.uncommon, 6, 6),

  // rare
  new Seed("tulips", Rarity.rare, 7, 7),

  // unique
  new Seed("cherry_blossom", Rarity.unique, 8, 8),

  // legendary
  new Seed("chromafruit", Rarity.legendary, 9, 9),
];

export const startingSeeds = availableSeeds.filter(
  seed => seed.rarity === Rarity.common || 
  seed.rarity === Rarity.uncommon
);
