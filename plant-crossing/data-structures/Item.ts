import { baseGestureHandlerProps } from "react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon";
import { Seed, Rarity } from "./Seed";

export class Item extends Seed{
  private name: string; // name of item
  private rarity: Rarity;
  private baseGrowthTime: number;
  private price: number; // cost of item

  public constructor(name: string, price: number) {
    super(name, rarity, baseGrowthTime, this.maxWater);
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

export class ShopItem extends Item {
  private itemType: "Plant" | "Seed"; // type of item sold in shop
  private rarity: Rarity; // rarity of the item

  public constructor(name: string, price: number, itemType: "Plant" | "Seed", rarity: Rarity) {
    super(name, price);
    this.itemType = itemType;
    this.rarity = rarity;
  }

  public getItemType() {
    return this.itemType;
  }

  public getRarity() {
    return this.rarity;
  }
}
