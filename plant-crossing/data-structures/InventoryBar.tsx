import { Seed, rarityValue } from "./Seed";
import { weightedRandomSelection } from "../utils/weightedRandom";
import { availableSeeds } from "../data/items";
import { Inventory } from "./Inventory";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, Dimensions, TouchableOpacity} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

//five random seeds (weighted for rarity, same as Shop)
export function getStartingInventory() {
  let seeds = [];
  const weights = availableSeeds.map((item) => 50 / rarityValue[item.getRarity()]);
  for (let i = 0; i < 5; i++) {
    const randomSeed = weightedRandomSelection(availableSeeds, weights);
    seeds.push(randomSeed);
  }
  return seeds;
}

const playerSeeds = getStartingInventory();
const playerInventory = new Inventory(playerSeeds);

type PlayerInventoryProps = {
  seedToRemove: Seed | null;
  onItemSelected: (item:Seed) => void;
}

export const PlayerInventory = ({onItemSelected, seedToRemove}: PlayerInventoryProps) => {
    const [selectedType, setSelectedType] = useState<string>();
    const [inventoryItems, setInventoryItems] = useState(Array.from(playerInventory.getSeeds()));
    const [selectedId, setSelectedId] = useState<string>();

    useEffect(() => {
      if (seedToRemove) {
        playerInventory.removeSeed(seedToRemove);
        setInventoryItems(Array.from(playerInventory.getSeeds()));
      }
    }, [seedToRemove])

    const handlePress = (item: Seed, index: number) => {
      if(item){
        onItemSelected(item);
        return item;
      }
    }
    
    const renderItem = ({ item }: { item: Seed }) => {
      const backgroundColor = item.getType() === selectedType ? '#8ba286' : '#d1dbcd';
      const color = item.getType() === selectedType ? 'white' : 'black';
      return (
          <TouchableOpacity onPress={() => handlePress(item)}>
            <View>
              <Text>{item.getType()}</Text>
            </View>
          </TouchableOpacity>
      )
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.inventorySection}
                data={Array.from(playerInventory.getSeeds())}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.getType()? item.getType() : `empty-${index}`}
                horizontal={true}
                extraData={selectedId}
            />
        </SafeAreaView> 
    );
};



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    gardenSection: {
      flex: 3,
    },
    plotSection: {
      flex: 1,
      backgroundColor: '#bd7743',
    },
    inventorySection: {
      flex: 1,
      backgroundColor: '#ededed',
    },
    invItem: {
      backgroundColor: '#d1dbcd', // #d1dbcd
      padding: 20,
      width: 150,
      marginVertical: 16,
      marginHorizontal: 16,
    },
    invText: {
      fontSize: 14,
      fontWeight: 'bold',
    }
  });
  