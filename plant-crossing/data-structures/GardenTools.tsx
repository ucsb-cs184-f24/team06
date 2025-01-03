import { Seed, rarityValue } from "../types/Seed";
import React, { useState, useEffect, SetStateAction } from "react";
import { View, Image, Button, StyleSheet, FlatList, ListRenderItem, Text, Dimensions, TouchableOpacity, ScrollView, Touchable} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

export class GardenTool { // store the name of the tool in "Type" for GardenPlot
    public type: string;
    constructor(type: string){
        this.type = type;
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

const DATA = [
    new GardenTool("WateringCan"),
    new GardenTool("Shovel")
]

type GardenToolProps = {
    selectedItem: Seed | GardenTool | null;
    setSelectedItem: (item: Seed | GardenTool | null) => void;
};

export const GardenTools: React.FC<GardenToolProps> = ({selectedItem, setSelectedItem}) =>{
    const [spriteWateringCan, setSpriteWateringCan] = useState(sprites.WateringCan);
    const [spriteShovel, setSpriteShovel] = useState(sprites.Shovel);


    // change the sprite once tool is clicked and set selectedItem to the correct tool
    const handlePress = (tool: GardenTool) => {
        if(tool.getType() == "WateringCan"){
            setSpriteShovel(sprites.Shovel); // deselect shovel
            if(selectedItem?.type == "WateringCan"){ // watering can is already selected: deselect
                setSpriteWateringCan(sprites.WateringCan);
                setSelectedItem(null);
            } else{
                setSpriteWateringCan(sprites.WateringCanSelect);
                setSelectedItem(tool);
            }
        }
        else if(tool.getType() == "Shovel"){
            setSpriteWateringCan(sprites.WateringCan); // deselect can
            if(selectedItem?.type == "Shovel"){ // shovel is already selected: deselect
                setSpriteShovel(sprites.Shovel);
                setSelectedItem(null);
            } else{
                setSpriteShovel(sprites.ShovelSelect);
                setSelectedItem(tool);
            }
        }
    };

    // Change the tool graphics if a seed item is selected in the inventory
    useEffect(() => {
        if (selectedItem && (selectedItem?.type != "WateringCan" && selectedItem?.type != "Shovel")) {
            setSpriteShovel(sprites.Shovel);
            setSpriteWateringCan(sprites.WateringCan);
        }
    }, [selectedItem]); 

    return (
        <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            scrollEnabled={false}
        >
            {DATA.map((item) => {
                let buttonImg;
                if (item.getType() == "WateringCan"){
                    buttonImg = spriteWateringCan;
                } else if (item.getType() == "Shovel"){
                    buttonImg = spriteShovel;
                }

                return (
                    <View key={item.getType()} style={styles.container}>
                        {/* <Text>{item.getType()}</Text>  */}
                        <TouchableOpacity style={styles.button} onPress={() => handlePress(item)}>
                            <Image source={buttonImg} style={styles.itemImage}/>
                        </TouchableOpacity>
                    </View>
                )
            })}
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    scrollContainer: {
        width: '100%',
        justifyContent: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 60,
        height: 60,
        backgroundColor: '#e6d7c9',
    },
    itemImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    }
});