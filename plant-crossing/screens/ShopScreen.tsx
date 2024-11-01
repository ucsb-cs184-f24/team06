import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, FlatList, Dimensions, Platform } from "react-native";
import ShopItemComponent from "../components/ShopItem";
import Shop from "../data-structures/Shop";
import { Button } from "react-native";
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

    console.log(items);
    setShopItems(items);
  }, []);

  const renderItem = ({ item }: { item: ShopItemData }) => (
    <ShopItemComponent item={item} width={windowWidth} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={shopItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={`shop-list-${numColumns}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
      <Button title="Get a Free Seed!" onPress={() => navigation.navigate("FreeSeed")} />
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
    paddingTop: Platform.OS === "ios" ? 40 : 20,
  },
  flatListContent: {
    paddingBottom: 20,
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
