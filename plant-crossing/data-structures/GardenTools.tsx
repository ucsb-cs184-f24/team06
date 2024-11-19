// Watering can and shovel bar 
// position of these can be adjusted later

import { Seed, rarityValue } from "./Seed";
import { weightedRandomSelection } from "../utils/weightedRandom";
import { availableSeeds } from "../data/items";
import { Inventory } from "./Inventory";
import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet, FlatList, ListRenderItem, Text, Dimensions, TouchableOpacity, ScrollView} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

// class Shovel{
//     private sprite: null; //path to sprite image
// }

// class WateringCan{
//     private sprite: null; //path to sprite image
// }

export class GardenTool {
    private type: string;
    public sprite: string;
    public spriteClicked: string;
    constructor(type: string){
        this.type = type;
        if(this.type == 'WateringCan'){
            this.sprite = "plant-crossing/assets/tool-sprites/WateringCan.png"
            this.spriteClicked = "plant-crossing/assets/tool-sprites/WateringCan.png" 
        } else{
            this.sprite = "plant-crossing/assets/tool-sprites/Shovel.png"
            this.spriteClicked = "plant-crossing/assets/tool-sprites/Shovel.png"
        }
    }
    public getType(){
        return this.type;
    }
}

// const DATA: GardenTool[] = [
//     { type: 'WateringCan', sprite: "plant-crossing/assets/tool-sprites/WateringCan.png"},
//     { type: 'shovel', sprite: "plant-crossing/assets/tool-sprites/Shovel.png"},
// ];

const DATA = [
    new GardenTool("WateringCan"),
    new GardenTool("Shovel")
]

type GardenToolProps = {
    selectedItem: Seed | null | GardenTool;
    setSelectedItem: (item: Seed | GardenTool | null) => void;
};

export const GardenTools = ({selectedItem, setSelectedItem} : GardenToolProps) =>{
    const handlePress = (tool: GardenTool) => {
        setSelectedItem(tool);
        console.log("selected item:", selectedItem);
        console.log("PRESSED ", tool.sprite);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={DATA}
                keyExtractor={(item) => item.getType()}
                renderItem={({item}) => {
                    return (
                        <View style={styles.container}>
                        {/* <Image source={{ uri: tool.sprite }} style={styles.itemImage} /> */}
                        <View style={styles.container}>
                            <Text>{item.getType()}</Text> 
                            <Button title="Click Me" onPress={() => handlePress(item)}/>
                        </View>
                        </View>
                    )
                
                }}
                horizontal={true}
            />
        </SafeAreaView> 
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
  });
  