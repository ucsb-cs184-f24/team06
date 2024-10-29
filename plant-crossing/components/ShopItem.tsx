import { TouchableOpacity, Image, Text, StyleSheet, View } from "react-native";

const ShopItem = ({ item, width }: { item: any; width: number }) => {
  return (
    <View style={[styles.itemWrapper, { width }]}>
      <TouchableOpacity style={styles.itemContainer}>
        <Image
          source={{ uri: item.image }}
          style={[styles.itemImage, { width: width - 20, height: width - 20 }]}
        />
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>{item.price} coins</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShopItem;

const styles = StyleSheet.create({
  itemWrapper: {
    padding: "1%", // Removed the hardcoded width
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    elevation: 5,
  },
  itemImage: {
    borderRadius: 8,
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
});
