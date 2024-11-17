// data/items.ts
import { ShopItem } from '../data-structures/Item';
import { Seed, Rarity, rarityValue} from '../data-structures/Seed';

// base growth time and max water are on scales of 1-10, 5 as default
export const availableSeeds = [
  // common seeds
  new Seed("Rose", Rarity.common, 5, 5),
  new Seed("Lavender", Rarity.common, 5, 5),
  new Seed("Sunflower", Rarity.common, 3, 6),
  new Seed("Fern", Rarity.common, 4, 4),
  new Seed("Daisy", Rarity.common, 3, 3),
  
  // uncommon seeds
  new Seed("Orchid", Rarity.uncommon, 2, 4),
  new Seed("Tulip", Rarity.uncommon, 4, 6),
  new Seed("Marigold Seed", Rarity.rare, 5, 5),
  
  // rare seeds
  new Seed("Cherry Blossom", Rarity.rare, 5, 5),
  new Seed("Cactus", Rarity.rare, 7, 10),
  new Seed("Carnation Seed", Rarity.rare, 6, 6),

  // unique seeds
  new Seed("Bonsai", Rarity.unique, 10, 7),
  new Seed("Venus Flytrap", Rarity.unique, 4, 6),

  // legendary seeds
  new Seed("Golden Lily Plant", Rarity.legendary, 10, 10),
  new Seed("Four Leaf Clover", Rarity.legendary, 1, 1),
];
