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

    public getPlots (){
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

// // get plots from user variable
// const getPlotsFromFirebase = async () => {
//     const user = FIREBASE_AUTH.currentUser;
//     if(user){
//         const userDocRef = doc(FIRESTORE_DB, "plots");
//         const userDoc = await getDoc(userDocRef);
//         if(userDoc.exists()){
//             const plots: GardenPlot = userDoc.data().plots || {};
//             playerGarden = plots;
//         }
//     }
// }

const columns = 4;
const screenWidth = Dimensions.get('window').width;
const plotSize = screenWidth / columns;


type itemProps = {title: string};

const Item = ({title}: itemProps) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

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
    }
});











