class Seed {
  private type: string; // type of plant this seed will grow into
  private rarity: Rarity; // seed rarity determines the rarity of the resulting plant
  private growthTime: number; // time in hours it takes for the seed to become a plant
  private growthTime: number; // time in hours it takes for the seed to become a plant
  private age: number; // tracks how much time the seed has spent growing

  private currWater: number; // water level of the seed
  private maxWater: number; // maximum water capacity for the seed
  private growthBoost: number; // boost factor for reducing growth time

  private isPlanted: boolean; // whether the seed has been planted
  private growthInterval: NodeJS.Timeout | null; // interval ID for growth tracking

  // growth time multipliers based on rarity
  private static rarityGrowthMultipliers: { [key in Rarity]: number } = {
    [Rarity.common]: 1,
    [Rarity.rare]: 1.5,
    [Rarity.unique]: 2,
    [Rarity.legendary]: 3,
  };

  public constructor(
    type: string = "defaultSeed",
    rarity: Rarity = Rarity.common,
    baseGrowthTime: number = 5, // default base growth time in hours
    maxWater: number = 5 // default maximum water level
  ) {
    this.type = type;
    this.rarity = rarity;
    // calculate growth time based on rarity multiplier
    this.growthTime = baseGrowthTime * Seed.rarityGrowthMultipliers[rarity];
    this.age = 0; // seeds start at age 0
    this.currWater = maxWater;
    this.maxWater = maxWater;
    this.growthBoost = 1; // no boost initially
    this.isPlanted = false;
    this.growthInterval = null;
  }

  // existing methods from main

  // water the seed, refilling water and applying a growth time boost
  public waterSeed() {
    this.currWater = this.maxWater; // refill water to max
    this.growthBoost = 0.9; // apply a 10% growth time reduction
    console.log(`${this.type} has been watered. Growth boost active!`);

    // set a timer to remove the boost after a period
    setTimeout(() => {
      this.resetBoost();
    }, 300000); // remove the boost after 5 minutes
  }

  // method to reset the growth boost after the boost period ends
  private resetBoost() {
    this.growthBoost = 1; // reset the boost to default
    console.log(`${this.type}'s growth boost has ended.`);
  }

  public getType() {
    return this.type;
  }

  public setType(type: string) {
    this.type = type;
  }

  public getRarity() {
    return this.rarity;
  }

  public setRarity(rarity: Rarity) {
    this.rarity = rarity;
  }

  public getGrowthTime() {
    return this.growthTime;
  }

  public setGrowthTime(growthTime: number) {
    this.growthTime = growthTime;
  }

  public getAge() {
    return this.age;
  }

  public setAge(age: number) {
    this.age = age;
  }

  // simulate growth over time, considering the growth boost
  public grow(timePassed: number) {
    this.age += timePassed * this.growthBoost; // apply growth boost to speed up age increment
    if (this.age >= this.growthTime) {
      return true; // seed is ready to become a plant
    }
    return false; // seed is still growing
  }

  // convert seed to plant once fully grown
  public toPlant() {
    if (this.age >= this.growthTime) {
      console.log(`${this.type} has been transformed into a plant.`);
      return new Plant(this.type, "", this.rarity, 5, 5); // create a new Plant object with default values
    }
    return null; // seed not ready yet
  }

  // additional methods from seedsGrow

  // start the planting process and initiate growth tracking
  public plant() {
    if (!this.isPlanted) {
      this.isPlanted = true;
      console.log(`${this.type} has been planted.`);
      this.startGrowth();
    } else {
      console.log(`${this.type} is already planted.`);
    }
  }

  // simulate growth over time using a timer
  private startGrowth() {
    // simulate hourly updates
    const growthIntervalInMillis = 1000 * 60 * 60;

    this.growthInterval = setInterval(() => {
      const isFullyGrown = this.grow(1); // grow by 1 hour
      console.log(
        `${this.type} is growing. Age: ${this.age.toFixed(2)}/${this.growthTime} hours`
      );
      if (isFullyGrown) {
        console.log(`${this.type} has fully grown.`);
        this.stopGrowth();
      }
    }, growthIntervalInMillis); // simulates growth "hourly"
  }

  // stop the growth process
  private stopGrowth() {
    if (this.growthInterval) {
      clearInterval(this.growthInterval);
      this.growthInterval = null;
    }
  }
}
