// Helper function to intialize seeds when a new player signs up with firebase

import { Seed, rarityValue} from '../data-structures/Seed';
import { weightedRandomSelection } from './weightedRandom';
import { startingSeeds } from '../data/items';
import { GardenPlot } from '../data-structures/GardenPlots';

// naive utility function to select 5 random non-overlapping elements from startingSeeds
export function createUserSeedInventory(){
    let indexes = []; // take the first 5 elements
    let seeds = [];
    let inventorySize = 5;
    while(indexes.length < inventorySize){
        let num = (Math.floor(Math.random() * startingSeeds.length));
        if (num in indexes){
            continue;
        } else{
            indexes.push(num);
        }
    }
    for(let n in indexes){
        seeds.push(startingSeeds[n].toJSON());
    }
    return seeds;
}

export function createUserPlots(){
    return new GardenPlot();
}
