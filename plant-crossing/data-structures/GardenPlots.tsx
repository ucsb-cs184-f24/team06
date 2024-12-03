import { Plot } from "../types/Plot";
import { Plant } from "../types/Plant";
import { Seed, Rarity } from "../types/Seed";
import React, { useState, useEffect } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { PlantService } from "../managers/PlantService";
import { PlotService } from "../managers/PlotService";
import { SeedService } from "../managers/SeedService";
import { getSpriteForPlant } from "../assets/sprites";
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  ImageSourcePropType,
  Image,
} from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import {
  arrayUnion,
  collection,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import { GardenTool } from "./GardenTools";
import { Inventory } from "./Inventory";
import { Seed as SeedObj, Rarity as RarityEnum } from "./Seed";
import { PLANT_SPRITES } from "./Sprites";
import { Svg, Image as SvgImage } from "react-native-svg";
import { Image as ExpoImage } from "expo-image";
import { globalStyles } from "../styles/globalStyles";

const soilSprites = {
  dry: require("../assets/soil-sprites/soil-dry.png") as ImageSourcePropType,
  watered:
    require("../assets/soil-sprites/soil-watered.png") as ImageSourcePropType,
  locked:
    require("../assets/soil-sprites/soil-locked.png") as ImageSourcePropType,
} as const;

const animationPaths = new Map<string, ImageSourcePropType>([
  ["watering", require("../assets/animation-watering/watering.gif")],
  ["planting", require("../assets/animation-planting/planting.gif")],
  ["digging", require("../assets/animation-digging/digging.gif")],
  ["unlock", require("../assets/animation-unlock/unlock.gif")],
]);

const getPlantSprite = (spritePath: string): ImageSourcePropType => {
  try {
    return PLANT_SPRITES[spritePath];
  } catch (error) {
    console.warn(`Failed to load sprite: ${spritePath}`, error);
    return soilSprites.dry; // Fallback to soil sprite
  }
};

export class GardenPlot {
  private plots: Plot[];
  public constructor() {
    // 4 x 4 grid, last row locked
    this.plots = [];
    let numUnlocked = 12;
    let numLocked = 4;

    for (let i = 0; i < numUnlocked + numLocked; i++) {
      if (i < numUnlocked) {
        this.plots.push(new Plot(true, i));
      } else {
        this.plots.push(new Plot(false, i));
      }
    }
  }

  public getPlots() {
    return this.plots;
  }
}

const playerGarden = new GardenPlot();

const columns = 4;
const screenWidth = Dimensions.get("window").width;
const plotSize = screenWidth / columns;

export interface GardenGridProps {
  selectedItem: Seed | null | GardenTool;
  setSelectedItem: (seed: Seed | null | GardenTool) => void;
  onSeedPlanted: (seed: Seed) => void;
  onPlantHarvested: (seed: Seed) => void;
}

export const GardenGrid = ({
  selectedItem,
  setSelectedItem,
  onSeedPlanted,
}: GardenGridProps) => {
  const [plots, setPlots] = useState(playerGarden.getPlots());
  const [animations, setAnimations] = useState<
    { type: string; location: number }[]
  >([]);
  const [wateredPlots, setWateredPlots] = useState<Set<number>>(new Set());
  const userId = FIREBASE_AUTH.currentUser?.uid;

  const fetchPlots = async () => {
    console.log("Fetching plots for user:", userId);
    const plotsRef = collection(FIRESTORE_DB, "users", userId!, "plots");

    const unsubscribe = onSnapshot(plotsRef, (snapshot) => {
      const updatedPlots = snapshot.docs.map((doc) => ({
        ...doc.data(),
        location: doc.data().location,
      })) as Plot[];
      setPlots([...updatedPlots]);
    });

    return unsubscribe; // Clean up the listener on unmount
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const renderPlotContent = (plot: Plot) => {
    if (plot.unlocked) {
      if (plot.plant) {
        const spritePath = createPlantFromData(plot.plant).getSpriteString();
        const image = getPlantSprite(spritePath);
        const plotSprite = wateredPlots.has(plot.location)
          ? soilSprites.watered
          : soilSprites.dry;

        return (
          <ImageBackground
            source={plotSprite}
            style={styles.plotItem}
            resizeMode="cover"
          >
            <Image
              source={image}
              style={styles.plantSprite}
              resizeMode="contain"
            />
          </ImageBackground>
        );
      } else {
        return (
          <ImageBackground
            source={soilSprites.dry}
            style={styles.emptyPlot}
            resizeMode="cover"
          />
        );
      }
    } else {
      return (
        <ImageBackground
          source={soilSprites.locked}
          style={styles.lockedPlot}
          resizeMode="cover"
        />
      );
    }
  };

  return (
    <View style={styles.gridContainer}>
      <View style={styles.grid}>
        {plots.map((plot, index) => (
          <TouchableOpacity
            key={`plot-${index}`}
            onPress={() => handlePress(plot, index)}
            style={styles.plotTouchable}
          >
            {renderPlotContent(plot)}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Add all necessary styles here
});
