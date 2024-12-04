import { Seed, Rarity } from '../types/Seed';

export const availableSeeds = [

  // common
  new Seed("Rose", Rarity.common, 5, 4),
  new Seed("Violet", Rarity.common, 4, 5),
  new Seed("Sunflower", Rarity.common, 5, 6),
  new Seed("Cactus", Rarity.common, 7, 9),
  new Seed("Fern", Rarity.common, 4, 7),
  new Seed("Daisy", Rarity.common, 1, 3),
  new Seed("Lavender", Rarity.common, 4, 5),
  new Seed("Marigold", Rarity.common, 5, 5),
  new Seed("Carnation", Rarity.common, 6, 6),

  // uncommon
  new Seed("Wildflower", Rarity.uncommon, 6, 6),

  // rare
  new Seed("Tulip", Rarity.rare, 7, 7),

  // unique
  new Seed("Cherry Blossom", Rarity.unique, 8, 8),

  // legendary
  new Seed("Chromafruit", Rarity.legendary, 9, 9),
];

export const startingSeeds = availableSeeds.filter(
  seed => seed.rarity === Rarity.common || 
  seed.rarity === Rarity.uncommon
);

