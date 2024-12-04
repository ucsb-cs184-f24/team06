import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Platform,
  Modal,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Button,
  ImageBackground
} from "react-native";
import ShopItem from "../components/ShopItem";
import Shop from "../data-structures/Shop";
import FreeSeed from "./FreeSeed";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { GameButton } from "../components/GameButton";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { SeedService } from "../managers/SeedService";

interface ShopItemData {
  id: string;
  name: string;
  price: string;
  item: any;
  image: string;
}

// Utility function to format seed names
const formatSeedName = (seedName: string): string => {
  const formattedName = seedName
    .split("_") // Split words by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(" "); // Join the words with a space

  return `${formattedName} Seed`; // Add "Seed" at the end
};

export default function ShopScreen() {
  const [shopItems, setShopItems] = useState<ShopItemData[]>([]);
  const [numColumns] = useState(3);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItemData | null>(null);
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const itemWidth =
    (windowWidth -
      styles.flatListContent.padding * 2 -
      styles.flatListContent.gap * 2) /
    3;

  useEffect(() => {
    const shop = new Shop();
    const items = shop.getItems().map((item, index) => ({
      id: `${index}`,
      name: formatSeedName(item.getName()), // Apply formatting here
      price: Math.round(item.getPrice()).toString(),
      item: item,
      image:
        item.getSeed().rarity.toString(),
    }));
    setShopItems(items);
  }, []);

  const handleItemPress = (item: ShopItemData) => {
    console.log("Item pressed:", item);
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleBuy = async () => {
    const db = FIRESTORE_DB;
    try {
      const user = FIREBASE_AUTH.currentUser;

      if (!user) {
        Alert.alert("Error", "Please log in to make a purchase.");
        return;
      }

      if (!selectedItem) {
        Alert.alert("Error", "No item selected.");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        Alert.alert("Error", "User data not found.");
        return;
      }

      const currentCoins = userDoc.data().coins || 0;
      const itemPrice = Number(selectedItem.price);

      if (currentCoins < itemPrice) {
        Alert.alert(
          "Insufficient Coins",
          `You need ${
            itemPrice - currentCoins
          } more coins to purchase this item.`
        );
        return;
      }

      await updateDoc(userDocRef, {
        coins: currentCoins - itemPrice,
      });

      await SeedService.addSeed(selectedItem.item.getSeed());

      Alert.alert("Success", `Successfully purchased ${selectedItem.name}!`);
      setModalVisible(false);
    } catch (error) {
      console.error("Purchase error:", error);
      Alert.alert(
        "Error",
        "There was an error processing your purchase. Please try again."
      );
    }
  };

  const renderItem = ({ item }: { item: ShopItemData }) => (
    <ShopItem
      name={item.name}
      price={item.price}
      image={item.image}
      width={itemWidth}
      onPress={() => handleItemPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
      source={require("../assets/wood_texture.jpg")} // Path to your local image
      style={styles.backgroundImage}>
        <StatusBar style="dark" />
        <GameButton
          title="Get a Free Seed!"
          onPress={() => navigation.navigate("FreeSeed")}
          style={styles.buttonStyle}
        />
        <FlatList
          data={shopItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={`shop-list-${numColumns}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          columnWrapperStyle={styles.row}
        />

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, globalStyles.text]}>
                  {selectedItem?.name}
                </Text>
                <Text style={[styles.modalPrice, globalStyles.text]}>
                  {selectedItem?.price} coins
                </Text>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.buyButton]}
                  onPress={handleBuy}
                >
                  <Text style={[styles.buttonText, globalStyles.text]}>
                    Buy Now
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.buttonText, globalStyles.text]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  flatListContent: {
    padding: 12,
    gap: 12,
  },
  row: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "85%",
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalPrice: {
    fontSize: 20,
    color: "#666",
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: "column",
    width: "100%",
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
  },
  buyButton: {
    backgroundColor: "#34C759",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonStyle: {
    padding: 10,
    marginHorizontal: 10,
  },
});
