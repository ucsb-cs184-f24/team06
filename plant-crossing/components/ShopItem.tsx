import { TouchableOpacity, Image, Text, StyleSheet, View } from "react-native";
import { globalStyles } from "../styles/globalStyles";

const imageMap: { [key: string]: any } = {
  common: require('../assets/seed-sprites/seed-common.png'),
  uncommon: require('../assets/seed-sprites/seed-uncommon.png'),
  rare: require('../assets/seed-sprites/seed-rare.png'),
  unique: require('../assets/seed-sprites/seed-unique.png'),
  legendary: require('../assets/seed-sprites/seed-legendary.png'),
};

const rarityColorMap: { [key: string]: string } = {
  common: "#3f3f49", // Gray
  uncommon: "#4d352c", // Brown
  rare: "#529269",  // Green
  unique: "#d4705c",  // Orange
  legendary: "#743864", // Purple
};

interface ShopItemProps {
  name: string;
  price: string;
  image: string;
  width: number;
  onPress: () => void;
}

const ShopItem = ({ name, price, image, width, onPress }: ShopItemProps) => {
  const rarityColor = rarityColorMap[image] || "#000000";
  return (
    <View style={[styles.itemWrapper, { width }]}>
      <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <Image
          source={imageMap[image]}
          style={[styles.itemImage, { width: width - 20, height: width - 20 }]}
        />
        <Text style={[styles.itemName, globalStyles.text, { color: rarityColor }]}>{name}</Text>
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