import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator } from 'react-native';
import MainScreens from "./screens/MainScreens";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ShopScreen from "./screens/ShopScreen";
import FreeSeed from "./screens/FreeSeed";
import { Audio } from "expo-av";
import * as Font from 'expo-font';

const Stack = createStackNavigator();

export default function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [fontLoaded, setFontLoaded] = useState(false);

  const handleAnimationComplete = () => {
    setShowHomeScreen(false);
  };

  useEffect(() => {
    let sound: Audio.Sound;

    async function loadResourcesAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          'PressStart2P': require('./assets/fonts/PressStart2P-Regular.ttf'),
          'LilitaOne': require('./assets/fonts/LilitaOne-Regular.ttf'),
          // Add more fonts as needed
        });
        setFontLoaded(true);

        // Load and play background music
        const { sound: playbackSound } = await Audio.Sound.createAsync(
          require("./music/background-music.mp3"),
          { shouldPlay: true, isLooping: true }
        );
        sound = playbackSound;
        await sound.playAsync();

      } catch (error) {
        console.error('Error loading resources:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadResourcesAsync();

    // Cleanup function
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Show loading screen while resources are loading
  if (isLoading || !fontLoaded) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#ffffff' 
      }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          // Now we can safely use the loaded font
          headerTitleStyle: {
            fontFamily: 'PressStart2P',
            fontSize: 16,
          }
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="MainScreens"
          component={MainScreens}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Shop" component={ShopScreen} />
        <Stack.Screen
          name="FreeSeed"
          component={FreeSeed}
          options={{ 
            title: "Get a Free Seed!",
            headerShown: true,
            headerTitleStyle: {
              fontFamily: 'PressStart2P',
              fontSize: 16,
            }
          }}
        />
      </Stack.Navigator>
      {showHomeScreen && (
        <HomeScreen onAnimationComplete={handleAnimationComplete} />
      )}
    </NavigationContainer>
  );
}