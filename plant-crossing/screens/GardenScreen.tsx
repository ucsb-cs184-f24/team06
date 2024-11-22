import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Seed } from '../data-structures/Seed'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { GardenPlots } from '../data-structures/GardenPlots';
import { PlayerInventory } from '../data-structures/InventoryBar';
import { GardenTool, GardenTools } from '../data-structures/GardenTools';

const GardenGridWrapper: React.FC<{
  selectedItem: Seed | GardenTool | null;
  setSelectedItem: (seed: Seed | null) => void;
  onSeedPlanted: (seed: Seed) => void;
  onPlantHarvested: (seed: Seed) => void;
}> = ({ selectedItem, setSelectedItem, onSeedPlanted, onPlantHarvested }) => {
  return (
    <ImageBackground 
      source={require('../assets/pixel-lawn.png')} 
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <GardenPlots
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        onSeedPlanted={onSeedPlanted}
        onPlantHarvested={onPlantHarvested}
      />
    </ImageBackground>
  );
};

export default function GardenScreen() {
  const [selectedItem, setSelectedItem] = useState<Seed | null | GardenTool>(null);
  const [seedToRemove, setSeedToRemove] = useState<Seed | null>(null);
  const [seedToAdd, setSeedToAdd] = useState<Seed | null>(null);

  const handleItemSelected = (item: Seed) => {
    setSelectedItem(item);
  };

  const handleSeedPlanted = (item: Seed) => {
    setSelectedItem(null);
    setSeedToRemove(item);
  }

  const handlePlantHarvested = (item: Seed) => {
    console.log("Handling plant harvest for: ", item);
    setSeedToAdd(item);
  }

  return (
    <View style={styles.container}>
      {/* Garden Plot Section (3/5 of screen) */}
      <View style={styles.gardenSection}>
        <GardenGridWrapper 
          selectedItem={selectedItem} 
          setSelectedItem={setSelectedItem}
          onSeedPlanted={handleSeedPlanted}
          onPlantHarvested={handlePlantHarvested}
        />
      </View>

      {/* Lower Section (2/5 of screen) */}
      <View style={styles.lowerSection}>
        <View style={styles.inventorySection}>
          <PlayerInventory 
            onItemSelected={handleItemSelected} 
            seedToRemove={seedToRemove}
            seedToAdd={seedToAdd}
          />
        </View>
        <View style={styles.toolsSection}>
          <GardenTools
            selectedItem={selectedItem} 
            setSelectedItem={setSelectedItem}
          />
        </View>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Garden Plot section (3/5 of screen)
  gardenSection: {
    flex: 3,
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Lower section container (2/5 of screen)
  lowerSection: {
    flex: 2,
    width: '100%',
  },
  // Tools section (1/5 of screen)
  toolsSection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  // Inventory section (1/5 of screen)
  inventorySection: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ededed',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
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
  },
});