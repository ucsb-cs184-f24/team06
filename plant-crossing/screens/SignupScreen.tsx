import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import MainScreens from "./MainScreens"
import { initializeUser } from '../managers/UserServices';
import { globalStyles } from '../styles/globalStyles';
import { GameButton } from '../components/GameButton';

const SignupScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();

  const handleSignup = async () => {
    setLoading(true);
    try {
        const user = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
        console.log(user);
        await initializeUser();
        navigation.navigate('MainScreens');
    } catch (error) {
        alert('Signup failed: ' + error);
        console.log(error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, globalStyles.text]}>Sign Up</Text>

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
      <TextInput
        style={[styles.input, globalStyles.text]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <GameButton 
        title="Sign Up" 
        onPress={handleSignup}
        style={{ backgroundColor: 'green' }} // Optional custom styles
        textStyle={{ fontSize: 16 }} // Optional custom text styles
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.link, globalStyles.text]}>Already have an account? Login</Text>
      </TouchableOpacity>
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

export default SignupScreen;
