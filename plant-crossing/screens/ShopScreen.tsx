import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopItem from '../components/ShopItem';
const Tab = createBottomTabNavigator();

const shopItems = [
  {
    id: '1',
    name: 'Product 1',
    price: '29.99',
    image: 'https://cdn.pixabay.com/photo/2022/11/08/14/42/monstera-7578722_640.png',
  },
  {
    id: '2',
    name: 'Product 2',
    price: '39.99',
    image: 'https://cdn.pixabay.com/photo/2022/11/08/14/42/monstera-7578722_640.png',
  },
  {
    id: '3',
    name: 'Product 3',
    price: '99.99',
    image: 'https://cdn.pixabay.com/photo/2022/11/08/14/42/monstera-7578722_640.png',
  },
  {
    id: '4',
    name: 'Product 4',
    price: '19.99',
    image: 'https://cdn.pixabay.com/photo/2022/11/08/14/42/monstera-7578722_640.png',
  },
  {
    id: '5',
    name: 'Product 5',
    price: '69.99',
    image: 'https://cdn.pixabay.com/photo/2022/11/08/14/42/monstera-7578722_640.png',
  },
];

export default function ShopScreen() {
  const renderItem = ({ item }: { item: any }) => (
    <ShopItem item={item}/>
  );
  return (
    <>
    <View style={styles.container}>
      <FlatList
        data={shopItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
      />
      <StatusBar style="auto" />
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center'
  },
  input: {
      marginVertical: 4,
      height: 50,
      borderWidth: 1,
      borderRadius: 4,
      padding: 10,
      backgroundColor: 'fff'
  },
});