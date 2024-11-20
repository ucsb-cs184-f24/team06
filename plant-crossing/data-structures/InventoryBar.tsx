import { Seed, rarityValue, Rarity } from "../types/Seed";
import { weightedRandomSelection } from "../utils/weightedRandom";
import { availableSeeds } from "../data/items";
import { Inventory } from "./Inventory";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { collection, doc, onSnapshot } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";

// function getStartingInventory(){
//   let seeds = [];
//   const weights = availableSeeds.map((item) => 50/rarityValue[item.rarity]);
//   for(let i = 0; i < 5; i++){
//     const randomSeed = weightedRandomSelection(availableSeeds, weights);
//     seeds.push(randomSeed);
//   }
//   return seeds;
// }

// const playerSeeds = getStartingInventory();
// const playerInventory = new Inventory(playerSeeds);

interface PlayerInventoryProps {
  onItemSelected: (item: Seed) => void;
}

export const PlayerInventory = ({ onItemSelected }: PlayerInventoryProps) => {
  const [inventoryItems, setInventoryItems] = useState<Seed[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    console.log('PlayerInventory loaded');
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) {
      console.error('No user ID available');
      return;
    }
  
    const seedsCollectionRef = collection(doc(FIRESTORE_DB, 'users', userId), 'seeds');
    console.log('Fetching seeds from Firestore:', seedsCollectionRef);
  
    const unsubscribe = onSnapshot(seedsCollectionRef, (snapshot) => {
      try {
        const seedsList = snapshot.docs.map(doc => {
          console.log('Seed data:', doc.data());
          const data = doc.data();
          return new Seed(
            data.type,
            data.rarity as Rarity,
            data.growthTime,
            data.maxWater,
          );
        });
        setInventoryItems(seedsList);
        console.log('Inventory updated:', seedsList);
      } catch (error) {
        console.error('Error processing snapshot:', error);
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  const handlePress = (item: Seed) => {
    if (item) {
      onItemSelected(item);
      setSelectedId(item.type);
    }
  };

  // Always maintain at least one row
  const rows: (Seed | null)[][] = [];
  const itemsPerRow = 4;
  const minRows = 3; // Minimum number of rows to show
  
  // Fill with actual items
  for (let i = 0; i < Math.max(inventoryItems.length, minRows * itemsPerRow); i += itemsPerRow) {
    const row = inventoryItems.slice(i, i + itemsPerRow);
    // Fill empty slots with null to maintain grid structure
    while (row.length < itemsPerRow) {
      row.push(null);
    }
    rows.push(row);
  }

  return (
    <ScrollView 
      style={styles.inventoryContainer}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.gridContainer}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((item, colIndex) => (
              <TouchableOpacity
                key={`item-${rowIndex}-${colIndex}`}
                style={[
                  styles.inventoryItem,
                  item && selectedId === item.type && styles.selectedItem,
                  !item && styles.emptyItem
                ]}
                onPress={() => item && handlePress(item)}
                disabled={!item}
              >
                {item && (
                  <Text style={styles.inventoryText}>
                    {item.type}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;
const padding = 8;
const itemSpacing = 8;
const availableWidth = windowWidth - (padding * 2);
const itemWidth = (availableWidth - (itemSpacing * 3)) / 4; // 3 gaps for 4 columns

const styles = StyleSheet.create({
  inventoryContainer: {
    flex: 1,
    backgroundColor: '#ededed',
    width: '100%', // Ensure full width
  },
  scrollContent: {
    flexGrow: 1,
    padding: padding,
    minWidth: '100%', // Ensure minimum width
  },
  gridContainer: {
    width: '100%',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: itemSpacing,
    width: '100%', // Ensure full width
  },
  inventoryItem: {
    backgroundColor: '#d1dbcd',
    width: itemWidth,
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  emptyItem: {
    backgroundColor: '#e8e8e8',
    opacity: 0.5,
  },
  selectedItem: {
    backgroundColor: '#8ba286',
  },
  inventoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});