import { Seed, rarityValue } from "./Seed";
import React, { useState, useEffect } from 'react';
import { View, Image, Button, StyleSheet, FlatList, ListRenderItem, Text, Dimensions, TouchableOpacity, ScrollView, Touchable} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export class GardenTool {
    private type: string;
    // public sprite: string;
    // public spriteClicked: string;
    constructor(type: string){
        this.type = type;
        // if(this.type == 'WateringCan'){
        //     this.sprite = "../assets/tool-sprites/WateringCan.png"
        //     this.spriteClicked = "../assets/tool-sprites/WateringCan.png" 
        // } else{
        //     this.sprite = "../assets/tool-sprites/Shovel.png"
        //     this.spriteClicked = "../assets/tool-sprites/Shovel.png"
        // }
    }
    public getType(){
        return this.type;
    }
}

const sprites = {
    WateringCan: require('../assets/tool-sprites/WateringCan.png'),
    WateringCanSelect: require('../assets/tool-sprites/WateringCanSelect.png'),
    Shovel: require("../assets/tool-sprites/Shovel.png"),
    ShovelSelect: require("../assets/tool-sprites/ShovelSelect.png"),
};

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
    const [spriteWateringCan, setSpriteWateringCan] = useState(sprites.WateringCan);
    const [spriteShovel, setSpriteShovel] = useState(sprites.Shovel);

    const handlePress = (tool: GardenTool) => {
        setSelectedItem(tool);
        if(selectedItem?.getType() == "WateringCan"){
            setSpriteWateringCan(sprites.WateringCanSelect);
            setSpriteShovel(sprites.Shovel);
        }
        else if(selectedItem?.getType() == "Shovel"){
            setSpriteWateringCan(sprites.WateringCan);
            setSpriteShovel(sprites.ShovelSelect);
        }else{
            setSpriteWateringCan(sprites.WateringCan);
            setSpriteShovel(sprites.Shovel);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={DATA}
                keyExtractor={(item) => item.getType()}
                renderItem={({item}) => {
                    let buttonImg;
                    if (item.getType() == "WateringCan"){
                        buttonImg = spriteWateringCan;
                    } else if (item.getType() == "Shovel"){
                        buttonImg = spriteShovel;
                    }
                    console.log(buttonImg);

                    return (
                        <View style={styles.container}>
                        <View style={styles.container}>
                            <Text>{item.getType()}</Text> 
                            <TouchableOpacity style={styles.button} onPress={() => handlePress(item)}>
                            <Image source={buttonImg} style={styles.itemImage}/>
                                {/* <Image source={require("../assets/tool-sprites/WateringCan.png")} style={styles.itemImage}/> */}
                            </TouchableOpacity>
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
    },
    itemImage: {
        width: 100,
        height: 100,
    },
    button: {
        width: 100,
        height: 100,
        backgroundColor: '#eeeeee'
    }
  });
  