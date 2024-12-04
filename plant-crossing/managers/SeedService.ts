import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc,
    query,
    writeBatch,
    where
} from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
import { Seed, Rarity } from '../types/Seed';
import { Plant } from '../types/Plant';
  
export class SeedService {
    private static getUserRef() {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (!currentUser) throw new Error('No user logged in');
      return doc(FIRESTORE_DB, 'users', currentUser.uid);
    }
  
    private static getSeedsCollectionRef() {
      return collection(this.getUserRef(), 'seeds');
    }

    private static getPlantsCollectionRef() {
      return collection(this.getUserRef(), 'plants');
    }
  
    static async addSeed(seed: Seed) {
      const inventorySeedID = await this.getSeedIdByDescription(seed.type, seed.rarity);
      if (!inventorySeedID) {
          const seedsCollectionRef = this.getSeedsCollectionRef();
          const newSeedRef = doc(seedsCollectionRef); // Generates a new Firestore document with an ID
  
          const newSeed = new Seed(
              seed.type,
              seed.rarity,
              seed.growthTime,
              seed.maxWater,
              seed.spriteNumber,
              seed.numSeeds
          );
  
          // Explicitly assign the generated Firestore ID to the seed
          newSeed.id = newSeedRef.id;
  
          console.log(`Adding new seed with ID: ${newSeed.id}`);
          await setDoc(newSeedRef, newSeed.toFirestore());
          return newSeed;
      } else {
          const inventorySeed = await this.getSeedById(inventorySeedID);
          if (inventorySeed?.numSeeds) {
              const newNumSeeds = inventorySeed.numSeeds + 1;
              await this.updateSeed(inventorySeedID, { numSeeds: newNumSeeds }); // Increase number of seeds
          } else {
              await this.updateSeed(inventorySeedID, { numSeeds: 2 }); // Fallback for seeds without `numSeeds`
          }
          return inventorySeed;
      }
    }
  
  
  
    static async addMultipleSeeds(seeds: Seed[]) {
      const batch = writeBatch(FIRESTORE_DB);
      const seedsCollectionRef = this.getSeedsCollectionRef();
  
      const addedSeeds = seeds.map(seed => {
        const newSeedRef = doc(seedsCollectionRef);
        const newSeed = new Seed(
          seed.type,
          seed.rarity,
          seed.growthTime,
          seed.maxWater,
          seed.spriteNumber,
          seed.numSeeds
        );
        
        batch.set(newSeedRef, newSeed.toFirestore());
        return newSeed;
      });
  
      await batch.commit();
      return addedSeeds;
    }
  
