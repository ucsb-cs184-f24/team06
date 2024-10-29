import Player from "./Player";
import { ShopItem } from "./Item";
import { Rarity, availableItems, rarityWeights } from "../data/items";
import { weightedRandomSelection } from "../utils/weightedRandom";

class Shop {
  private items: ShopItem[]; // list of items available in the shop
  private lastUpdated: Date | null; // timestamp of the last update

  public constructor() {
    // initialize shop and check if it needs an update
    this.items = [];
    this.lastUpdated = this.loadLastUpdatedTimestamp(); // load from persistent storage

    // check if the shop needs an initial refresh
    if (this.shouldRefresh()) {
      this.refreshItems();
    } else {
      // load the saved items (if you have them saved persistently)
      this.items = this.loadShopItems();
    }

    // save the current items
    this.saveShopItems();
  }

  // determine if the shop should refresh based on the last updated time
  private shouldRefresh(): boolean {
    if (!this.lastUpdated) return true; // if there's no last update, refresh

    const now = new Date();
    const next12AMor12PM = this.getNext12AMor12PM(now);

    // check if the current time is past the next 12:00 am or 12:00 pm pst
    return now >= next12AMor12PM;
  }

  // helper to get the next 12:00 am or 12:00 pm pst
  private getNext12AMor12PM(now: Date): Date {
    const currentHour = now.getUTCHours();
    const isMorningRefresh = currentHour < 12;
    const nextRefreshHour = isMorningRefresh ? 12 : 0;

    // calculate next refresh time in utc (adjust based on your server’s timezone if needed)
    const nextRefresh = new Date(now);
    nextRefresh.setUTCHours(nextRefreshHour, 0, 0, 0);

    if (nextRefresh <= now) {
      nextRefresh.setUTCHours(nextRefreshHour + 12);
    }

    return nextRefresh;
  }

  // refresh the shop items
  private refreshItems() {
    this.items = this.generateRandomItems(3);
    this.lastUpdated = new Date();
    console.log("shop inventory updated at: ", this.lastUpdated);

    // save the new timestamp to storage
    this.saveLastUpdatedTimestamp();
  }

  // helper to load last updated timestamp from  storage
  private loadLastUpdatedTimestamp(): Date | null {
    const storedTimestamp = localStorage.getItem("shopLastUpdated");
    return storedTimestamp ? new Date(storedTimestamp) : null;
  }

  // save last updated timestamp to persistent storage
  private saveLastUpdatedTimestamp() {
    if (this.lastUpdated) {
      localStorage.setItem("shopLastUpdated", this.lastUpdated.toISOString());
    }
  }

  // load shop items
  private loadShopItems(): ShopItem[] {
    // load items from storage
    return [];
  }

  // save shop items 
  private saveShopItems() {
    // save items to storage
    
  }

  // helper method to generate random set of seed items
  private generateRandomItems(count: number): ShopItem[] {
    const selectedItems: ShopItem[] = [];
    const seedItems = availableItems.filter(item => item.getItemType() === "Seed"); // filter for only seeds

    for (let i = 0; i < count; i++) {
      const weights = seedItems.map((item) => rarityWeights[item.getRarity()]);
      const randomItem = weightedRandomSelection(seedItems, weights);
      selectedItems.push(randomItem);
    }

    return selectedItems;
  }

  public getItems() {
    return this.items;
  }

  // method to buy an item
  public buyItem(player: Player, itemName: string) {
    const item = this.items.find((shopItem) => shopItem.getName() === itemName);

    if (!item) {
      console.log("item not found.");
      return false;
    }

    if (player.getCoins() < item.getPrice()) {
      console.log("not enough coins.");
      return false;
    }

    // deduct the price from the player's coins
    player.setCoins(player.getCoins() - item.getPrice());

    // add the item to the player's inventory based on the item type
    if (item.getItemType() === "Seed") {
      player.getSeedInventory().push(new Seed(item.getName(), Rarity.common, 5));
    }

    console.log(`${itemName} bought successfully!`);
    return true;
  }
}

export default Shop;
