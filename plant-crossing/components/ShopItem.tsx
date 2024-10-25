import { TouchableOpacity, Image, Text, StyleSheet, View } from "react-native";

const ShopItem = ({ item }: { item: any }) => {
    return (
        <View style={styles.itemWrapper}>
            <TouchableOpacity style={styles.itemContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                />
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
            </TouchableOpacity>
        </View>

    );
};

export default ShopItem;

const styles = StyleSheet.create({
    itemWrapper: {
        width: '33%',
        padding: '1%'
    },
    itemContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginVertical: 8,
        elevation: 5,
    },
    itemImage: {
        width: '100%',
        height: 50,
        borderRadius: 8,
        marginBottom: 8,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemPrice: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
});