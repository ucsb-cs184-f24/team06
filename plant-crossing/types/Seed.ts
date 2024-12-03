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
      public spriteNumber : number,
      public numSeeds: number, // for seed stacking in inventory
    ) {}
  
    toFirestore() {
      return {
        type: this.type,
        rarity: this.rarity,
        growthTime: this.growthTime,
        maxWater: this.maxWater,
        lastUpdated: Date.now()
      };
    }

    static fromFirestore(data: any): Seed {
        return new Seed(
          data.type,
          data.rarity as Rarity,
          data.growthTime,
          data.maxWater,
          data.spriteNumber,
          data.numSeeds
        );
    }
}
  
export const startingSeeds = [
    new Seed("Rose Seed", Rarity.common, 3, 5, 1, 1),
    new Seed("Cactus Seed", Rarity.common, 7, 9, 1, 1),
    new Seed("Sunflower Seed", Rarity.common, 2, 3, 1, 1),
    new Seed("Fern Seed", Rarity.common, 4, 7, 1, 1),
    new Seed("Daisy Seed", Rarity.common, 1, 3, 1, 1),
    new Seed("Lavender Seed", Rarity.common, 4, 5, 1, 1),
    new Seed("Marigold Seed", Rarity.common, 5, 5, 1, 1),
    new Seed("Carnation Seed", Rarity.common, 6, 6, 1, 1),
];