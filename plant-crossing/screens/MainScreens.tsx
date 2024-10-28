import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GardenScreen from './GardenScreen';
import ShopScreen from './ShopScreen';
import FriendsScreen from './FriendsScreen';

const Tab = createBottomTabNavigator();

const MainScreens = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Garden" component={GardenScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
    </Tab.Navigator>
  );
};

export default MainScreens;