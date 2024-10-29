enum Rarity {
  common,
  rare,
  unique,
  legendary,
}

const coinMapping: { [key in Rarity]: number } = {
  [Rarity.common]: 2,
  [Rarity.rare]: 3,
  [Rarity.unique]: 4,
  [Rarity.legendary]: 5,
};

class Plant {
  private type: string; // type of plant
  private nickname: string; // optional, name your plant
  private age: number;
  // private currSprite:  // add image links later, store in plant-sprites folder?
  private rarity: Rarity; // enum, types listed above
  private currWater: number; // decreases over time
  private maxWater: number; // scale of 10
  private currHappiness: number; // scale of 10
  private maxHappiness: number; // scale of 10
  private coinBoost: number; // multiplier for boosted coin production

  public constructor(
    type: string = "defaultPlant",
    nickname: string = "",
    rarity: Rarity = Rarity.common,
    maxWater: number = 5,
    maxHappiness: number = 5
  ) {
    this.type = type;
    this.nickname = nickname;
    this.age = 0;
    this.rarity = rarity;
    this.currWater = maxWater;
    this.maxWater = maxWater;
    this.currHappiness = maxHappiness;
    this.maxHappiness = maxHappiness;
    this.coinBoost = 1; // no boost initially
  }

  // water the plant, refilling water and applying a coin production boost
  public waterPlant() {
    this.currWater = this.maxWater; // refill water to max
    this.coinBoost = 1.2; // apply a 20% boost to coin production
    console.log(`${this.type} has been watered. Coin production boost active!`);
    
    // optionally set a timer to remove the boost after a period
    setTimeout(() => {
      this.resetBoost();
    }, 300000); // remove the boost after 5 minutes, can be adjusted
  }

  // method to reset the coin boost after the boost period ends
  private resetBoost() {
    this.coinBoost = 1; // reset the boost to default
    console.log(`${this.type}'s boost has ended.`);
  }

  // Ppaceholder for increasing plant happiness (if needed)
  public increaseHappiness() {}

  public getType() {
    return this.type;
  }

  public setType(type: string) {
    this.type = type;
  }

  public getNickname() {
    return this.nickname;
  }

  public setNickname(nickname: string) {
    this.nickname = nickname;
  }

  public getRarity() {
    return this.rarity;
  }

  public setRarity(rarity: Rarity) {
    this.rarity = rarity;
  }

  public getCurrWater() {
    return this.currWater;
  }

  public setCurrWater(currWater: number) {
    this.currWater = currWater;
  }

  public getMaxWater() {
    return this.maxWater;
  }

  public setMaxWater(maxWater: number) {
    this.maxWater = maxWater;
  }

  public getCurrHappiness() {
    return this.currHappiness;
  }

  public setCurrHappiness(currHappiness: number) {
    this.currHappiness = currHappiness;
  }

  public getMaxHappiness() {
    return this.maxHappiness;
  }

  public setMaxHappiness(maxHappiness: number) {
    this.maxHappiness = maxHappiness;
  }

  // produce coins based on water level, rarity, happiness, and boost
  public produceCoins() {
    // coins produced is a function of water level, rarity, happiness, and boost
    if (this.currWater >= this.maxWater / 2) {
      return Math.floor(
        (this.currWater / this.maxWater) *
          (1 + this.currHappiness / this.maxHappiness) * // multiplier added if plant is happy
          this.coinBoost * // factor in coin boost
          coinMapping[this.rarity]
      );
    }
    return 0;
  }
}
