import { ImageSourcePropType } from "react-native";

interface SpriteMapping {
  [key: string]: ImageSourcePropType;
}

export const PLANT_SPRITES: SpriteMapping = {
  // Cherry Blossom
  'cherry_blossom_1': require('../assets/Plant_Sprites/cherry_blossom_1.png'),
  'cherry_blossom_2': require('../assets/Plant_Sprites/cherry_blossom_2.png'),
  'cherry_blossom_3': require('../assets/Plant_Sprites/cherry_blossom_3.png'),
  'cherry_blossom_4': require('../assets/Plant_Sprites/cherry_blossom_4.png'),
  'cherry_blossom_5': require('../assets/Plant_Sprites/cherry_blossom_5.png'),

  // Roses
  'roses_1': require('../assets/Plant_Sprites/roses_1.png'),
  'roses_2': require('../assets/Plant_Sprites/roses_2.png'),
  'roses_3': require('../assets/Plant_Sprites/roses_3.png'),
  'roses_4': require('../assets/Plant_Sprites/roses_4.png'),
  'roses_5': require('../assets/Plant_Sprites/roses_5.png'),

  // Violets
  'violets_1': require('../assets/Plant_Sprites/violets_1.png'),
  'violets_2': require('../assets/Plant_Sprites/violets_2.png'),
  'violets_3': require('../assets/Plant_Sprites/violets_3.png'),
  'violets_4': require('../assets/Plant_Sprites/violets_4.png'),
  'violets_5': require('../assets/Plant_Sprites/violets_5.png'),

  // Chromafruit
  'chromafruit_1': require('../assets/Plant_Sprites/chromafruit_1.png'),
  'chromafruit_2': require('../assets/Plant_Sprites/chromafruit_2.png'),
  'chromafruit_3': require('../assets/Plant_Sprites/chromafruit_3.png'),
  'chromafruit_4': require('../assets/Plant_Sprites/chromafruit_4.png'),
  'chromafruit_5': require('../assets/Plant_Sprites/chromafruit_5.png'),

  // Sunflower
  'sunflower_1': require('../assets/Plant_Sprites/sunflower_1.png'),
  'sunflower_2': require('../assets/Plant_Sprites/sunflower_2.png'),
  'sunflower_3': require('../assets/Plant_Sprites/sunflower_3.png'),
  'sunflower_4': require('../assets/Plant_Sprites/sunflower_4.png'),
  'sunflower_5': require('../assets/Plant_Sprites/sunflower_5.png'),

  // Tulips
  'tulips_1': require('../assets/Plant_Sprites/tulips_1.png'),
  'tulips_2': require('../assets/Plant_Sprites/tulips_2.png'),
  'tulips_3': require('../assets/Plant_Sprites/tulips_3.png'),
  'tulips_4': require('../assets/Plant_Sprites/tulips_4.png'),
  'tulips_5': require('../assets/Plant_Sprites/tulips_5.png'),

  // Wildflowers
  'wildflowers_1': require('../assets/Plant_Sprites/wildflowers_1.png'),
  'wildflowers_2': require('../assets/Plant_Sprites/wildflowers_2.png'),
  'wildflowers_3': require('../assets/Plant_Sprites/wildflowers_3.png'),
  'wildflowers_4': require('../assets/Plant_Sprites/wildflowers_4.png'),
  'wildflowers_5': require('../assets/Plant_Sprites/wildflowers_5.png'),
};

export const getSpriteForPlant = (plantName: string, growthLevel: number): ImageSourcePropType | null => {
  const key = `${plantName.toLowerCase()}_${growthLevel}`;
  return PLANT_SPRITES[key] || null;
};
