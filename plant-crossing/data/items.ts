// data/items.ts
import { ShopItem } from '../data-structures/Item';

// Define the Rarity enum
export enum Rarity {
  common,
  rare,
  unique,
  legendary,
}

// Mapping for coin values based on rarity
export const coinMapping: { [key in Rarity]: number } = {
  [Rarity.common]: 2,
  [Rarity.rare]: 3,
  [Rarity.unique]: 4,
  [Rarity.legendary]: 5,
};

// Define the weights for rarity
export const rarityWeights: { [key in Rarity]: number } = {
  [Rarity.common]: 50,
  [Rarity.rare]: 30,
  [Rarity.unique]: 15,
  [Rarity.legendary]: 5,
};

// Define the list of available items
export const availableItems = [
  new ShopItem("Rose Seed", 10, "Seed", Rarity.common),
  new ShopItem("Cactus Plant", 20, "Plant", Rarity.common),
  new ShopItem("Orchid Seed", 50, "Seed", Rarity.rare),
  new ShopItem("Bonsai Plant", 100, "Plant", Rarity.unique),
  new ShopItem("Golden Lily Plant", 500, "Plant", Rarity.legendary),
];
