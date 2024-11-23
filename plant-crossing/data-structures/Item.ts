import { baseGestureHandlerProps } from "react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon";
import { Seed, Rarity } from "../types/Seed";

export class ShopItem extends Seed{
  private seed: Seed;
  private price: number; // cost of item

  public constructor(
    seed: Seed,
    price: number = 5
  ) {
    super(seed.type, seed.rarity, seed.growthTime, seed.maxWater);
    this.seed = seed;
    this.price = price;
  }

  public getSeed() {
    return this.seed;
  }

  public getPrice() {
    return this.price;
  }

  public getName(){
    return this.seed.type;
  }

  public setPrice(price: number){
    this.price = price;
  }
}