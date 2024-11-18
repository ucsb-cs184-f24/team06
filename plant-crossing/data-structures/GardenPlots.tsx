import { Plot } from "./Plot";
import { Plant, Rarity } from "./Plant";
import { Seed } from "./Seed";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

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
                plot.getSeed()?.waterSeed();
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

    return (
        <View style={styles.gridContainer}>
            <View style={styles.grid}>
                {plots.map((plot, index) => {
                    let content;
                    if (plot.getUnlocked()) {
                        if (plot.getSeed()) {
                            content = (
                                <View style={styles.plotItem}>
                                    <Text style={styles.plotText}>{plot.getSeed().getType()}</Text>
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











