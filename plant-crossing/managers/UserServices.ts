import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { createUserSeedInventory, createUserPlots } from '../utils/initializeUserFields'

const db = getFirestore();

export const initializeUser = async () => {
  const user = FIREBASE_AUTH.currentUser;

  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      const userSeeds = createUserSeedInventory();
      await setDoc(userRef, {
        email: user.email,
        coins: 100, 
        inventory: userSeeds, // seeds in inventory
        friends: {},
        plots: {} 
      });
      console.log('User document created successfully');
    } else {
      console.log('User already exists in Firestore');
    }
  } else {
    console.error('No user is logged in');
  }
};