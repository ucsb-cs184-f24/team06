import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Seed } from '../types/Seed';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { GardenPlots } from '../data-structures/GardenPlots';
import { PlayerInventory } from '../data-structures/InventoryBar';
import { GardenTool, GardenTools } from '../data-structures/GardenTools';

export default function GardenScreen() {
  const [selectedItem, setSelectedItem] = useState<Seed | null>(null);

  const handleItemSelected = (item: Seed) => {
    setSelectedItem(item); // select item from inventory
  };

  const handleSeedPlanted = (item: Seed) => {
    setSelectedItem(null); 
  }

  const handlePlantHarvested = (item: Seed) => {
    console.log("Handling plant harvest for: ", item);
    setSeedToAdd(item); // seed has been harvested, needs to be added to inventory
  }

  return (
      <View style={styles.container}>
        <GardenPlots 
          selectedItem={selectedItem} 
          setSelectedItem={setSelectedItem}
          onSeedPlanted={handleSeedPlanted} // tell inventory to delete item once planted
          onPlantHarvested={handlePlantHarvested} // tell inventory to add item once dug up by shovel
        />
        <PlayerInventory 
          onItemSelected={handleItemSelected}
        />
        <StatusBar style="auto" />
      </View>
    );
}

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
    backgroundColor: '#d1dbcd',
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
