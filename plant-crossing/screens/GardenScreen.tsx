import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Seed } from '../data-structures/Seed';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { GardenGrid } from '../data-structures/GardenPlots';
import { PlayerInventory } from '../data-structures/InventoryBar';

const GardenGridWrapper: React.FC<{
  selectedItem: Seed | null;
  setSelectedItem: (seed: Seed | null) => void;
  onSeedPlanted: (seed: Seed) => void;
}> = ({ selectedItem, setSelectedItem, onSeedPlanted }) => {
  return (
    <View style={styles.gardenWrapper}>
      <ImageBackground 
        source={require('../assets/pixel-lawn.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <GardenGrid
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onSeedPlanted={onSeedPlanted}
        />
      </ImageBackground>
    </View>
  );
};

export default function GardenScreen() {
  const [selectedItem, setSelectedItem] = useState<Seed | null>(null);
  const [seedToRemove, setSeedToRemove] = useState<Seed | null>(null);

  const handleItemSelected = (item: Seed) => {
    setSelectedItem(item);
  };

  const handleSeedPlanted = (item: Seed) => {
    setSelectedItem(null);
    setSeedToRemove(item);
  }

  return (
    <View style={styles.container}>
      <GardenGridWrapper
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        onSeedPlanted={handleSeedPlanted}
      />
      <PlayerInventory 
        onItemSelected={handleItemSelected}
        seedToRemove={seedToRemove}
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
  gardenWrapper: {
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
    fontWeight: 'bold',
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