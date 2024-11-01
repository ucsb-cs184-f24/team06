import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import MainScreens from "./screens/MainScreens";
import ShopScreen from "./screens/ShopScreen";
import FreeSeed from "./screens/FreeSeed";
import HomeScreen from "./screens/HomeScreen";

const Stack = createStackNavigator();

export default function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true);

  const handleAnimationComplete = () => {
    setShowHomeScreen(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainScreens" component={MainScreens} options={{ headerLeft: () => null }} />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen name="FreeSeed" component={FreeSeed} options={{ title: "Get a Free Seed!" }} />
      </Stack.Navigator>

      {showHomeScreen && <HomeScreen onAnimationComplete={handleAnimationComplete} />}
    </NavigationContainer>
  );
}