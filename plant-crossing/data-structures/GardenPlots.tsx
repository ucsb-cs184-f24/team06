import { Plot } from "../types/Plot";
import { Seed, Rarity } from "../types/Seed";
import React, { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { PlantService } from "../managers/PlantService";
import { PlotService } from "../managers/PlotService";
import { SeedService } from "../managers/SeedService";
import { View, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity, ImageBackground, ImageSourcePropType, Animated, Image } from 'react-native';
import {FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { arrayUnion, collection, onSnapshot, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { GardenTool } from "./GardenTools";
import { Inventory } from "./Inventory";
import FastImage from 'react-native-fast-image';

const soilSprites = {
    dry: require('../assets/soil-sprites/soil-dry.png') as ImageSourcePropType,
    watered: require('../assets/soil-sprites/soil-watered.png') as ImageSourcePropType,
    locked: require('../assets/soil-sprites/soil-locked.png') as ImageSourcePropType,
} as const;


const animationPaths = new Map<string, ImageSourcePropType>([
    ['watering', require('../assets/animation-watering/watering.gif')],
    ['planting', require('../assets/animation-planting/planting.gif')],
    ['digging', require('../assets/animation-digging/digging.gif')],
]);
  

export class GardenPlot {
    private plots: Plot[];
    public constructor(){ // 4 x 4 grid, last row locked
        this.plots = [];
        let numUnlocked = 12;
        let numLocked = 4;

        for (let i = 0; i < numUnlocked + numLocked; i++) {
            if (i < numUnlocked) {
                this.plots.push(new Plot(true, i));
            }
            else {
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
const screenWidth = Dimensions.get('window').width;
const plotSize = screenWidth / columns;


type itemProps = { title: string };

const Item = ({ title }: itemProps) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

export interface GardenGridProps {
    selectedItem: Seed | null | GardenTool;
    setSelectedItem: (seed: Seed | null | GardenTool) => void;
    onSeedPlanted: (seed: Seed) => void;
    onPlantHarvested: (seed: Seed) => void;
}

  
export const GardenGrid = ({ selectedItem, setSelectedItem, onSeedPlanted }: GardenGridProps) => {
    const [plots, setPlots] = useState(playerGarden.getPlots());
    const [animations, setAnimations] = useState<{ type: string; location: number }[]>([]);
    const [animationLocation, setAnimationLocation] = useState(-1); //plot that should be animated
    const userId = FIREBASE_AUTH.currentUser?.uid;

    const fetchPlots = async () => {
        console.log('Fetching plots for user:', userId);
        const plotsRef = collection(FIRESTORE_DB, 'users', userId!, 'plots');

        // Listen to real-time updates
        const unsubscribe = onSnapshot(plotsRef, (snapshot) => {
            const updatedPlots = snapshot.docs.map(doc => {
                const data = doc.data();
                console.log("Updated doc data:", data); // Verify growthBoost here
                return {
                    ...data,
                    location: data.location,
                    plant: {
                        ...data.plant
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
        setAnimations((prev) => prev.filter((anim) => anim.location !== plotLocation));
    };

    const startAnimation = (type: string, plotLocation: number) => {
        setAnimations((prev) => [...prev, { type, location: plotLocation }]);
        const timeout = setTimeout(() => {
            clearAnimation(plotLocation);
        }, 3000); // 3 seconds for the animation
        return () => clearTimeout(timeout);
    };

    const handlePress = async (plot: Plot, index: number) => {
        if (!plot.unlocked) {
          await PlotService.unlockPlot(userId!, plot.location);
        } else {
            // setAnimations(null); // clear the current animation
            console.log("plot plant", JSON.stringify(plot.plant));
          if (plot.plant && (Object.keys(plot.plant).length > 0)) {
            console.log("test1");
            if(selectedItem?.type == "Shovel"){ // dig up plant if shovel selected
                startAnimation("digging", plot.location);
                await PlotService.removePlantFromPlot(userId!, plot.location);
                await SeedService.addSeed(new Seed(plot.plant.type, plot.plant.rarity, plot.plant.growthTime, plot.plant.maxWater, plot.plant.spriteNumber));
            } else if (selectedItem?.type == "WateringCan") {
                let plantID = await PlantService.getPlantIdByDescription(plot.plant.type, plot.plant.rarity);
                if(plantID){
                    startAnimation("watering", plot.location);
                    await PlantService.waterPlant(plantID, 1);
                    let b = await PlantService.boostPlant(plantID, plot.plant.rarity);
                    plot.watered = true;
                }
            }
          } else if (selectedItem && (selectedItem.type != "WateringCan" && selectedItem.type != "Shovel")) {
            await PlotService.addPlantToPlot(userId!, plot.location, selectedItem);
            startAnimation("planting", plot.location);
            setSelectedItem(null); 
          }
        }
    
        fetchPlots();
    };

    const renderPlotContent = (plot: Plot) => {
        const currentAnimation = animations.find((anim) => anim.location === plot.location);
    
        if (plot.unlocked) {
            if (plot.plant) {
                let plotSprite = soilSprites.dry;
                if (plot.plant.growthBoost > 1) { // Growth boost set to > 1 when plant watered
                    plotSprite = soilSprites.watered;
                }
    
                return (
                    <ImageBackground 
                        source={plotSprite}
                        style={styles.plotItem}
                        resizeMode="cover"
                    >
                        {currentAnimation ? (
                            <Image 
                                source={animationPaths.get(currentAnimation.type)}
                                style={styles.wateringGif} 
                                resizeMode="cover" 
                            />                
                        ) : (
                            <View style={styles.plotItem}>
                                <Text style={styles.plotText}>{plot.plant?.type}</Text>
                            </View>
                        )}
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
                        {selectedItem && (
                            <View style={styles.emptyPlot} />
                        )}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 3,
        justifyContent: 'flex-start'
    },
    unlocked: {
        backgroundColor: 'lightgreen',
    },
    pressed: {
        opacity: 0.7
    },
    plotText: {
        fontSize: 22,
        color: 'black',
    },
    item: {
        backgroundColor: '#abf333',
        padding: 2,
        height: plotSize,
        width: plotSize,
        marginVertical: 0,
        marginHorizontal: 0,
    },
    emptyItem: { // no item exists at that tile
        backgroundColor: '#cceeee',
        padding: 2,
        height: plotSize,
        width: plotSize,
        marginVertical: 0,
        marginHorizontal: 0,
    },
    readyToPlantItem: { // highlight tile if something can be planted here
        padding: 2,
        height: plotSize,
        width: plotSize,
        marginVertical: 0,
        marginHorizontal: 0,
    },
    lockedItem: { // tile is locked
        backgroundColor: '#550000',
        padding: 2,
        height: plotSize,
        width: plotSize,
        marginVertical: 0,
        marginHorizontal: 0,
    },
    title: {
        fontSize: 20
    },
    gridContainer: {
        flex: 2,
        padding: 8,
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
        aspectRatio: 1,
    },
    plotTouchable: {
        width: '25%',
        aspectRatio: 1,
        padding: 2,
    },
    plotItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wateringGif: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        height: plotSize,
        width: plotSize
    },
    emptyPlot: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.13)',
    },
    lockedPlot: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkOverlay: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darker overlay
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Update lockedText for better visibility
    lockedText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});