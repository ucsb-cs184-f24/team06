import { Seed, Rarity, rarityValue} from './Seed';

export class Plant extends Seed {
  private seed: Seed; //pass in seed when creating plant
  private nickname: string;

  // // private type: string; // type of plant
  // private nickname: string; // optional, name your plant
  // // private age: number;
  // // private currSprite:  // add image links later, store in plant-sprites folder?
  // // private rarity: Rarity; // enum, types listed above
  // // private currWater: number; // decreases over time
  // // private maxWater: number; // scale of 10
  // private currHappiness: number; // scale of 10
  // private maxHappiness: number; // scale of 10
  // private coinBoost: number; // multiplier for boosted coin production

  public constructor(
    seed: Seed,
    nickname: string = ""
  ) {
    super(seed.getType(), seed.getRarity(), seed.getGrowthTime(), seed.getMaxWater());
    this.seed = seed;
    this.nickname = nickname;
  }

  // // method to reset the coin boost after the boost period ends
  // private resetBoost() {
  //   this.coinBoost = 1; // reset the boost to default
  //   console.log(`${this.type}'s boost has ended.`);
  // }

  // Ppaceholder for increasing plant happiness (if needed)
  public increaseHappiness() {}

  // public getType() {
  //   return this.type;
  // }

  // public setType(type: string) {
  //   this.type = type;
  // }

  public getAge(){
    return this.seed.getAge();
  }

  public setAge(age:number){
    this.seed.setAge(age);
  }

  public getNickname() {
    return this.nickname;
  }

  public setNickname(nickname: string) {
    this.nickname = nickname;
  }

  public setRarity(rarity: Rarity) {
    this.seed.setRarity(rarity);
  }

  public getCurrWater() {
    return this.seed.getCurrWater();
  }

  public setCurrWater(currWater: number) {
    this.seed.setCurrWater(currWater);
  }

  public getMaxWater() {
    return this.seed.getMaxWater();
  }

  public water(){
    this.seed.water();
    this.produceCoins(); // produce extra coins when watered
  }

  // coins produced is a function of water level, rarity, and boost
  public produceCoins() {
    if (this.seed.getCurrWater() >= (this.seed.getMaxWater() * (1/3))) {
      return Math.floor(
        (this.getCurrWater() / this.seed.getMaxWater()) * // water level of the plant
        this.seed.getGrowthBoost() * // factor in growth boost
        rarityValue[this.seed.getRarity()] // rare plants produce more coins
      );
    }
    return 0;
  }
}
