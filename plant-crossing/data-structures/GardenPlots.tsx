import { Plot } from "./Plot";
import { Plant } from "./Plant";
import { Seed, Rarity } from "./Seed";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity, ImageBackground, ImageSourcePropType } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const SPRITES = {
    SOIL: require('../assets/Soil_Sprites/Soil_1.png') as ImageSourcePropType,
  } as const;

export class GardenPlot {
    private plots: Plot[];
    private costsToUnlock: number[];
    public constructor() { // 4 x 4 grid, last row locked
        this.plots = [];
        let numUnlocked = 12;
        let numLocked = 4;

        for (let i = 0; i < numUnlocked; i++) {
            this.plots.push(new Plot(true));
        }
        for (let i = 0; i < numLocked; i++) {
            this.plots.push(new Plot(false));
        }

        this.costsToUnlock = [100, 150, 200, 250];
    }

    public getPlots() {
        return this.plots;
    }
}

const plantedSeeds = [ // can change this later or pull randomly from items.ts
    new Seed("Fern Seed", Rarity.common, 2, 7),
    new Seed("Rose Seed", Rarity.common, 5, 5),
    new Seed("Cherry Blossom Seed", Rarity.rare, 5, 5),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

// TO ADD: the player garden should be saved per user 
const playerGarden = new GardenPlot();
const playerPlots = playerGarden.getPlots();
playerPlots.map((plot, index) => {
    const seed = plantedSeeds[index];
    if (seed && plot.getUnlocked()) {
        plot.plantSeed(seed);
    }
});

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
    selectedItem: Seed | null;
    setSelectedItem: (seed: Seed | null) => void;
    onSeedPlanted: (seed: Seed) => void;
}

export const GardenGrid = ({ selectedItem, setSelectedItem, onSeedPlanted }: GardenGridProps) => {
    const [plots, setPlots] = useState(playerGarden.getPlots());

    const handlePress = (plot: any, index: any) => {
        if (plot?.getUnlocked()) {
            if (plot.getSeed()) {
                plot.getSeed()?.water();
            } else if (selectedItem) {
                plot.plantSeed(selectedItem);
                onSeedPlanted(selectedItem);
                setSelectedItem(null);
            }
        } else {
            plot.setUnlocked(true);
        }
        const updatedPlots = [...plots];
        updatedPlots[index] = plot;
        setPlots(updatedPlots);
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











