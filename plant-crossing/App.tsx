import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainScreens from './screens/MainScreens';
import HomeScreen from './screens/HomeScreen';

export default function App() {
  const [showHomeScreen, setShowHomeScreen] = useState(true);

  const handleAnimationComplete = () => {
    setShowHomeScreen(false);
  };

  return (
    <NavigationContainer>
      <MainScreens />
      {showHomeScreen && <HomeScreen onAnimationComplete={handleAnimationComplete} />}
    </NavigationContainer>
  );
}