// App.tsx
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator, Animated, Image } from 'react-native';
import MainScreens from "./screens/MainScreens";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import ShopScreen from "./screens/ShopScreen";
import FreeSeed from "./screens/FreeSeed";
import { Audio } from "expo-av";
import * as Font from 'expo-font';
import { globalStyles } from "./styles/globalStyles";

const Stack = createStackNavigator();

export default function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let sound: Audio.Sound;

    async function loadResourcesAsync() {
      try {
        // Load fonts
        await Font.loadAsync({
          'PressStart2P': require('./assets/fonts/PressStart2P-Regular.ttf'),
          'LilitaOne': require('./assets/fonts/LilitaOne-Regular.ttf'),
        });
        setFontLoaded(true);

        // Preload the splash image
        await Image.prefetch(Image.resolveAssetSource(require('./assets/pixel-garden.png')).uri);
        setImageLoaded(true);

        // Load and play background music
        const { sound: playbackSound } = await Audio.Sound.createAsync(
          require("./music/background-music.mp3"),
          { shouldPlay: true, isLooping: true }
        );
        sound = playbackSound;
        await sound.playAsync();

        // Set assets as loaded
        setAssetsLoaded(true);

      } catch (error) {
        console.error('Error loading resources:', error);
      }
    }

    loadResourcesAsync();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Don't render anything until image is loaded
  if (!imageLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
      {assetsLoaded && !showSplash && (
        <NavigationContainer>
          <Stack.Navigator 
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
              headerTitleStyle: {
                fontFamily: globalStyles.text.fontFamily,
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
                  fontFamily: globalStyles.text.fontFamily,
                  fontSize: 16,
                }
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      )}
      {showSplash && (
        <HomeScreen 
          onAnimationComplete={() => setShowSplash(false)} 
          startAnimation={assetsLoaded}
        />
      )}
    </View>
  );
}