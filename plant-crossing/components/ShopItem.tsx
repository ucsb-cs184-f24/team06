import { TouchableOpacity, Image, Text, StyleSheet, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

interface ShopItemProps {
  name: string;
  price: string;
  image: string;
  width: number;
  onPress: () => void;
}

const ShopItem = ({ name, price, image, width, onPress }: ShopItemProps) => {
  return (
    <View style={[styles.itemWrapper, { width }]}>
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <Image
          source={{ uri: image }}
          style={[styles.itemImage, { width: width - 20, height: width - 20 }]}
        />
        <Text style={[styles.itemName, globalStyles.text]}>{name}</Text>
        <Text style={[styles.itemPrice, globalStyles.text]}>{price} coins</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ShopItem;

const styles = StyleSheet.create({
  itemWrapper: {
    padding: "1%",
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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