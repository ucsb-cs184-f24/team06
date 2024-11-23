import { PlantService } from '../managers/PlantService';
import { SeedService } from '../managers/SeedService';
import { Plant} from '../types/Plant';

export class Plot {
    public location: number;
    private unlocked: boolean; // users can unlock garden plots as they progress
    private plant: Plant | null;


    public constructor(
      unlocked: boolean,
      location: number,
    ) {
      this.unlocked = unlocked;
      this.plant = null;
      this.location = location;
    };

    public getPlant(){
      return this.plant;
    }

    public async getPlantId() {
      const plantId = await PlantService.findPlantByLocation(this.location);
      return plantId;
    }

    public getUnlocked(){
      return this.unlocked;
    }

    public setUnlocked(isUnlocked:boolean){
      this.unlocked = isUnlocked;
    }

    public async clearPlot() {
      const plantId = await this.getPlantId();
      await PlantService.deletePlant(plantId);
      this.plant = null;
    }

    public async updatePlot(plant:Plant){
      if (this.unlocked == true){
        if (this.plant) {
          await this.clearPlot();
        }
        this.plant = plant;
      }
    }

    public async plantSeed(seedId:string){
      if (this.unlocked == true){
        await this.clearPlot();
        this.plant = await SeedService.plantSeed(seedId, this.location);
      }
    }

    public grow(timePassed:number){
      // TODO: integrate with PlantServices and Firebase
      // if(this.plant){
      //   let isPlant = this.plant.grow(timePassed);
      //   if(isPlant){
      //     this.plant = this.plant.toPlant();
      //   }
      // }
    }

    public harvestPlant(){
      // TODO: integrate with PlantServices and Firebase
      // if (this.unlocked == true){
      //   let numCoins = 0;
      //   let numSeeds = 0;
      //   if(this.plant && this.plant.getAge() > 1){ // plants return coins if they've been planted a while
      //     numCoins = this.plant.produceCoins() * this.plant.getAge();
      //     numSeeds = Math.min(this.plant.getAge(), 3); // plants will return a number of plants if they've been planted a while
      //   } 
      //   let newSeed = new Seed(this.plant?.copy());
      //   this.plant = null;
      //   this.plant = null;
      //   return [newSeed, numSeeds, numCoins];
      // }
    }

    public toJSON() {
        return {
            unlocked: this.unlocked,
            costToUnlock: this.costToUnlock,
            seed: this.seed ? this.seed.toJSON() : null,
            plant: this.plant ? this.plant.toJSON() : null,
        };
    }

    public fromJSON(data: any): Plot {
      const plot = new Plot(data.unlocked, data.costToUnlock);
      plot.seed = (data.seed);
      plot.plant = (data.plant);
      return plot;
    }
  }
  