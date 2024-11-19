import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../FirebaseConfig';

const db = getFirestore();

export const initializeUser = async () => {
  const user = FIREBASE_AUTH.currentUser;

  if (user) {
    const userRef = doc(db, 'users', user.uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        email: user.email,
        coins: 100, 
        seeds: {},
        plants: {}, 
        friends: {},
      });
      console.log('User document created successfully');
    } else {
      console.log('User already exists in Firestore');
    }
  } else {
    console.error('No user is logged in');
  }
};