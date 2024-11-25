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

const SPRITES = {
    SOIL: require('../assets/Soil_Sprites/Soil_1.png') as ImageSourcePropType,
  } as const;

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
    const [isWatering, setIsWatering] = useState(false);
    const [animationLocation, setAnimationLocation] = useState(-1); //plot that should be animated
    // const [gifKey, setGifKey] = useState(0); // state to restart gif from frame 1 when animation plays
    const [gifKey, setGifKey] = useState(''); 

    const userId = FIREBASE_AUTH.currentUser?.uid;

    const fetchPlots = async () => {
        console.log('Fetching plots for user:', userId);
        const plotsRef = collection(FIRESTORE_DB, 'users', userId!, 'plots');

        // Listen to real-time updates
        const unsubscribe = onSnapshot(plotsRef, (snapshot) => {
            const updatedPlots = snapshot.docs.map(doc => ({
                ...doc.data(),
                location: doc.data().location,
            })) as Plot[];
            setPlots(updatedPlots);
        });

        return unsubscribe; // Clean up the listener on unmount
    };

    useEffect(() => {
        fetchPlots();
    }, []);

    const startWateringAnimation = (plotLocation: number) => {
        setIsWatering(true);
        setAnimationLocation(plotLocation);
        restartGif();
        const timeout = setTimeout(() => {
            setIsWatering(false);
            setAnimationLocation(-1);
        }, 1250); // 1.25 second watering (5 frames, each display .25 seconds)
        return () => {
            clearTimeout(timeout);
        };
    };

    const restartGif = () => {
        setGifKey((prevKey) => (prevKey + 1)); // Increment key to re-render the GIF
    };

    const handlePress = async (plot: Plot, index: number) => {
        if (!plot.unlocked) {
          await PlotService.unlockPlot(userId!, plot.location);
        } else {
          if (plot.plant) {
            if(selectedItem?.type == "Shovel"){ // dig up plant if shovel selected
                await SeedService.addSeed(new Seed(plot.plant.type, plot.plant.rarity, plot.plant.growthTime, plot.plant.maxWater, plot.plant.spriteNumber));
                await PlotService.removePlantFromPlot(userId!, plot.location);
            } else if (selectedItem?.type == "WateringCan") {
                let plantID = await PlantService.getPlantIdByDescription(plot.plant.type, plot.plant.rarity);
                if(plantID){
                    await PlantService.waterPlant(plantID, 1);
                    startWateringAnimation(plot.location);
                }
            }
          } else if (selectedItem && (selectedItem.type != "WateringCan" && selectedItem.type != "Shovel")) {
            console.log(selectedItem);
            await PlotService.addPlantToPlot(userId!, plot.location, selectedItem);
            setSelectedItem(null); 
          }
        }
    
        fetchPlots();
    };

    const renderPlotContent = (plot: Plot) => {
        if (plot.unlocked) {
            if (plot.plant) {
                // Planted plot with seed
                return (
                    <ImageBackground 
                        source={SPRITES.SOIL}
                        style={styles.plotItem}
                        resizeMode="cover"
                    >
                    {isWatering && (plot.location == animationLocation) ? (
                        <Image 
                            source={require('../assets/watering-animation/watering.gif')}
                            style={styles.wateringGif} 
                            resizeMode="center" 
                            key={gifKey}
                        />                
                    ) : (
                        <View style={styles.plantOverlay}>
                            <Text style={styles.plotText}>{plot.plant.type}</Text>
                        </View>
                    )}
                    </ImageBackground>
                );
            } else {
                // Empty plot
                return (
                    <ImageBackground 
                        source={SPRITES.SOIL}
                        style={styles.emptyPlot}
                        resizeMode="cover"
                    >
                        {selectedItem && (
                            <View style={styles.readyToPlantOverlay} />
                        )}
                    </ImageBackground>
                );
            }
        } else {
            // Locked plot
            return (
                <ImageBackground 
                    source={SPRITES.SOIL}
                    style={styles.lockedPlot}
                    resizeMode="cover"
                >
                    <Text style={styles.lockedText}>Locked</Text>
                </ImageBackground>
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
    container: {
        flex: 3,
        justifyContent: 'flex-start'
    },
    unlocked: {
        backgroundColor: 'lightgreen',
    },
    locked: {
        backgroundColor: 'gray',
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
        backgroundColor: '#ddeeee',
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
        backgroundColor: '#abf333',
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
        backgroundColor: '#cceeee',
    },
    lockedPlot: {
        flex: 1,
        backgroundColor: '#550000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedText: {
        color: '#fff',
        fontSize: 12,
    },
});