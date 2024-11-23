// Types of rarity value for plants
export enum Rarity {
  common,
  uncommon,
  rare,
  unique,
  legendary,
}

// Use for shop probabilities and growth boost
export const rarityValue: { [key in Rarity]: number } = {
  [Rarity.common]: 1,
  [Rarity.uncommon]: 2,
  [Rarity.rare]: 3,
  [Rarity.unique]: 4,
  [Rarity.legendary]: 5,
};

export class Seed {
  private type: string; // type of plant this seed will grow into
  private rarity: Rarity; // seed rarity determines the rarity of the resulting plant
  private growthTime: number; // time in hours it takes for the seed to become a plant
  private age: number; // tracks how much time the seed has spent growing
  private currWater: number; // water level of the seed
  private maxWater: number; // maximum water capacity for the seed
  private growthBoost: number; // boost factor for reducing growth time

  private isPlanted: boolean; // whether the seed has been planted
  private growthInterval: NodeJS.Timeout | null; // interval ID for growth tracking

  private spriteNum : number; // Number of corresponding sprite (ex: 1, so Plant1_2 is stage 2 of the plant 1 sprite)

  public constructor(
    type: string = "defaultSeed",
    rarity: Rarity = Rarity.common,
    baseGrowthTime: number = 5, // default base growth time in hours
    maxWater: number = 5, // default maximum water level
    spriteNumber : number = 1
  ) {
    this.type = type;
    this.rarity = rarity;
    this.growthTime = baseGrowthTime;
    this.age = 0; // seeds start at age 0
    this.currWater = maxWater;
    this.maxWater = maxWater;
    this.growthBoost = 1; // no boost initially
    this.isPlanted = false;
    this.growthInterval = null;
    this.spriteNum = spriteNumber;
  }

  // make deep copy of seed
  public copy(){ 
    return JSON.parse(JSON.stringify(this));
  }

  // water the seed, refilling water and applying a growth time boost
  public water() {
    this.currWater = this.maxWater; // refill water to max
    this.growthBoost = 1 + (.5 * rarityValue[this.rarity]); // plants get a bigger growth boost if rare
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

  public getAge(){
    return this.age;
  }

  public setAge(age: number) {
    this.age = age;
  }

  public getCurrWater(){
    return this.currWater;
  }

  public setCurrWater(currWater: number){
    this.currWater = currWater;
  }

  public getMaxWater(){
    return this.maxWater;
  }
  

  public getGrowthBoost(){
    return this.growthBoost;
  }

  public setGrowthBoost(growthBoost: number){
    this.growthBoost = growthBoost;
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
      return new Plant(this, ""); // create a new Plant object with default values
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

  // Gets the current sprite of the plant (after the seed stage)
  public getSpriteString() {
    return "Plant" + String(this.spriteNum) + "_" + String(this.age);
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

  // Convert seed to JSON to store in Firebase
  public toJSON(){
    return {
      type: this.type,
      rarity: (this.rarity),
      growthTime: this.growthTime,
      age: this.age,
      currWater: this.currWater,
      maxWater: this.maxWater,
      growthBoost: this.growthBoost,
      isPlanted: this.isPlanted,
      growthInterval: this.growthInterval
    }
  }

  //set all fields of seed according to JSON
  public fromJSON(data: any) { 
    this.type = data.type;
    this.rarity = Rarity[data.rarity as keyof typeof Rarity];
    this.growthTime = data.growthTime;
    this.age = data.age;
    this.currWater = data.currWater;
    this.maxWater = data.maxWater;
    this.growthBoost = data.growthBoost;
    this.isPlanted = data.isPlanted;
    this.growthInterval = data.growthInterval;
  }
}

