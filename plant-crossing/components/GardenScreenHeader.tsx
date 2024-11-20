import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../FirebaseConfig';

interface UserData {
  email: string;
  coins: number;
}

const Header = () => {
  const [selectedItem, setSelectedItem] = useState<Seed | null | GardenTool>(null);
  const [userData, setUserData] = useState<UserData>({ email: '', coins: 0 });
  const db = getFirestore();

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    
    if (user) {
      setUserData((prevData) => ({ ...prevData, email: user.email || '' }));

      const userDocRef = doc(db, 'users', user.uid);

      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userCoins = docSnapshot.data().coins || 0;
          setUserData((prevData) => ({ ...prevData, coins: userCoins }));
        }
      });

      return unsubscribe;
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.email} numberOfLines={1} ellipsizeMode="tail">
          {userData.email}
        </Text>
        <View style={styles.coinsContainer}>
          <Text style={styles.coins}>{userData.coins}</Text>
          <Text style={styles.coinsLabel}>coins</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  email: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,  
    marginRight: 12, 
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  coins: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffa500',
    marginRight: 4,
  },
  coinsLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default Header;
