import { collection, doc, getDoc, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { startingSeeds } from '../types/Seed';
import { PlantService } from '../managers/PlantService'; // Ensure you have this service imported

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
      friends: {},
      createdAt: Date.now(),
      lastLogin: Date.now()
    });

    const seedsCollectionRef = collection(userRef, 'seeds');
    const plantsCollectionRef = collection(userRef, 'plants');
    const plotsCollectionRef = collection(userRef, 'plots');

    startingSeeds.forEach((seed) => {
      const newSeedRef = doc(seedsCollectionRef);
      batch.set(newSeedRef, {
        ...seed.toFirestore(),
        id: newSeedRef.id
      });
    });

    const dummyPlantRef = doc(plantsCollectionRef, 'placeholder');
    batch.set(dummyPlantRef, {
        id: 'placeholder',
        nickname: 'Placeholder Plant',
        type: 'placeholder',
        rarity: 'common',
        growthTime: 1,
        maxWater: 1,
        location: -1,
        age: 0,
        currWater: 1,
        growthBoost: 1
    });

    for (let i = 0; i < 16; i++) {
      const plotRef = doc(plotsCollectionRef);
      batch.set(plotRef, {
        unlocked: i < 12,
        plant: null,
        location: i,
      });
    }
    
    try {
      await batch.commit();
      console.log('User initialized with starting seeds');
    } catch (error) {
      console.error('Error initializing user:', error);
    }
  } else {
    // Existing user: Update plants
    try {
      const lastLogin = userSnapshot.data()?.lastLogin || Date.now();

      const plantsCollectionRef = collection(userRef, 'plants');
      const plantsSnapshot = await getDocs(plantsCollectionRef);

      // Update each plant's growth progress
      const updatePromises = plantsSnapshot.docs.map(async (plantDoc) => {
        const plantId = plantDoc.id;
        await PlantService.updateGrowthProgress(plantId, lastLogin);
      });

      await Promise.all(updatePromises);

      // Update user's last login
      await updateDoc(userRef, { lastLogin: Date.now() });
      console.log('Updated plant growth and user last login');
    } catch (error) {
      console.error('Error updating plant growth on user relog:', error);
    }
  }
};
