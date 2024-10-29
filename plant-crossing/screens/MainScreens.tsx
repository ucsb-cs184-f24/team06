import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GardenScreen from './GardenScreen';
import ShopScreen from './ShopScreen';
import FriendsScreen from './FriendsScreen';
import GardenIcon from '../assets/plant-icon.png';
import ShopIcon from '../assets/shop-icon.png';
import FriendsIcon from '../assets/friends-icon.png';


const Tab = createBottomTabNavigator();

const MainScreens = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, size }) => {
          let iconSource;
          const iconScale = focused ? 1.6 : 1.2;
          if (route.name === 'Garden') {
            iconSource = GardenIcon;
          } else if (route.name === 'Shop') {
            iconSource = focused ? ShopIcon : ShopIcon;
          } else if (route.name === 'Friends') {
            iconSource = focused ? FriendsIcon : FriendsIcon;
          }
          return (
            <Image
              source={iconSource}
              style={{ width: size*iconScale, height: size*iconScale }}
              resizeMode="contain"
            />
          );
        },
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          height: 60,
          paddingBottom: 8,
        },
      })}
    >
      <Tab.Screen name="Garden" component={GardenScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
    </Tab.Navigator>
  );
};

export default MainScreens;