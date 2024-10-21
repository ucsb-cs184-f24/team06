import { View, Text, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
  const [username, setUsername] = useState<string | null>(null);

  // Fetch the currently logged-in user when the component mounts
  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      // Use email if displayName is not set
      setUsername(user.displayName || user.email);
    }
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {/* Display the username if available */}
      {username && <Text style={{ fontSize: 18, marginBottom: 20 }}>Logged in as: {username}</Text>}
      <Button onPress={() => navigation.navigate('details')} title="Open Details" />
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    </View>
  );
};

export default List;
