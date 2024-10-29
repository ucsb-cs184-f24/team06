import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreens from './screens/MainScreens';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createStackNavigator();

export default function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true);

  const handleAnimationComplete = () => {
    setShowHomeScreen(false);
  };

  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator> */}
      <MainScreens />
      {showHomeScreen && <HomeScreen onAnimationComplete={handleAnimationComplete} />}
    </NavigationContainer>
  );
}