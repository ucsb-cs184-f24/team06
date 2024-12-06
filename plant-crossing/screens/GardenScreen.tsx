import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Seed } from '../types/Seed'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { GardenGrid } from '../data-structures/GardenPlots';
import { PlayerInventory } from '../data-structures/InventoryBar';
import { GardenTool, GardenTools } from '../data-structures/GardenTools';
import { globalStyles } from '../styles/globalStyles';

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
      <GardenGrid
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        onSeedPlanted={onSeedPlanted}
        onPlantHarvested={onPlantHarvested}
      />
    </ImageBackground>
  );
};

export default function GardenScreen() {
  const [selectedItem, setSelectedItem] = useState<Seed | GardenTool | null>(null);
  const [seedToRemove, setSeedToRemove] = useState<Seed | null>(null);
  const [seedToAdd, setSeedToAdd] = useState<Seed | null>(null);

  const handleItemSelected = (item: Seed) => {
    setSelectedItem(item); // select item from inventory
  };

  const handleSeedPlanted = (item: Seed) => {
    setSelectedItem(null); 
    setSeedToRemove(item); // seed is planted, needs to be removed from inventory
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
      <ImageBackground 
          source={require('../assets/inventory-background.jpg')} 
          style={styles.backgroundImage}
          resizeMode="stretch"
        >

        <View style={styles.invHeaderText}>
          <Text style={[globalStyles.text, { color: 'white', fontSize:16 }]}>
            Inventory
          </Text>
          <Text style={[globalStyles.text, { color: 'white', fontSize:16 }]}>
            Tools
          </Text>
        </View>
        <View style={styles.lowerSection}>
          <View style={styles.inventorySection}>
            <PlayerInventory 
              onItemSelected={handleItemSelected} 
              // seedToRemove={seedToRemove}
              // seedToAdd={seedToAdd}
            />
          </View>
          <View style={styles.toolsSection}>
            <GardenTools
              selectedItem={selectedItem} 
              setSelectedItem={setSelectedItem}
            />
          </View>
        </View>
      </ImageBackground>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: "center", // del
    justifyContent: "center",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  // Lower section container (2/5 of screen)
  lowerSection: {
    flex: 2,
    width: '100%',
    flexDirection: 'row',
    padding: 8, // Adds uniform padding around all sides
    // paddingTop: 1
  },
  // Tools section (1/5 of screen)
  toolsSection: {
    // flex: 1,
    padding: 5,
    width: '18%',
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  plotSection: {
    flex: 1,
    backgroundColor: "#bd7743",
  },
  // Inventory section (1/5 of screen)
  inventorySection: {
    flex: 1,
    padding: 5,
    width: '75%',
    backgroundColor: '#ededed',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginRight:8, //add padding between inventory and tools
  },
  invItem: {
    backgroundColor: '#d1dbcd',
    padding: 5,
    width: 150,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  invHeaderText:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8, // Adds uniform padding around all sides
    paddingTop: 5,
    paddingBottom: 0
    // backgroundColor: "#392031"
  },
  lowerTextInventory:{
    fontSize: 20,
    fontWeight: 'bold',
    color:'#ffe8e1',
    alignItems: 'flex-start',
  },
  lowerTextTools:{
    fontSize: 20,
    fontWeight: 'bold',
    color:'#1fe8e1',
    alignItems: 'flex-end', // Align content to the left
  }
});
