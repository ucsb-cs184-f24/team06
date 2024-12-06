export enum Rarity {
    common = 'common',
    uncommon = 'uncommon',
    rare = 'rare',
    unique = 'unique',
    legendary = 'legendary'
}

export const rarityValue: { [key in Rarity]: number } = {
    [Rarity.common]: 1,
    [Rarity.uncommon]: 2,
    [Rarity.rare]: 3,
    [Rarity.unique]: 4,
    [Rarity.legendary]: 5,
};
  
export class Seed {
    constructor(
      public type: string,
      public rarity: Rarity,
      public growthTime: number,
      public maxWater: number,
      public spriteNumber : number=1,
      public numSeeds: number=1, // for seed stacking in inventory
      public id?: string
    ) {}
  
    toFirestore() {
      return {
        type: this.type,
        rarity: this.rarity,
        growthTime: this.growthTime,
        maxWater: this.maxWater,
        numSeeds: this.numSeeds,
        lastUpdated: Date.now(),
        ...(this.id ? { id: this.id } : {})
      };
    }

    static fromFirestore(data: any): Seed {
        return new Seed(
          data.type,
          data.rarity as Rarity,
          data.growthTime,
          data.maxWater,
          data.spriteNumber,
          data.numSeeds,
          data.id
        );
    }
}
  
export const startingSeeds = [
    new Seed("rose", Rarity.common, 5, 4),
    new Seed("shrub", Rarity.common, 4, 5),
    new Seed("yellow_cactus", Rarity.uncommon, 6, 6),
];