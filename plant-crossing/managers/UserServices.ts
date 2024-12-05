import { collection, doc, getDoc, getDocs, writeBatch, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { startingSeeds } from '../types/Seed';
import { PlantService } from '../managers/PlantService';
import { PlotService } from '../managers/PlotService';

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
      lastLogin: Date.now(),
      pendingTrades: {}
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
    console.log('Existing user branch executed');
    try {
      const lastLogin = userSnapshot.data()?.lastLogin || Date.now();
      const timeSinceLastLogin = Date.now() - lastLogin;

      console.log(`Time since last login: ${timeSinceLastLogin} ms`);

      const plotsCollectionRef = collection(userRef, 'plots');
      const plotsSnapshot = await getDocs(plotsCollectionRef);
      
      if (plotsSnapshot.empty) {
        console.log('No plots found.');
        return;
      }
      
      // Iterate through all plots to find planted plants
      const produceCoinsPromises = [];
      plotsSnapshot.forEach((plotDoc) => {
        const plotData = plotDoc.data();
        if (plotData.plant && plotData.plant.id) {
          const plantId = plotData.plant.id;
          console.log(`Calling produceCoins for planted plant ID: ${plantId}`);
          produceCoinsPromises.push(PlantService.produceCoins(plantId, timeSinceLastLogin));
        } else {
          console.warn(`Invalid or missing plant data in plot: ${plotDoc.id}`);
        }
      });
      
      await Promise.all(produceCoinsPromises);
      
      // Update user's last login
      await updateDoc(userRef, { lastLogin: Date.now() });
      console.log('Coins produced for planted plants and user last login updated');
      
    } catch (error) {
      console.error('Error processing plants on user relog:', error);
    }
  }
};