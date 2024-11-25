

export const PLANT_SPRITES: Record<string, Record<number, any>> = {
    cherry_blossom: {
      1: require('./Plant_Sprites/cherry_blossom_1.png'),
      2: require('./Plant_Sprites/cherry_blossom_2.png'),
      3: require('./Plant_Sprites/cherry_blossom_3.png'),
      4: require('./Plant_Sprites/cherry_blossom_4.png'),
      5: require('./Plant_Sprites/cherry_blossom_5.png'),
    },
    roses: {
      1: require('./Plant_Sprites/roses_1.png'),
      2: require('./Plant_Sprites/roses_2.png'),
      3: require('./Plant_Sprites/roses_3.png'),
      4: require('./Plant_Sprites/roses_4.png'),
      5: require('./Plant_Sprites/roses_5.png'),
    },
    violets: {
      1: require('./Plant_Sprites/violets_1.png'),
      2: require('./Plant_Sprites/violets_2.png'),
      3: require('./Plant_Sprites/violets_3.png'),
      4: require('./Plant_Sprites/violets_4.png'),
      5: require('./Plant_Sprites/violets_5.png'),
    },
    chromafruit: {
      1: require('./Plant_Sprites/chromafruit_1.png'),
      2: require('./Plant_Sprites/chromafruit_2.png'),
      3: require('./Plant_Sprites/chromafruit_3.png'),
      4: require('./Plant_Sprites/chromafruit_4.png'),
      5: require('./Plant_Sprites/chromafruit_5.png'),
    },
    sunflower: {
      1: require('./Plant_Sprites/sunflower_1.png'),
      2: require('./Plant_Sprites/sunflower_2.png'),
      3: require('./Plant_Sprites/sunflower_3.png'),
      4: require('./Plant_Sprites/sunflower_4.png'),
      5: require('./Plant_Sprites/sunflower_5.png'),
    },
    tulips: {
      1: require('./Plant_Sprites/tulips_1.png'),
      2: require('./Plant_Sprites/tulips_2.png'),
      3: require('./Plant_Sprites/tulips_3.png'),
      4: require('./Plant_Sprites/tulips_4.png'),
      5: require('./Plant_Sprites/tulips_5.png'),
    },
    wildflowers: {
      1: require('./Plant_Sprites/wildflowers_1.png'),
      2: require('./Plant_Sprites/wildflowers_2.png'),
      3: require('./Plant_Sprites/wildflowers_3.png'),
      4: require('./Plant_Sprites/wildflowers_4.png'),
      5: require('./Plant_Sprites/wildflowers_5.png'),
    },
  };
  
  
  export const getSpriteForPlant = (plantName: string, growthLevel: number): any => {
    const normalizedPlantName = plantName.toLowerCase();
  
    if (PLANT_SPRITES[normalizedPlantName] && PLANT_SPRITES[normalizedPlantName][growthLevel]) {
      return PLANT_SPRITES[normalizedPlantName][growthLevel];
    }
  
    return null;
  };
  