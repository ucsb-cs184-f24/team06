import { Seed } from "./Seed";

export class Inventory{ // only stores seeds, we can confirm later
    private seeds:Set<Seed>; // array for now, in future can be map for faster lookup
    public constructor(startingSeeds?:Seed[]){
        this.seeds = new Set(startingSeeds);
    }
    public getSeeds(){
        return this.seeds;
    }
    public setSeeds(seeds:Seed[]){
        this.seeds = new Set(seeds);
    }
    public addSeed(seed:Seed){
        return this.seeds.add(seed);
    }
    public removeSeed(seed:Seed){
        this.seeds.delete(seed);
    }
}

