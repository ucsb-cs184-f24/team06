import Player from "../data-structures/Player";

class Shop {
  private items: ShopItem[]; // list of items available in the shop

  public constructor() {
    this.items = [
      new ShopItem("Rose Seed", 10, "Seed"),
      new ShopItem("Cactus Plant", 20, "Plant"),
      // add more items here, just examples above
    ];
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
