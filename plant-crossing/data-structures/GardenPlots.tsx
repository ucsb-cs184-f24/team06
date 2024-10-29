import { Plot } from "./Plot";
import { Plant, Rarity } from "./Plant";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export class GardenPlot { 
    private plots: Plot[];
    private costsToUnlock: number[];
    public constructor(){ // 4 x 4 grid, last row locked
        this.plots = [];
        let numUnlocked = 12;
        let numLocked = 4;
        
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

const placeholderPlants = [
    new Plant("Fern Plant", "", Rarity.common, 5, 5),
    null,
    null,
    null,
    null,
    new Plant("Rose Plant", "", Rarity.common, 5, 5),
    new Plant("Cherry Plant", "cherri", Rarity.rare, 5, 5),
    null,
    null,
    null,
    null,
    null
];


type itemProps = {title: string};

const Item = ({title}: itemProps) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

const columns = 4;
const screenWidth = Dimensions.get('window').width;
const plotSize = screenWidth / columns;

const handlePress = (item:Plot) => {
    if(item.getUnlocked()){
        item.getSeed()?.waterSeed;
    }
    else{ // unlocks plot, TO ADD: should cost coins to unlock plot
        item.setUnlocked(true);
    }
};

export const GardenGrid = () => {
    const [selectedId, setSelectedId] = useState([]);

    

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={placeholderPlants}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handlePress(item)}>
                        <View>
                        {item ? <Item title={item.getType()} /> : <View style={styles.emptyItem} />}
                        </View>
                    </TouchableOpacity>
                    // item ? <Item title={item.getType()} /> : <View style={styles.emptyItem} />
                )}
                keyExtractor={(item, index) => item ? item.getType() : `empty-${index}`}
                numColumns = {columns}
            />
        </SafeAreaView>
    );
};
export default GardenGrid;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    title: {
        fontSize: 20
    }
});











