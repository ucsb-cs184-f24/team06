import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Dimensions, Platform } from "react-native";
import ShopItemComponent from "../components/ShopItem"; // Assuming you have a component for rendering each item
import Shop from "../data-structures/Shop"; // Import the Shop class

// define a type for shop items
interface ShopItemData {
  id: string;
  name: string;
  price: string;
  image: string;
}

export default function ShopScreen() {
  const [shopItems, setShopItems] = useState<ShopItemData[]>([]); // state to store shop items
  const [numColumns] = useState(1); // Number of columns is set to 1
  const windowWidth = Dimensions.get("window").width; // Get the device width

  useEffect(() => {
    // create an instance of the Shop class
    const shop = new Shop();

    // fetch items from the shop and update state
    const items = shop.getItems().map((item, index) => ({
      id: `${index}`, // convert index to a string id
      name: item.getName(),
      price: Math.round(item.getPrice()).toString(), // convert the actual price to a whole number string
      image:
        "https://cdn.pixabay.com/photo/2022/11/08/14/42/monstera-7578722_640.png", // placeholder image
    }));

    console.log(items); // log the items to check their values
    setShopItems(items); // update state with fetched items
  }, []); // empty dependency array means this runs once when component mounts

  const renderItem = ({ item }: { item: ShopItemData }) => (
    <ShopItemComponent item={item} width={windowWidth} /> // Pass the width to the ShopItemComponent
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shopItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns} // use one column per width
        key={`shop-list-${numColumns}`} // unique key for the FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent} // additional padding for safe area
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 40 : 20, // Add extra padding for iOS notch safety
  },
  flatListContent: {
    paddingBottom: 20, // buffer at the bottom
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "fff",
  },
});
