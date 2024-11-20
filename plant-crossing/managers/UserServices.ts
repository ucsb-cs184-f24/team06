import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { startingSeeds } from '../types/Seed';

export const initializeUser = async () => {
  const user = FIREBASE_AUTH.currentUser;

  if (!user) {
    console.error('No user is logged in');
    return;
  }

  const userRef = doc(FIRESTORE_DB, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    const batch = writeBatch(FIRESTORE_DB);

    batch.set(userRef, {
      email: user.email,
      coins: 100,
      createdAt: Date.now(),
      lastLogin: Date.now()
    });

    const seedsCollectionRef = collection(userRef, 'seeds');
    
    startingSeeds.forEach((seed) => {
      const newSeedRef = doc(seedsCollectionRef);
      batch.set(newSeedRef, {
        ...seed.toFirestore(),
        id: newSeedRef.id
      });
    });
    
    try {
      await batch.commit();
      console.log('User initialized with starting seeds');
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  } else {
    console.log('User already exists in Firestore');
  }
};