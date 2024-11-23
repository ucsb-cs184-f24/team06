// data/items.ts
import { ShopItem } from '../data-structures/Item';
import { Seed, Rarity, rarityValue} from '../types/Seed';

// base growth time and max water are on scales of 1-10, 5 as default
export const availableSeeds = [
  // common seeds
  new Seed("Rose", Rarity.common, 5, 5, 20),
  new Seed("Lavender", Rarity.common, 5, 5, 28),
  new Seed("Sunflower", Rarity.common, 3, 6, 24),
  new Seed("Tulip", Rarity.uncommon, 4, 6, 27),
  new Seed("Daisy", Rarity.common, 3, 3, 21),
  
  // uncommon seeds
  new Seed("Orchid", Rarity.uncommon, 2, 4, 24),
  new Seed("Fern", Rarity.common, 4, 4, 17),
  new Seed("Marigold", Rarity.rare, 5, 5, 19),
  
  // rare seeds
  new Seed("Cherry Blossom", Rarity.rare, 5, 5, 6),
  new Seed("Cactus", Rarity.rare, 7, 10, 12),
  new Seed("Carnation", Rarity.rare, 6, 6, 23),

  // unique seeds
  new Seed("Bonsai", Rarity.unique, 10, 7, 10),
  new Seed("Venus Flytrap", Rarity.unique, 4, 6, 22),

  // legendary seeds
  new Seed("Golden Lily Plant", Rarity.legendary, 10, 10, 25),
  new Seed("Four Leaf Clover", Rarity.legendary, 1, 1, 26),
];

// Starting seeds: seeds available to the player when they register an account
export const startingSeeds = availableSeeds.filter(
  seed => seed.rarity === Rarity.common || 
  seed.rarity === Rarity.uncommon
);