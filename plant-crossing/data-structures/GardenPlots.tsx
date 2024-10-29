import { Plot } from "./Plot";
import { Plant, Rarity } from "./Plant";
import { Seed } from "./Seed";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export class GardenPlot { 
    private plots: Plot[];
    private costsToUnlock: number[];
    public constructor(){ // 4 x 4 grid, last row locked
        this.plots = [];
        let numUnlocked = 7;
        let numLocked = 9;
        
        for(let i = 0; i < numUnlocked; i++){
            this.plots.push(new Plot(true));
        }
        for(let i = 0; i < numLocked; i++){
            this.plots.push(new Plot(false));
        }

        this.costsToUnlock = [100, 150, 200, 250];
    }

    public getPlots (){
        return this.plots;
    }
}

const startingSeeds = [ // can change this later or pull randomly from items.ts
    new Seed("Fern Seed", Rarity.common, 2, 7),
    null,
    null,
    null,
    null,
    new Seed("Rose Seed", Rarity.common, 5, 5),
    new Seed("Cherry Blossom Seed", Rarity.rare, 5, 5),
    null,
    null,
    null,
    null,
    null
];
const testSeed = new Seed("Test Seed Planted", Rarity.legendary, 10, 10); // to test seed planting

const playerGarden = new GardenPlot();
const playerPlots = playerGarden.getPlots();
playerPlots.map((plot, index) => {
    const seed = startingSeeds[index];
    if(seed && plot.getUnlocked()){
        plot.plantSeed(seed);
    }
});
const columns = 4;
const screenWidth = Dimensions.get('window').width;
const plotSize = screenWidth / columns;


type itemProps = {title: string};

const Item = ({title}: itemProps) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

export const GardenGrid = () => {
    const [plots, setPlots] = useState(playerGarden.getPlots()); // Use state to track plots

    const handlePress = (item:Plot, index: number) => {
        if(item?.getUnlocked()){
            if(item.getSeed()){ // TO ADD: watering logic goes here
                item.getSeed()?.waterSeed();
            } else{ // TO ADD: plant specific plant here
                item.plantSeed(testSeed);
            }
        }
        else{ // unlocks plot, TO ADD: should cost coins to unlock plot
            item.setUnlocked(true);
        }
        const updatedPlots = [...plots]; // this seems inefficient, (but follows react standards, so keep it?)
        updatedPlots[index] = item;
        setPlots(updatedPlots);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={playerGarden.getPlots()}
                renderItem={({ item }) => {
                    let content;
                    if (item.getUnlocked()) {
                        if (item.getSeed()) {
                            content = <Item title={item.getSeed().getType()} />;
                        } else {
                            content = <View style={styles.emptyItem} />;
                        }
                    } else {
                        content = <Text style={styles.lockedItem}>Locked</Text>;
                    }

                    return (
                        <TouchableOpacity onPress={() => handlePress(item)}>
                            <View>{content}</View>
                        </TouchableOpacity>
                    )
                }}
                keyExtractor={(item, index) => item.getSeed() ? item.getSeed().getType() : `empty-${index}`}
                numColumns = {columns}
            />
        </SafeAreaView>
    );
};
export default GardenGrid;

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
    lockedItem: {
        backgroundColor: '#550000',
        padding: 2,
        height: plotSize,
        width: plotSize,
        marginVertical: 0,
        marginHorizontal: 0,
    },
    title: {
        fontSize: 20
    }
});











