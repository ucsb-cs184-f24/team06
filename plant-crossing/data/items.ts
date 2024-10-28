// data/items.ts
import { ShopItem } from '../data-structures/Item';

// define the Rarity enum
export enum Rarity {
  common,
  rare,
  unique,
  legendary,
}

// mapping for coin values based on rarity
export const coinMapping: { [key in Rarity]: number } = {
  [Rarity.common]: 2,
  [Rarity.rare]: 3,
  [Rarity.unique]: 4,
  [Rarity.legendary]: 5,
};

// define the weights for rarity
export const rarityWeights: { [key in Rarity]: number } = {
  [Rarity.common]: 50,
  [Rarity.rare]: 30,
  [Rarity.unique]: 15,
  [Rarity.legendary]: 5,
};

export const availableItems = [
    // common items
    new ShopItem("Rose Seed", 10, "Seed", Rarity.common),
    new ShopItem("Rose Plant", 15, "Plant", Rarity.common),
    new ShopItem("Cactus Seed", 8, "Seed", Rarity.common),
    new ShopItem("Cactus Plant", 20, "Plant", Rarity.common),
    new ShopItem("Sunflower Seed", 10, "Seed", Rarity.common),
    new ShopItem("Sunflower Plant", 18, "Plant", Rarity.common),
    new ShopItem("Fern Seed", 12, "Seed", Rarity.common),
    new ShopItem("Fern Plant", 18, "Plant", Rarity.common),
    new ShopItem("Daisy Seed", 10, "Seed", Rarity.common),
    new ShopItem("Daisy Plant", 17, "Plant", Rarity.common),
    new ShopItem("Lavender Seed", 13, "Seed", Rarity.common),
    new ShopItem("Lavender Plant", 25, "Plant", Rarity.common),
  
    // rare items
    new ShopItem("Orchid Seed", 50, "Seed", Rarity.rare),
    new ShopItem("Orchid Plant", 75, "Plant", Rarity.rare),
    new ShopItem("Tulip Seed", 45, "Seed", Rarity.rare),
    new ShopItem("Tulip Plant", 60, "Plant", Rarity.rare),
    new ShopItem("Cherry Blossom Seed", 70, "Seed", Rarity.rare),
    new ShopItem("Cherry Blossom Plant", 90, "Plant", Rarity.rare),
  
    // unique items
    new ShopItem("Bonsai Seed", 90, "Seed", Rarity.unique),
    new ShopItem("Bonsai Plant", 100, "Plant", Rarity.unique),
    new ShopItem("Venus Flytrap Seed", 130, "Seed", Rarity.unique),
    new ShopItem("Venus Flytrap Plant", 150, "Plant", Rarity.unique),
  
    // legendary items
    new ShopItem("Golden Lily Seed", 450, "Seed", Rarity.legendary),
    new ShopItem("Golden Lily Plant", 500, "Plant", Rarity.legendary),
  ];
  
