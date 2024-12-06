import { Seed, Rarity, rarityValue } from "../types/Seed";

export class ShopItem extends Seed {
  private seed: Seed;
  private price: number;

  public constructor(seed: Seed) {
    super(seed.type, seed.rarity, seed.growthTime, seed.maxWater);
    this.seed = seed;

    // calculate price dynamically based on rarity and growth time
    this.price = this.calculatePrice(seed);
  }

  private calculatePrice(seed: Seed): number {
    // base price
    const basePrice = 50; // minimum price for any item, raised significantly

    // rarity multiplier impacts the price more heavily
    const rarityMultiplier = rarityValue[seed.rarity] * 100;

    // growth time multiplier adds more weight for seeds with longer growth times
    const growthTimeMultiplier = Math.ceil(seed.growthTime / 2) * 50;

    return basePrice + rarityMultiplier + growthTimeMultiplier;
}


  public getSeed() {
    return this.seed;
  }

  public getPrice() {
    return this.price;
  }

  public getName() {
    return this.seed.type;
  }

  public setPrice(price: number) {
    this.price = price;
  }
}
