import Player from "./Player";
import { ShopItem } from "./Item";
import { availableItems, rarityWeights } from "../data/items";
import { weightedRandomSelection } from "../utils/weightedRandom";
import { Plant, Rarity } from './Plant';
import { Seed } from './Seed';


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

    // Filter available items to include only seeds
    const seedItems = availableItems.filter(
      (item) => item.getItemType() === "Seed"
    );

    if (seedItems.length === 0) {
      console.warn("No seed items available in the shop inventory.");
      return selectedItems; // Return an empty array if no seeds are available
    }

    for (let i = 0; i < count; i++) {
      const weights = seedItems.map((item) => rarityWeights[item.getRarity()]);

      // Select a random item from the filtered seed items
      const randomItem = weightedRandomSelection(seedItems, weights);
      selectedItems.push(randomItem);
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
    const item = this.items.find((shopItem) => shopItem.getName() === itemName);

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
    if (item.getItemType() === "Seed") {
      player
        .getSeedInventory()
        .push(new Seed(item.getName(), Rarity.common, 5));
    } else if (item.getItemType() === "Plant") {
      player
        .getPlantInventory()
        .push(new Plant(item.getName(), "", Rarity.common, 5, 5));
    }

    console.log(`${itemName} bought successfully!`);
    return true;
  }
}
