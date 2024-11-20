import { Plot } from "./Plot";
import { Plant } from "./Plant";
import { Seed, Rarity } from "./Seed";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import {FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { arrayUnion, collection, onSnapshot, doc, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';

export class GardenPlot {
    private plots: Plot[];
    public constructor(){ // 4 x 4 grid, last row locked
        this.plots = [];
        let numUnlocked = 12;
        let numLocked = 4;
        
        for(let i = 0; i < numUnlocked; i++){
            this.plots.push(new Plot(true, 0));
        }
        for(let i = 0; i < numLocked; i++){
            this.plots.push(new Plot(false, 10 * (i+1)));
        }

        // One plant already in garden for testing purposes
        this.plots[0].plantSeed(new Seed("Poppy", Rarity.common, 2, 3));
    }

    public getPlots() {
        return this.plots;
    }
}

var playerGarden = new GardenPlot();

const getPlotsFromFirebase = () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userDocRef = doc(FIRESTORE_DB, "plots", user.uid);
      onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const plots = snapshot.data().plots || {};
          playerGarden = plots;
          console.log('Player garden updated:', playerGarden);
        } else {
          console.log('No plots document found for this user.');
        }
      }, (error) => {
        console.error('Error fetching plots:', error);
      });
    } else {
      console.error('No user is logged in');
    }
  };


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

export const GardenPlots = ({ selectedItem, setSelectedItem, onSeedPlanted, onPlantHarvested }: GardenGridProps) => {
    const [plots, setPlots] = useState(playerGarden.getPlots()); // Use state to track plots

    const handlePress = (plot:Plot, index: number) => {
        if(selectedItem){
            const itemType = selectedItem.getType(); // type will be name of seed, "Shovel" or "WateringCan"
            
            if (itemType == "WateringCan"){ // Water plant
                if(plot?.getUnlocked() && plot.getSeed()){
                    plot.getSeed()?.water();
                }
            }
            else if (itemType == "Shovel"){ // Dig up seed
                if(plot?.getUnlocked() && plot.getSeed()){
                    console.log("Digging up seed", plot.getSeed()?.getType());
                    onPlantHarvested(plot.getSeed()); // tell GardenScreen to put the harvested seed back in the inventory
                    plot.harvestPlant(); // remove plant from garden plot
                }
            }
            else{ // Plant Seed
                if(plot?.getUnlocked() && !plot.getSeed()){
                    console.log("Seed", selectedItem.type, "planted!");
                    plot.plantSeed(selectedItem);
                    onSeedPlanted(selectedItem); // tell GardenScreen to remove from inventory
                    setSelectedItem(null);
                } 
            }
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











