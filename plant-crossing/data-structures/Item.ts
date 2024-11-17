import { baseGestureHandlerProps } from "react-native-gesture-handler/lib/typescript/handlers/gestureHandlerCommon";
import { Seed, Rarity } from "./Seed";

export class ShopItem extends Seed{
  private seed: Seed;
  private price: number; // cost of item

  public constructor(
    seed: Seed,
    price: number = 5
  ) {
    super(seed.getType(), seed.getRarity(), seed.getGrowthTime(), seed.getMaxWater());
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
    return this.seed.getType();
  }

  public setPrice(price: number){
    this.price = price;
  }
}