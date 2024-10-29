

class Player {
    private username: string; // unique identifier for each player
    private password: string; // to verify user identity
    private plantInventory: Plant[]; // list of plants in the user's garden
    private seedInventory: Seed[]; // list of seeds in the user's inventory
    private friends: string[]; // list of the usernames of the friends added by the player
    private xp: number; // xp collected by doing actions
    private level: number; // level increased through xp increments
    private coins: number; // currency owned by player
  
    public constructor(username: string = "", password: string = "") {
      // creates new player
      this.username = username; // assigns username from parameters
      this.password = password; // assigns password from parameters
      this.plantInventory = []; // starts with no plants
      this.seedInventory = []; // starts with no seeds
      this.friends = []; // starts with no friends
      this.xp = 0; // starts with no xp
      this.level = 1; // starts at level 1
      this.coins = 50; // stars with some default coins value
    }
  
    public getUsername() {
      return this.username;
    }
    public setUsername(username: string) {
      this.username = username;
    }
  
    public getPassword() {
      return this.password;
    }
    public setPassword(password: string) {
      this.password = password;
    }
  
    public getPlantInventory() {
      return this.plantInventory;
    }
    public setPlantInventory(plantInventory: Plant[]) {
      this.plantInventory = plantInventory;
    }
  
    public getSeedInventory() {
      return this.seedInventory;
    }
    public setSeedInventory(seedInventory: Seed[]) {
      this.seedInventory = seedInventory;
    }
  
    public getFriends() {
      return this.friends;
    }
    public setFriends(friends: string[]) {
      this.friends = friends;
    }
  
    public getXp() {
      return this.xp;
    }
    public setXp(xp: number) {
      this.xp = xp;
    }
  
    public getLevel() {
      return this.level;
    }
    public setLevel(level: number) {
      this.level = level;
    }
  
    public getCoins() {
      return this.coins;
    }
    public setCoins(coins: number) {
      this.coins = coins;
    }
  
    // method to water a specific plant directly (touch)
    public waterSpecificPlant(plant: Plant) {
        if (this.plantInventory.includes(plant)) {
        plant.waterPlant();
        } else {
        console.log("Plant not found in your inventory.");
        }
    }

    // method to water a specific seed directly (touch)
    public waterSpecificSeed(seed: Seed) {
        if (this.seedInventory.includes(seed)) {
        seed.waterSeed();
        } else {
        console.log("Seed not found in your inventory.");
        }
    }
  }
  
  export default Player;
  