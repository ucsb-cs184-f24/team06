class Seed {
  private type: string; // type of plant this seed will grow into
  private rarity: Rarity; // seed rarity determines the rarity of the resulting plant
  private growthTime: number; // time in hours it takes for the seed to become a plant
  private age: number; // tracks how much time the seed has spent growing
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
    baseGrowthTime: number = 3 // default base growth time in hours
  ) {
    this.type = type;
    this.rarity = rarity;
    // calculate total growth time based on rarity multiplier
    this.growthTime = baseGrowthTime * Seed.rarityGrowthMultipliers[rarity];
    this.age = 0; // seeds start at age 0
    this.isPlanted = false;
    this.growthInterval = null;
  }

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
    // convert growth time from hours to milliseconds
    const growthDurationInMillis = this.growthTime * 3600000;
    const growthIntervalInMillis = growthDurationInMillis / this.growthTime; // interval updates age once every "hour" equivalent

    this.growthInterval = setInterval(() => {
      if (this.age < this.growthTime) {
        this.age++;
        console.log(`${this.type} is growing. Age: ${this.age}/${this.growthTime} hours`);
      } else {
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

  // convert the seed into a plant once fully grown
  public toPlant() {
    if (this.age >= this.growthTime) {
      console.log(`${this.type} has been transformed into a plant.`);
      return new Plant(this.type, "", this.rarity, 5, 5); // create a new Plant object with default values
    }
    console.log(`${this.type} is not ready to be transformed yet.`);
    return null; // seed not ready yet
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

  // manually increment the growth time (where growth may be externally triggered)
  public grow(timePassed: number) {
    this.age += timePassed;
    if (this.age >= this.growthTime) {
      this.stopGrowth();
      return true; // seed is ready to become a plant
    }
    return false; // seed is still growing
  }
}
