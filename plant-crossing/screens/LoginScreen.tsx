import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { initializeUser } from '../managers/UserServices';
import { CoinPopup } from '../components/coinPopup'; // Ensure CoinPopup is correctly imported
import { globalStyles } from '../styles/globalStyles';
import { GameButton } from '../components/GameButton';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [coinsProduced, setCoinsProduced] = useState<number>(0); // State to track coins
  const [showPopup, setShowPopup] = useState<boolean>(false); // State to show/hide popup
  const navigation = useNavigation();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const coins = await initializeUser(); // Call initializeUser and get coinsProduced
      navigation.navigate('MainScreens'); // Navigate immediately if no coins were produced
      if (coins > 0) {
        setCoinsProduced(coins);
        setShowPopup(true); // Show popup if coins were produced
      }
    } catch (error) {
      alert('Login failed: ' + error);
    }
    setLoading(false);
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup
    navigation.navigate('MainScreens'); // Navigate after closing popup
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title, globalStyles.text]}>Login</Text>

      <TextInput
        style={[styles.input, globalStyles.text]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, globalStyles.text]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <GameButton 
        title="Login" 
        onPress={handleLogin}
        style={{ backgroundColor: 'green' }} // Optional custom styles
        textStyle={{ fontSize: 16 }} // Optional custom text styles
      />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={[styles.link, globalStyles.textSmall]}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

      {/* Render CoinPopup */}
      {showPopup && (
        <CoinPopup
          visible={showPopup}
          onClose={handleClosePopup}
          coinsProduced={coinsProduced}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 5,
  },
  link: {
    marginTop: 20,
    color: '#007BFF',
    textAlign: 'center',
  },
});

export default LoginScreen;
