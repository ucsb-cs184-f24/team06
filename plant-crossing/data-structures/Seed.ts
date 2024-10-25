class Seed {
  private type: string; // type of plant this seed will grow into
  private rarity: Rarity; // seed rarity determines the rarity of the resulting plant
  private growthTime: number; // time (in hours or minutes) it takes for the seed to become a plant
  private age: number; // tracks how much time the seed has spent growing

  public constructor(
    type: string = "defaultSeed",
    rarity: string = "common",
    growthTime: number = 5 // default growth time
  ) {
    this.type = type;
    this.rarity = rarity as unknown as Rarity;
    this.growthTime = growthTime;
    this.age = 0; // seeds start at age 0
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

  public setRarity(rarity: string) {
    this.rarity = rarity as unknown as Rarity;
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

  // simulate growth over time
  public grow(timePassed: number) {
    this.age += timePassed;
    if (this.age >= this.growthTime) {
      return true; // seed is ready to become a plant
    }
    return false; // Seed is still growing
  }

  // convert seed to plant once fully grown
  public toPlant() {
    if (this.age >= this.growthTime) {
      return new Plant(this.type, "", this.rarity, 5, 5); // create a new Plant object with default values
    }
    return null; // seed not ready yet
  }
}
