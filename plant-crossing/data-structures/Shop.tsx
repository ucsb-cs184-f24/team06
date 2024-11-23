import Player from "../data-structures/Player";
import { ShopItem } from "../data-structures/Item";
import { availableSeeds } from "../data/items";
import { rarityValue } from "../types/Seed";
import { weightedRandomSelection } from "../utils/weightedRandom";

export default class Shop {
  private items: ShopItem[]; // list of items available in the shop
  private lastUpdated: Date; // timestamp of the last update

  public constructor() {
    // initialize shop with a random set of 5 items
    this.items = this.generateRandomItems(5);
    this.lastUpdated = new Date();

    // set up an interval to update items every 12 hours
    setInterval(() => {
      this.refreshItems();
    }, 12 * 60 * 60 * 1000); // 12 hours in milliseconds
  }

  // helper method to generate random set of items
  private generateRandomItems(count: number): ShopItem[] {
    const selectedItems: ShopItem[] = [];

    if (availableSeeds.length === 0) {
      console.warn("No seed items available in the shop inventory.");
      return selectedItems; // Return an empty array if no seeds are available
    }

    const weights = availableSeeds.map((item) => 50/rarityValue[item.rarity]);
    for (let i = 0; i < count; i++) {
      // Select a random seed based on rarity
      const randomSeed = weightedRandomSelection(availableSeeds, weights);
      selectedItems.push(new ShopItem(randomSeed, randomSeed.getPrice()));
    }
    return selectedItems;
  }

  // method to refresh items
  private refreshItems() {
    this.items = this.generateRandomItems(5);
    this.lastUpdated = new Date();
    console.log("Shop inventory updated at: ", this.lastUpdated);
  }

  public getItems() {
    return this.items;
  }

  // method to buy an item
  public buyItem(player: Player, itemName: string) {
    const item = this.items.find((shopItem) => shopItem.getSeed().type === itemName);

    if (!item) {
      console.log("Item not found.");
      return false;
    }

    if (player.getCoins() < item.getPrice()) {
      console.log("Not enough coins.");
      return false;
    }

    // deduct the price from the player's coins
    player.setCoins(player.getCoins() - item.getPrice());

    // add the item to the player's inventory based on the item type
    player.getSeedInventory().push(item.getSeed());

    console.log(`${itemName} bought successfully!`);
    return true;
  }
}