    static async getUserSeeds(): Promise<Seed[]> {
      const seedsCollectionRef = this.getSeedsCollectionRef();
      const q = query(seedsCollectionRef);
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => {
        const data = { ...doc.data(), id: doc.id };
        return Seed.fromFirestore(data);
      });
    }
  
    static async getSeedById(seedId: string): Promise<Seed | null> {
      const seedRef = doc(this.getSeedsCollectionRef(), seedId);
      const seedSnap = await getDoc(seedRef);
      
      if (!seedSnap.exists()) return null;
      
      const data = seedSnap.data();
      return Seed.fromFirestore(data);
    }

    static async getSeedIdByDescription(seedType: string, rarity: Rarity): Promise<string | null> {
        const seedsCollectionRef = this.getSeedsCollectionRef();
        const q = query(seedsCollectionRef, where('type', '==', seedType), where('rarity', '==', rarity));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) return null;
        if (querySnapshot.size > 1) {
            console.warn(`Multiple seeds found for type (${seedType}) and rarity (${rarity})`);
        }

        const seedDoc = querySnapshot.docs[0];
        return seedDoc.id;
    }
  
    static async updateSeed(seedId: string, updates: Partial<Seed>) {
      const seedRef = doc(this.getSeedsCollectionRef(), seedId);
      
      const updateData = {
        ...updates,
        lastUpdated: Date.now()
      };
  
      await updateDoc(seedRef, updateData);
    }

  
    static async plantSeed(seedId: string, location: number) {
      console.log(`plantSeed called with seedId: ${seedId} and location: ${location}`);
      const seed = await this.getSeedById(seedId);
      if (!seed) {
          console.error('Seed not found');
          throw new Error('Seed not found');
      }
  
      const plantCollectionRef = this.getPlantsCollectionRef();
      const newPlantRef = doc(plantCollectionRef);
  
      const newPlant = new Plant(
          seed.type,
          seed.rarity,
          seed.growthTime,
          seed.maxWater,
          `${seed.type.replace(' Seed', '')}`,
          location,
          0,
          seed.maxWater,
          1,
      );
      newPlant.id = newPlantRef.id; // Assign the Firestore document ID to the Plant
      newPlant.createdAt = Date.now(); // Ensure createdAt is set here
  
      console.log('New plant created:', newPlant);
  
      await this.deleteSeed(seedId);
      await setDoc(newPlantRef, newPlant.toFirestore());
      
      console.log(`Plant saved to Firestore with ID: ${newPlant.id}`);
      return newPlant;
    }
  
  

    static async tradeSeed(userSeed: string, friendSeed: string, friendEmail: string) {
      try {
        // Get user seed
        const userSeedsCollectionRef = this.getSeedsCollectionRef();
        const q = query(userSeedsCollectionRef, where('type', '==', userSeed));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          console.error('userSeed not found');
          throw new Error('User seed not found');
        }
        const userSeedDoc = querySnapshot.docs[0];
        const userSeedId = userSeedDoc.id;
    
        // Get friend's ID
        const friendQuery = query(
          collection(FIRESTORE_DB, "users"),
          where("email", "==", friendEmail)
        );
        const friendSnapshot = await getDocs(friendQuery);
        if (friendSnapshot.empty) {
          console.error('Friend not found');
          throw new Error('Friend not found');
        }
        const friendId = friendSnapshot.docs[0].id;
    
        // Get friend seed
        const friendSeedsCollectionRef = collection(doc(FIRESTORE_DB, 'users', friendId), 'seeds');
        const friendSeedQ = query(friendSeedsCollectionRef, where('type', '==', friendSeed));
        const friendSeedQuerySnapshot = await getDocs(friendSeedQ);
        
        if (friendSeedQuerySnapshot.empty) {
          console.error('Friend seed not found');
          throw new Error('Friend seed not found');
        }
        const friendSeedDoc = friendSeedQuerySnapshot.docs[0];
        const friendSeedId = friendSeedDoc.id;
        
        const batch = writeBatch(FIRESTORE_DB);
    
        // Add user's seed to friend's collection
        const friendSeedRef = doc(friendSeedsCollectionRef);
        const friendNewSeed = Seed.fromFirestore(userSeedDoc.data());
        friendNewSeed.numSeeds = 1;
        const findFriendSeedQ = query(friendSeedsCollectionRef, where('type', '==', userSeed));
        const findFriendSeedSnapshot = await getDocs(findFriendSeedQ);
        if (findFriendSeedSnapshot.empty) {
          batch.set(friendSeedRef, friendNewSeed.toFirestore());
        }
        else {
          const findFriendSeedDoc = findFriendSeedSnapshot.docs[0];
          const findFriendSeedId = findFriendSeedDoc.id;
          batch.update(doc(friendSeedsCollectionRef, findFriendSeedId), { numSeeds: 1 + findFriendSeedDoc.data().numSeeds });
        }
    
        // Add friend's seed to user's collection
        const userSeedRef = doc(userSeedsCollectionRef);
        const userNewSeed = Seed.fromFirestore(friendSeedDoc.data());
        userNewSeed.numSeeds = 1;
        const findUserSeedQ = query(userSeedsCollectionRef, where('type', '==', friendSeed));
        const findUserSeedSnapshot = await getDocs(findUserSeedQ);
        if (findUserSeedSnapshot.empty) {
          batch.set(userSeedRef, userNewSeed.toFirestore());
        }
        else {
          const findUserSeedDoc = findUserSeedSnapshot.docs[0];
          const findUserSeedId = findUserSeedDoc.id;
          batch.update(doc(userSeedsCollectionRef, findUserSeedId), { numSeeds: 1 + findUserSeedDoc.data().numSeeds });
        }

        if (friendSeedDoc.data().numSeeds > 1) {
          batch.update(doc(friendSeedsCollectionRef, friendSeedId), { numSeeds: friendSeedDoc.data().numSeeds - 1 });
        }
        else {
          batch.delete(doc(friendSeedsCollectionRef, friendSeedId));
        }
    
        // Commit the batch
        await batch.commit();
        await this.deleteSeed(userSeedId);
        console.log('Seed trade completed successfully');
      } catch (error) {
        console.error('Error trading seeds:', error);
        throw error;
      }
    }
  
    static async deleteSeed(seedId: string) {
      const seed = await this.getSeedById(seedId);
      if(seed && seed.numSeeds > 1){
        const newNumSeeds = seed.numSeeds - 1;
        this.updateSeed(seedId, { numSeeds: newNumSeeds}); // decrease number of seeds by 1
      } else {
        console.log()
        const seedRef = doc(this.getSeedsCollectionRef(), seedId);
        await deleteDoc(seedRef);
      }
    }
}