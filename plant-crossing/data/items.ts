import { Seed, Rarity } from '../types/Seed';

export const availableSeeds = [

  // common
  new Seed("rose", Rarity.common, 5, 4),
  new Seed("violet", Rarity.common, 4, 5),
  new Seed("sunflower", Rarity.common, 5, 6),
  new Seed("shrub", Rarity.common, 5, 5),
  new Seed("tropical_tree", Rarity.common, 5, 5),
  new Seed("reed", Rarity.common, 5, 5),

  // uncommon
  new Seed("wildflower", Rarity.uncommon, 6, 6),
  new Seed("poppy", Rarity.uncommon, 6, 6),
  //new Seed("yellow_cactus", Rarity.uncommon, 6, 6),

  // rare
  new Seed("tulip", Rarity.rare, 7, 7),
  //new Seed("short_cactus", Rarity.rare, 7, 7),

  // unique
  new Seed("cherry_blossom", Rarity.unique, 8, 8),
  new Seed("chrysanthemum", Rarity.unique, 8, 8),
  //new Seed("tall_cactus", Rarity.unique, 8, 8),

  // legendary
  new Seed("chromafruit", Rarity.legendary, 9, 9),
  //new Seed("pink_cactus", Rarity.legendary, 9, 9),
];

export const startingSeeds = availableSeeds.filter(
  seed => seed.rarity === Rarity.common || 
  seed.rarity === Rarity.uncommon
);