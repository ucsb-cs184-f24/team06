import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Seed } from '../data-structures/Seed'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { GardenGrid } from '../data-structures/GardenPlots';
import { PlayerInventory } from '../data-structures/InventoryBar';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { Box, ThreeJS } from '../data-structures/ThreeJS'; // Assuming Box is saved in a separate file

export default function GardenScreen() {
  const [selectedItem, setSelectedItem] = useState<Seed | null>(null);
  const [seedToRemove, setSeedToRemove] = useState<Seed | null>(null);

  const handleItemSelected = (item: Seed) => {
    setSelectedItem(item); // select item from inventory
  };

  const handleSeedPlanted = (item: Seed) => {
    setSelectedItem(null); 
    setSeedToRemove(item); // seed is planted, needs to be removed from inventory
  }

  return (
      <View style={styles.container}>
        {/* Add the Three.js Canvas */}
        <View style={styles.canvasContainer}>
          <Canvas>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
          </Canvas>
        </View>
        <GardenGrid 
          selectedItem={selectedItem} 
          setSelectedItem={setSelectedItem}
          onSeedPlanted={handleSeedPlanted} // tell inventory to delete item once planted
        />
        <PlayerInventory 
          onItemSelected={handleItemSelected} 
          seedToRemove={seedToRemove} // Pass the item to remove from PlayerInventory
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
  canvasContainer: {
    width: '100%',
    height: 300, // Adjust height based on your layout
    backgroundColor: 'lightgrey', // Background color for visual separation
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
