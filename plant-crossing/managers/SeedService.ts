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
      const seedsCollectionRef = this.getSeedsCollectionRef();
      const newSeedRef = doc(seedsCollectionRef);

      const newSeed = new Seed(
        seed.type,
        seed.rarity,
        seed.growthTime,
        seed.maxWater,
      );
  
      await setDoc(newSeedRef, newSeed.toFirestore());
      console.log("add seed:", newSeedRef);
      return newSeed;
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
        const seed = await this.getSeedById(seedId);
        if (!seed) throw new Error('Seed not found');

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

        await this.deleteSeed(seedId);

        await setDoc(newPlantRef, newPlant.toFirestore());

        return newPlant;
    }
  
    static async deleteSeed(seedId: string) {
      const seedRef = doc(this.getSeedsCollectionRef(), seedId);
      await deleteDoc(seedRef);
    }
}