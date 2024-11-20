import { Seed, rarityValue } from "./Seed";
import { weightedRandomSelection } from "../utils/weightedRandom";
import { availableSeeds } from "../data/items";
import { Inventory } from "./Inventory";
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import {FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { arrayUnion, collection, onSnapshot, doc, getDoc, setDoc, getDocs, getFirestore, updateDoc, DocumentSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

var userDocRef;
const db = FIRESTORE_DB;

// get snapshot of seeds from firebase
const getInventoryFromFirebase = async () => {
  const user = FIREBASE_AUTH.currentUser;
  let userSeeds = [];
  if(!user){
    console.error('Error: User not found.');
    return;
  }
  userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
  
  // Get seeds from firebase on login
  const userDoc = await getDoc(userDocRef);
  if (!userDoc.exists()) {
    console.error('Error: User data not found.');
    return;
  }
  let inventoryJSON = userDoc.data().inventory || {}; // convert seeds from JSON to list of Seed objects
  for(let data of inventoryJSON){
    let seed = new Seed();
    seed.fromJSON(data);
    userSeeds.push(seed);
  }
  return userSeeds;
};

// push updated list of seeds to Firebase
const updateFirebaseInventory = async (playerInventory: Inventory) => {
  const user = FIREBASE_AUTH.currentUser;
  if (!user) {
    console.error('Error: User not found.');
    return;
  }

  // convert playerInventory to JSON format
  let inventoryJSON = [];
  for(let seed of playerInventory.getSeeds()){
    inventoryJSON.push(seed.toJSON());
  }

  const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
  try {
    await setDoc(
      userDocRef,
      {
        inventory: inventoryJSON,
      },
      { merge: true }
    );
  } catch{
    console.error('Error updating firebase inventory.');
  }
};

interface PlayerInventoryProps {
  seedToRemove: Seed | null;
  seedToAdd: Seed | null;
  onItemSelected: (item: Seed) => void;
}

export const PlayerInventory = ({ onItemSelected, seedToRemove, seedToAdd }: PlayerInventoryProps) => {
  const [inventoryItems, setInventoryItems] = useState<Seed[] | null>(new Array(12).fill(null));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [playerInventory, setPlayerInventory] = useState<Inventory | null>(null); // Manage playerInventory here
  
  // get player inventory
  useEffect(() => {
    const getPlayerInventory = async () => {
      const userSeeds = await getInventoryFromFirebase();
      if (userSeeds) {
        const newInventory = new Inventory(userSeeds);
        setPlayerInventory(newInventory);
        setInventoryItems(Array.from(newInventory.getSeeds()));
      }
    };
    getPlayerInventory();
  }, [])

  // remove seeds
  useEffect(() => {
    if (seedToRemove && playerInventory) {
      playerInventory.removeSeed(seedToRemove);
      setInventoryItems(Array.from(playerInventory.getSeeds()));
      updateFirebaseInventory(playerInventory); //push changes to firebase
    }
  }, [seedToRemove]);

  // add seeds
  useEffect(() => {
      if (seedToAdd && playerInventory) {
        playerInventory.addSeed(seedToAdd);
        setInventoryItems(Array.from(playerInventory.getSeeds()));
        updateFirebaseInventory(playerInventory); //push changes to firebase
      }
    }, [seedToAdd])

  const handlePress = (item: Seed, index: number) => {
    if(item){
      onItemSelected(item);
      return item;
    }
  }

  // Always maintain at least one row
  const rows = [];
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
                  item && selectedId === item.getType() && styles.selectedItem,
                  !item && styles.emptyItem
                ]}
                onPress={() => item && handlePress(item)}
                disabled={!item}
              >
                {item && (
                  <Text style={styles.inventoryText}>
                    {item.getType()}
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