import { Plot } from "../types/Plot";
import { Seed, Rarity } from "../types/Seed";
import React, { useState, useEffect } from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { PlantService } from "../managers/PlantService";
import { PlotService } from "../managers/PlotService";
import { View, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity, ImageBackground, ImageSourcePropType } from 'react-native';
import {FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { arrayUnion, collection, onSnapshot, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { GardenTool } from "./GardenTools";

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

    const handlePress = async (plot: Plot, index: number) => {
        if (!plot.unlocked) {
          await PlotService.unlockPlot(userId!, plot.location);
        } else {
          if (plot.plant) {
            await PlotService.removePlantFromPlot(userId!, plot.location);
          } else if (selectedItem) {
            console.log(selectedItem);
            await PlotService.addPlantToPlot(userId!, plot.location, selectedItem);
            setSelectedItem(null); 
          }
        }
    
        fetchPlots();
    };

    const renderPlotContent = (plot: Plot) => {
        if (plot.getUnlocked()) {
            if (plot.getSeed()) {
                // Planted plot with seed
                return (
                    <ImageBackground 
                        source={SPRITES.SOIL}
                        style={styles.plotItem}
                        resizeMode="cover"
                    >
                        <View style={styles.plantOverlay}>
                            <Text style={styles.plotText}>{plot.getSeed().getType()}</Text>
                        </View>
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
                {plots.map((plot, index) => {
                    let content;
                    if (plot.unlocked) {
                        if (plot.plant) {
                            content = (
                                <View style={styles.plotItem}>
                                    <Text style={styles.plotText}>{plot.plant?.type}</Text>
                                </View>
                            );
                        } else {
                            content = <View style={styles.emptyPlot} />;
                        }
                    } else {
                        content = (
                            <View style={styles.lockedPlot}>
                                <Text style={styles.lockedText}>Locked</Text>
                            </View>
                        );
                    }

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
    locked: {
        backgroundColor: 'gray',
    },
    pressed: {
        opacity: 0.7
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
    plotItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    plantOverlay: {
        flex: 1,
        backgroundColor: 'rgba(171, 243, 51, 0.3)',  // semi-transparent green
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyPlot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    readyToPlantOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(100, 200, 100, 0.3)', // highlighting when ready to plant
    },
    lockedPlot: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    plotText: {
        fontSize: 22,
        color: 'black',
        textAlign: 'center',
        textShadowColor: 'white',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    lockedText: {
        color: '#fff',
        fontSize: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
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
});











