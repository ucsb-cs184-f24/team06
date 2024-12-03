import { Plot } from "../types/Plot";
import { Plant } from "../types/Plant";
import { Seed, Rarity } from "../types/Seed";
import React, { useState, useEffect } from "react";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { PlantService } from "../managers/PlantService";
import { PlotService } from "../managers/PlotService";
import { SeedService } from "../managers/SeedService";
import { getSpriteForPlant } from "../assets/spritesList";
import { UnlockPlotModal } from '../components/UnlockPlot';

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
  Modal,
  Alert
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
import { PLANT_SPRITES } from "../assets/spritesList";
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

const formatPlantName = (name: string | undefined): string => {
  if (!name) return "";
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

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
  const [isUnlockModalVisible, setIsUnlockModalVisible] = useState(false);
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null);

  const fetchPlots = async () => {
    console.log("Fetching plots for user:", userId);
    const plotsRef = collection(FIRESTORE_DB, "users", userId!, "plots");

    // Listen to real-time updates
    const unsubscribe = onSnapshot(plotsRef, (snapshot) => {
      const updatedPlots = snapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Updated doc data:", JSON.stringify(data)); // Verify growthBoost here
        const growthBoost = data?.plant?.growthBoost;
        return {
          ...data,
          location: data.location,
          plant: {
            ...data.plant,
            growthBoost: growthBoost,
          },
        };
      }) as Plot[];
      setPlots([...updatedPlots]);
    });

    return unsubscribe; // Clean up the listener on unmount
  };

  useEffect(() => {
    fetchPlots();
  }, []);

  const clearAnimation = (plotLocation: number) => {
    setAnimations((prev) =>
      prev.filter((anim) => anim.location !== plotLocation)
    );
  };

  const startAnimation = (type: string, plotLocation: number) => {
    setAnimations((prev) => [...prev, { type, location: plotLocation }]);
    const timeout = setTimeout(() => {
      clearAnimation(plotLocation);
    }, 1250); // 1.25 seconds for the animation
    return () => clearTimeout(timeout);
  };
  
  const handleUnlockConfirm = async () => {
    if (selectedPlotIndex !== null) {
      try {
        const db = FIRESTORE_DB;
        try {
          const user = FIREBASE_AUTH.currentUser;

          if (!user) {
            Alert.alert("Error", "Please log in to make a purchase.");
            return;
          }

          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            Alert.alert("Error", "User data not found.");
            return;
          }

          const currentCoins = userDoc.data().coins || 0;
          const itemPrice = Number(10); // cost to unlock plot

          if (currentCoins < itemPrice) {
            Alert.alert(
              "Insufficient Coins",
              `You need ${
                itemPrice - currentCoins
              } more coins to purchase this item.`
            );
            return;
          }

          await updateDoc(userDocRef, {
            coins: currentCoins - itemPrice,
          });

          // continue with purchase
          await PlotService.unlockPlot(userId!, selectedPlotIndex);
          startAnimation("unlock", selectedPlotIndex);
        } catch (error) {
          console.error("Purchase error:", error);
          Alert.alert(
            "Error",
            "There was an error processing your purchase. Please try again."
          );
        }
        
      } catch (error) {
        console.error("Error unlocking plot:", error);
        // You might want to show an error message to the user here
      }
      setIsUnlockModalVisible(false);
      setSelectedPlotIndex(null);
      fetchPlots();
    }
  };

  const handlePress = async (plot: Plot, index: number) => {
    if (!plot.unlocked) {
      // plot is locked. display modal to prompt if want to buy
      setSelectedPlotIndex(plot.location);
      setIsUnlockModalVisible(true);
      // await PlotService.unlockPlot(userId!, plot.location);
      // startAnimation("unlock", plot.location); //a little buggy, can be removed
    } else {
      if (plot.plant && Object.keys(plot.plant).length > 0) {
        if (selectedItem?.type == "Shovel") {
          // dig up plant if shovel selected
          startAnimation("digging", plot.location);
          await PlotService.removePlantFromPlot(userId!, plot.location);
          setWateredPlots((prev) => {
            // remove watered plot from set when boost ends
            prev.delete(plot.location);
            return new Set(prev);
          });
          await SeedService.addSeed(
            new Seed(
              plot.plant.type,
              plot.plant.rarity,
              plot.plant.growthTime,
              plot.plant.maxWater,
              plot.plant.spriteNumber,
              1
            )
          );
        } else if (selectedItem?.type == "WateringCan") {
          let plantID = await PlantService.getPlantIdByDescription(
            plot.plant.type,
            plot.plant.rarity
          );
          if (plantID) {
            startAnimation("watering", plot.location); //start watering animation
            setWateredPlots((prev) => new Set(prev.add(plot.location))); //add plot to the set of watered plots (to change sprite)
            await PlantService.waterPlant(plantID, 1);
            await PlantService.boostPlant(plantID, plot.plant.rarity);
            await PlantService.resetBoost(plantID, plot.plant.rarity);
            setWateredPlots((prev) => {
              // remove watered plot from set when boost ends
              prev.delete(plot.location);
              return new Set(prev);
            });
          }
        } else if (
          selectedItem &&
          selectedItem.type != "WateringCan" &&
          selectedItem.type != "Shovel"
        ) {
          startAnimation("planting", plot.location);
          await PlotService.addPlantToPlot(
            userId!,
            plot.location,
            selectedItem as Seed
          );
          setSelectedItem(null);
        }
      }
    }

    fetchPlots();
  };

  const calculateSpriteSize = (scale: number) => {
    // scale is a number where 1 = 100% (normal size)
    // e.g., 1.2 = 120%, 0.8 = 80%
    const size = 100 * scale;
    const offset = -(size - 100) / 2; // Centers the scaled image

    return {
      containerSize: `${size}%`,
      imageSize: size,
      offset: offset,
      containerOffset: `${offset}%`,
    };
  };

  const renderPlotContent = (plot: Plot) => {
    const currentAnimation = animations.find(
      (anim) => anim.location === plot.location
    );

    if (plot.unlocked) {
      if (plot.plant) {
        // Get the sprite directly using getSpriteForPlant
        const image = getSpriteForPlant(
          plot.plant.type,
          plot.plant.growthLevel
        );
        const spriteScale = 1.3; // Adjust this value to change size (e.g., 1.2 = 120%)
        const spriteSize = calculateSpriteSize(spriteScale);

        const plotSprite = wateredPlots.has(plot.location)
          ? soilSprites.watered
          : soilSprites.dry;

        return (
          <ImageBackground
            source={plotSprite}
            style={styles.plotItem}
            resizeMode="cover"
          >
            <View style={styles.plotContainer}>
              {/* Plant sprite */}
              {image && (
                <View style={styles.plantSpriteContainer}>
                  <Svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <SvgImage
                      x={spriteSize.offset}
                      y={spriteSize.offset}
                      width={spriteSize.imageSize}
                      height={spriteSize.imageSize}
                      href={image}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  </Svg>
                </View>
              )}
              {/* Optional animation (watering, planting, unlocking plot, or digging) */}
              {currentAnimation && (
                <ExpoImage
                  source={animationPaths.get(currentAnimation.type)}
                  style={styles.wateringGif}
                  contentFit="contain"
                  priority="high"
                />
              )}
              {/* Optional text overlay */}
              <View style={styles.textOverlay}>
                <Text style={[styles.plotText, globalStyles.text]}>
                  {formatPlantName(plot.plant?.type)}
                </Text>
              </View>
              x
            </View>
          </ImageBackground>
        );
      } else {
        // Empty plot
        return (
          <ImageBackground
            source={soilSprites.dry}
            style={styles.emptyPlot}
            resizeMode="cover"
          >
            {selectedItem && <View style={styles.emptyPlot} />}
          </ImageBackground>
        );
      }
    } else {
      // Locked plot
      return (
        <ImageBackground
          source={soilSprites.locked}
          style={styles.lockedPlot}
          resizeMode="cover"
        >
          <View style={styles.textOverlay}>
            <Text style={[styles.plotText, styles.lockedPlotText, globalStyles.text]}>
              10 coins
            </Text>
          </View>
        </ImageBackground>
      );
    }
  };

  return (
    <View style={styles.gridContainer}>
      <View style={styles.grid}>
        {plots.map((plot, index) => {
          let content = renderPlotContent(plot);
          return (
            <TouchableOpacity
              key={`plot-${index}`}
              onPress={() => handlePress(plot, index)}
              style={styles.plotTouchable}
            >
              {content}
            </TouchableOpacity>
          );
        })}
      </View>
      <UnlockPlotModal
        visible={isUnlockModalVisible}
        onClose={() => setIsUnlockModalVisible(false)}
        onConfirm={handleUnlockConfirm}
        plotIndex={selectedPlotIndex || 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    justifyContent: "flex-start",
  },
  unlocked: {
    backgroundColor: "lightgreen",
  },
  pressed: {
    opacity: 0.7,
  },
  plotText: {
    fontSize: 12,
    color: 'white',
    textAlign: "center",
  },
  item: {
    backgroundColor: "#abf333",
    padding: 2,
    height: plotSize,
    width: plotSize,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  emptyItem: {
    // no item exists at that tile
    backgroundColor: "#cceeee",
    padding: 2,
    height: plotSize,
    width: plotSize,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  readyToPlantItem: {
    // highlight tile if something can be planted here
    padding: 2,
    height: plotSize,
    width: plotSize,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  lockedItem: {
    // tile is locked
    backgroundColor: "#550000",
    padding: 2,
    height: plotSize,
    width: plotSize,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 20,
  },
  gridContainer: {
    flex: 2,
    padding: 8,
    justifyContent: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
    aspectRatio: 1,
  },
  plotTouchable: {
    width: "25%",
    aspectRatio: 1,
    padding: 2,
  },
  plotItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wateringGif: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    height: plotSize,
    width: plotSize,
  },
  emptyPlot: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.13)",
  },
  lockedPlot: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  darkOverlay: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Darker overlay
    justifyContent: "center",
    alignItems: "center",
  },
  lockedPlotText: {
    color: '#ffa500',
  },
  plotContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },

  plotBackground: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  plantSpriteContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: "10%", // Adjust this value to control the size of the sprite
  },

  plantSprite: {
    width: "100%",
    height: "100%",
    // These transform properties help maintain pixel art quality
    transform: [
      { scale: 1 }, // Adjust this value to scale the sprite
    ],
  },

  textOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 2,
    alignItems: "center",
  },
});
