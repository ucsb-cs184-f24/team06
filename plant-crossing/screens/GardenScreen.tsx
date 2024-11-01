// GardenScreen.jsx

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Text, // Added import for Text
} from "react-native";
import { GardenGrid } from "../data-structures/GardenPlots";
import { Plant, Rarity } from "../data-structures/Plant"; // Adjust the path as necessary

type InvItemProps = {
  item: InvItemData;
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

type InvItemData = {
  id: string;
  title: string;
};

const DATA: InvItemData[] = [
  {
    id: "1",
    title: "Sunflower Seed",
  },
  {
    id: "2",
    title: "Rose Seed",
  },
  {
    id: "3",
    title: "Tulip Seed",
  },
];

const InvItem = ({
  item,
  onPress,
  backgroundColor,
  textColor,
}: InvItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.invItem, { backgroundColor }]}
  >
    <Text style={[styles.invText, { color: textColor }]}>{item.title}</Text>
  </TouchableOpacity>
);

export default function GardenScreen() {
  const [selectedId, setSelectedId] = useState<string>();
  const [modalVisible, setModalVisible] = useState(false);
  const [nickname, setNickname] = useState("");
  const [plants, setPlants] = useState<Plant[]>([]);

  const handleSelectSeed = (item: InvItemData) => {
    setSelectedId(item.id);
    setModalVisible(true); // Show the modal to enter the plant name
  };

  const handlePlantSeed = () => {
    // Find the selected seed type
    const seed = DATA.find((item) => item.id === selectedId);
    if (seed) {
      // Create a new Plant instance
      const newPlant = new Plant(
        seed.title.replace(" Seed", ""), // Type of the plant
        nickname, // Nickname entered by the player
        Rarity.common // You can adjust the rarity as needed
      );

      // Add the new plant to the plants array
      setPlants([...plants, newPlant]);

      // Reset state
      setNickname("");
      setSelectedId(undefined);
      setModalVisible(false);
    }
  };

  const renderItem = ({ item }: { item: InvItemData }) => {
    const backgroundColor = item.id === selectedId ? "#8ba286" : "#d1dbcd";
    const color = item.id === selectedId ? "white" : "black";

    return (
      <InvItem
        item={item}
        onPress={() => handleSelectSeed(item)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View style={styles.container}>
      <GardenGrid plants={plants} />
      <FlatList
        style={styles.inventorySection}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        horizontal={true}
      />

      {/* Modal for entering plant nickname */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedId(undefined);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Name Your Plant (Optional):
            </Text>
            <TextInput
              placeholder="Plant Name"
              value={nickname}
              onChangeText={setNickname}
              style={styles.textInput}
            />
            <Button title="Plant Seed" onPress={handlePlantSeed} />
            <Button
              title="Cancel"
              onPress={() => {
                setModalVisible(false);
                setSelectedId(undefined);
              }}
              color="gray"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inventorySection: {
    backgroundColor: "#ededed",
  },
  invItem: {
    backgroundColor: "#d1dbcd",
    padding: 20,
    width: 150,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  invText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
