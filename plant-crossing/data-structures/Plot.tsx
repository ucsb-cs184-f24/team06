import { Plant, Rarity } from './Plant';
import { Seed } from './Seed';

export class Plot {
    private unlocked: boolean; // users can unlock garden plots as they progress
    private seed: Seed | null;
    private plant: Plant | null;

    public constructor(
      unlocked: boolean,
    ) {
      this.unlocked = unlocked;
      this.seed = null;
      this.plant = null;
    };

    public getSeed(){
      return this.seed;
    }

    public getPlant(){
      return this.plant;
    }

    public getUnlocked(){
      return this.unlocked;
    }

    public setUnlocked(isUnlocked:boolean){
      this.unlocked = isUnlocked;
    }

    public plantSeed(seed:Seed){
      if (this.unlocked == true){
        if(this.seed){ // clear plot if something is already there
          this.harvestPlant();
        }
        this.seed = seed;
      }
    }

    public grow(timePassed:number){
      if(this.seed){
        let isPlant = this.seed.grow(timePassed);
        if(isPlant){
          this.plant = this.seed.toPlant();
        }
      }
    }

    public harvestPlant(){
      if (this.unlocked == true){
        let numCoins = 0;
        let numSeeds = 0;
        if(this.plant && this.plant.getAge() > 1){ // plants return coins if they've been planted a while
          numCoins = this.plant.produceCoins() * this.plant.getAge();
          numSeeds = Math.min(this.plant.getAge(), 3); // plants will return a number of seeds if they've been planted a while
        } 
        let newSeed = new Seed(this.seed?.copy());
        this.seed = null;
        this.plant = null;
        return [newSeed, numSeeds, numCoins];
      }
    }
  }
  