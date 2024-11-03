import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Audio } from "expo-av";
import MainScreens from "./screens/MainScreens";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import "react-native-gesture-handler";

const Stack = createStackNavigator();

export default function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true);

  const handleAnimationComplete = () => {
    setShowHomeScreen(false);
  };

  useEffect(() => {
    let sound;

    // function to load and play background music
    async function playBackgroundMusic() {
      const { sound: playbackSound } = await Audio.Sound.createAsync(
        require("./music/background-music.mp3"),
        { shouldPlay: true, isLooping: true } // set to loop
      );
      sound = playbackSound;
      await sound.playAsync();
    }

    playBackgroundMusic(); // call the function on app start

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="MainScreens"
          component={MainScreens}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
      {showHomeScreen && (
        <HomeScreen onAnimationComplete={handleAnimationComplete} />
      )}
    </NavigationContainer>
  );
}
