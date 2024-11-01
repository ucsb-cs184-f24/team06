// GardenGrid.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plot } from "./Plot";
import { Plant, Rarity } from "./Plant";
import { Seed } from "./Seed";

// Define the props for GardenGrid
interface GardenGridProps {
  plants: Plant[];
}

const columns = 4;
const screenWidth = Dimensions.get("window").width;
const plotSize = screenWidth / columns;

// Update the GardenGrid component to accept plants as a prop
export const GardenGrid: React.FC<GardenGridProps> = ({ plants }) => {
  // Since you have a garden with plots, we can assume that each plot may have a plant or be empty
  // We will render the grid based on the plants array

  // Generate the data for FlatList
  const data = Array.from({ length: 16 }, (_, index) => {
    // If there's a plant at this index, use it; otherwise, it's empty
    return plants[index] || null;
  });

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          let content;

          if (item) {
            // If there is a plant, display it
            content = (
              <View style={styles.item}>
                <Text style={styles.title}>
                  {item.getNickname() || item.getType()}
                </Text>
              </View>
            );
          } else {
            // Empty plot
            content = <View style={styles.emptyItem} />;
          }

          return (
            <TouchableOpacity
              onPress={() => console.log(`Pressed plot ${index}`)}
            >
              <View>{content}</View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => `plot-${index}`}
        numColumns={columns}
      />
    </SafeAreaView>
  );
};

export default GardenGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  item: {
    backgroundColor: "#abf333",
    padding: 2,
    height: plotSize,
    width: plotSize,
    marginVertical: 0,
    marginHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyItem: {
    backgroundColor: "#cceeee",
    padding: 2,
    height: plotSize,
    width: plotSize,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
