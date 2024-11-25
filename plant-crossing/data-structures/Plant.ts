import { Seed, Rarity, rarityValue } from './Seed';

export class Plant extends Seed {
  private seed: Seed; // pass in seed when creating plant
  private nickname: string;
  private sprite: string; // property to store the sprite
  private growthLevel: number; // property to store growth level

  public constructor(seed: Seed, nickname: string = "") {
    super();
    this.seed = seed;
    this.nickname = nickname;
    this.growthLevel = this.calculateGrowthLevel(); // initialize growth level
    this.sprite = this.determineSprite(); // initialize sprite
  }

  public getAge() {
    return this.seed.getAge();
  }

  public getRarity() {
    return this.seed.getRarity();
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
    this.updateGrowthLevel(); // update growth level when water changes
    this.updateSprite(); // update sprite when water changes
  }

  public getMaxWater() {
    return this.seed.getMaxWater();
  }

  public water() {
    this.seed.water();
    this.produceCoins(); // produce extra coins when watered
    this.updateGrowthLevel(); // update growth level when watered
    this.updateSprite(); // update sprite when watered
  }

  public produceCoins() {
    if (this.seed.getCurrWater() >= this.seed.getMaxWater() * (1 / 5)) {
      return Math.floor(
        (this.getCurrWater() / this.seed.getMaxWater()) * // water level of the plant
        this.seed.getGrowthBoost() * // factor in growth boost
        rarityValue[this.seed.getRarity()] // rare plants produce more coins
      );
    }
    return 0;
  }

  // Calculate growth level based on the water and age (5 levels)
  private calculateGrowthLevel(): number {
    const age = this.getAge();
    const maxWater = this.getMaxWater();
    const currWater = this.getCurrWater();

    if (age > 20 && currWater >= maxWater * 0.9) {
      return 5;
    } else if (age > 15 && currWater >= maxWater * 0.75) {
      return 4;
    } else if (age > 10 && currWater >= maxWater * 0.6) {
      return 3; 
    } else if (age > 5 && currWater >= maxWater * 0.4) {
      return 2;
    } else {
      return 1;
    }
  }

  public getGrowthLevel(): number {
    return this.growthLevel;
  }

  // Update growth level when properties change
  private updateGrowthLevel() {
    this.growthLevel = this.calculateGrowthLevel();
  }

  // Determine sprite based on the name of the plant and growth level
  private determineSprite(): string {
    const plantName = this.seed.getType();
    return `${plantName.toLowerCase()}_${this.growthLevel}.png`; // example: "rose_3.png"
  }

  private updateSprite() {
    this.sprite = this.determineSprite();
  }

  public getSprite() {
    return this.sprite;
  }
}
