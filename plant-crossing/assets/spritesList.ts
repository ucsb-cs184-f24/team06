

export const PLANT_SPRITES: Record<string, Record<number, any>> = {
    'cherry_blossom': {
      1: require('./Plant_Sprites/cherry_blossom_1.png'),
      2: require('./Plant_Sprites/cherry_blossom_2.png'),
      3: require('./Plant_Sprites/cherry_blossom_3.png'),
      4: require('./Plant_Sprites/cherry_blossom_4.png'),
      5: require('./Plant_Sprites/cherry_blossom_5.png'),
    },
    'rose': {
      1: require('./Plant_Sprites/rose_1.png'),
      2: require('./Plant_Sprites/rose_2.png'),
      3: require('./Plant_Sprites/rose_3.png'),
      4: require('./Plant_Sprites/rose_4.png'),
      5: require('./Plant_Sprites/rose_5.png'),
    },
    'violet': {
      1: require('./Plant_Sprites/violet_1.png'),
      2: require('./Plant_Sprites/violet_2.png'),
      3: require('./Plant_Sprites/violet_3.png'),
      4: require('./Plant_Sprites/violet_4.png'),
      5: require('./Plant_Sprites/violet_5.png'),
    },
    'chromafruit': {
      1: require('./Plant_Sprites/chromafruit_1.png'),
      2: require('./Plant_Sprites/chromafruit_2.png'),
      3: require('./Plant_Sprites/chromafruit_3.png'),
      4: require('./Plant_Sprites/chromafruit_4.png'),
      5: require('./Plant_Sprites/chromafruit_5.png'),
    },
    'sunflower': {
      1: require('./Plant_Sprites/sunflower_1.png'),
      2: require('./Plant_Sprites/sunflower_2.png'),
      3: require('./Plant_Sprites/sunflower_3.png'),
      4: require('./Plant_Sprites/sunflower_4.png'),
      5: require('./Plant_Sprites/sunflower_5.png'),
    },
    'tulip': {
      1: require('./Plant_Sprites/tulip_1.png'),
      2: require('./Plant_Sprites/tulip_2.png'),
      3: require('./Plant_Sprites/tulip_3.png'),
      4: require('./Plant_Sprites/tulip_4.png'),
      5: require('./Plant_Sprites/tulip_5.png'),
    },
    'wildflower': {
      1: require('./Plant_Sprites/wildflower_1.png'),
      2: require('./Plant_Sprites/wildflower_2.png'),
      3: require('./Plant_Sprites/wildflower_3.png'),
      4: require('./Plant_Sprites/wildflower_4.png'),
      5: require('./Plant_Sprites/wildflower_5.png'),
    },
    'tall_cactus': {
      1: require('./Plant_Sprites/tall_cactus_1.png'),
      2: require('./Plant_Sprites/tall_cactus_2.png'),
      3: require('./Plant_Sprites/tall_cactus_3.png'),
      4: require('./Plant_Sprites/tall_cactus_4.png'),
      5: require('./Plant_Sprites/tall_cactus_5.png'),
    },
    'short_cactus': {
      1: require('./Plant_Sprites/short_cactus_1.png'),
      2: require('./Plant_Sprites/short_cactus_2.png'),
      3: require('./Plant_Sprites/short_cactus_3.png'),
      4: require('./Plant_Sprites/short_cactus_4.png'),
      5: require('./Plant_Sprites/short_cactus_5.png'),
    },
    'yellow_cactus': {
      1: require('./Plant_Sprites/yellow_cactus_1.png'),
      2: require('./Plant_Sprites/yellow_cactus_2.png'),
      3: require('./Plant_Sprites/yellow_cactus_3.png'),
      4: require('./Plant_Sprites/yellow_cactus_4.png'),
      5: require('./Plant_Sprites/yellow_cactus_5.png'),
    },
    'pink_cactus': {
      1: require('./Plant_Sprites/pink_cactus_1.png'),
      2: require('./Plant_Sprites/pink_cactus_2.png'),
      3: require('./Plant_Sprites/pink_cactus_3.png'),
      4: require('./Plant_Sprites/pink_cactus_4.png'),
      5: require('./Plant_Sprites/pink_cactus_5.png'),
    },
    'poppy': {
      1: require('./Plant_Sprites/poppy_1.png'),
      2: require('./Plant_Sprites/poppy_2.png'),
      3: require('./Plant_Sprites/poppy_3.png'),
      4: require('./Plant_Sprites/poppy_4.png'),
      5: require('./Plant_Sprites/poppy_5.png'),
    },
    'chrysanthemum': {
      1: require('./Plant_Sprites/chrysanthemum_1.png'),
      2: require('./Plant_Sprites/chrysanthemum_2.png'),
      3: require('./Plant_Sprites/chrysanthemum_3.png'),
      4: require('./Plant_Sprites/chrysanthemum_4.png'),
      5: require('./Plant_Sprites/chrysanthemum_5.png'),
    },
    'reed': {
      1: require('./Plant_Sprites/reed_1.png'),
      2: require('./Plant_Sprites/reed_2.png'),
      3: require('./Plant_Sprites/reed_3.png'),
      4: require('./Plant_Sprites/reed_4.png'),
      5: require('./Plant_Sprites/reed_5.png'),
    },
    'shrub': {
      1: require('./Plant_Sprites/shrub_1.png'),
      2: require('./Plant_Sprites/shrub_2.png'),
      3: require('./Plant_Sprites/shrub_3.png'),
      4: require('./Plant_Sprites/shrub_4.png'),
      5: require('./Plant_Sprites/shrub_5.png'),
    },
    'tropical_tree': {
      1: require('./Plant_Sprites/tropical_tree_1.png'),
      2: require('./Plant_Sprites/tropical_tree_2.png'),
      3: require('./Plant_Sprites/tropical_tree_3.png'),
      4: require('./Plant_Sprites/tropical_tree_4.png'),
      5: require('./Plant_Sprites/tropical_tree_5.png'),
    },
  };
  
  
  export const getSpriteForPlant = (plantName: string | undefined, growthLevel: number): any => {
    if (typeof plantName !== "string" || !plantName) {
      console.warn("Invalid plant name provided:", plantName);
      return null;
    }
  
    const normalizedPlantName = plantName.toLowerCase().replace(/ /g, "_");
  
    if (PLANT_SPRITES[normalizedPlantName] && PLANT_SPRITES[normalizedPlantName][growthLevel]) {
      console.log(`plant sprite name: ${normalizedPlantName}`)
      return PLANT_SPRITES[normalizedPlantName][growthLevel];
    }
  
    console.warn(`Sprite not found for plant: ${normalizedPlantName}, growth level: ${growthLevel}`);
    return null;
  };
  
  