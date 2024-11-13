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
import { useNavigation } from "@react-navigation/native";

interface ShopItemData {
  id: string;
  name: string;
  price: string;
  image: string;
}

export default function ShopScreen() {
  const [shopItems, setShopItems] = useState<ShopItemData[]>([]);
  const [numColumns] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShopItemData | null>(null);
  const windowWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  useEffect(() => {
    const shop = new Shop();
    const items = shop.getItems().map((item, index) => ({
      id: `${index}`,
      name: item.getName(),
      price: Math.round(item.getPrice()).toString(),
      image: "https://cdn.pixabay.com/photo/2022/11/08/14/42/monstera-7578722_640.png",
    }));
    setShopItems(items);
  }, []);

  const handleItemPress = (item: ShopItemData) => {
    console.log('Item pressed:', item); // Add this for debugging
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleBuy = () => {
    Alert.alert('Success', `Successfully purchased ${selectedItem?.name}!`);
    setModalVisible(false);
  };

  const renderItem = ({ item }: { item: ShopItemData }) => (
    <ShopItem
      name={item.name}
      price={item.price}
      image={item.image}
      width={windowWidth}
      onPress={() => handleItemPress(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <Button
        title="Get a Free Seed!"
        onPress={() => navigation.navigate("FreeSeed")}
      />
      <FlatList
        data={shopItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={`shop-list-${numColumns}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
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
              <Text style={styles.modalTitle}>
                {selectedItem?.name}
              </Text>
              <Text style={styles.modalPrice}>
                {selectedItem?.price} coins
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buyButton]}
                onPress={handleBuy}
              >
                <Text style={styles.buttonText}>Buy Now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
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
    paddingBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '85%',
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalPrice: {
    fontSize: 20,
    color: '#666',
    marginBottom: 5,
  },
  modalButtons: {
    flexDirection: 'column',
    width: '100%',
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
  },
  buyButton: {
    backgroundColor: '#34C759', // iOS green color
  },
  cancelButton: {
    backgroundColor: '#FF3B30', // iOS red color
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}=]]