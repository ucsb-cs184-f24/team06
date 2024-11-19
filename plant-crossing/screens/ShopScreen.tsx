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
} from "react-native";
import ShopItem from "../components/ShopItem";
import Shop from "../data-structures/Shop";
import FreeSeed from "./FreeSeed";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { GameButton } from "../components/GameButton";

interface ShopItemData {
  id: string;
  name: string;
  price: string;
  image: string;
}

export default function ShopScreen() {
  const [shopItems, setShopItems] = useState<ShopItemData[]>([]);
  const [numColumns] = useState(3);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItemData | null>(null);
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const itemWidth = (windowWidth - (styles.flatListContent.padding * 2) - (styles.flatListContent.gap * 2)) / 3;

  useEffect(() => {
    const shop = new Shop();
    const items = shop.getItems().map((item, index) => ({
      id: `${index}`,
      name: item.getName(),
      price: Math.round(item.getPrice()).toString(),
      image:
        "https://cdn.pixabay.com/photo/2022/11/08/14/42/monstera-7578722_640.png",
    }));
    setShopItems(items);
  }, []);

  const handleItemPress = (item: ShopItemData) => {
    console.log("Item pressed:", item);
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleBuy = () => {
    Alert.alert("Success", `Successfully purchased ${selectedItem?.name}!`);
    setModalVisible(false);
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
              <Text style={[styles.modalTitle, globalStyles.text]}>{selectedItem?.name}</Text>
              <Text style={[styles.modalPrice, globalStyles.text]}>{selectedItem?.price} coins</Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buyButton]}
                onPress={handleBuy}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Buy Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={[styles.buttonText, globalStyles.text]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginHorizontal: 10
  }
});