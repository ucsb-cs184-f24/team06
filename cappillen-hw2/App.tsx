import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { onAuthStateChanged, User } from 'firebase/auth';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Stack = createNativeStackNavigator();

const MainStack = createNativeStackNavigator();

function MainLayout() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name='Home' component={Home} />
      <MainStack.Screen name='Profile' component={Profile} />
    </MainStack.Navigator>
  )
}
export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='Main' component={MainLayout} options={{headerShown: false}}/>
        ) : (
          <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}