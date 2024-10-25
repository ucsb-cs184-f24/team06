class Item {
  private name: string; // name of item
  private price: number; // cost of item

  public constructor(name: string, price: number) {
    this.name = name;
    this.price = price;
  }

  public getName() {
    return this.name;
  }

  public getPrice() {
    return this.price;
  }
}

class ShopItem extends Item {
  private itemType: "Plant" | "Seed"; // type of item sold in shop

  public constructor(name: string, price: number, itemType: "Plant" | "Seed") {
    super(name, price);
    this.itemType = itemType;
  }

  public getItemType() {
    return this.itemType;
  }
}
