import { Seed, Rarity, rarityValue} from './Seed';

export class Plant extends Seed {
  private seed: Seed; //pass in seed when creating plant
  private nickname: string;

  public constructor(
    seed: Seed,
    nickname: string = ""
  ) {
    super();
    this.seed = seed;
    this.nickname = nickname;
  }

  public getAge(){
    return this.seed.getAge();
  }

  public getRarity() {
    return this.seed.getRarity();
  }

  public getRarityValue() {
    return this.seed.getRarityValue();
  }

  public getNickname() {
    return this.nickname;
  }

  public setNickname(nickname: string) {
    this.nickname = nickname;
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
