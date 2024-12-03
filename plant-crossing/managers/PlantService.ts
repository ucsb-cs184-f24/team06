import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";
import { Plant } from "../types/Plant";
import { Rarity, rarityValue } from "../types/Seed";

export class PlantService {
    private static getUserRef() {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (!currentUser) throw new Error('No user logged in');
        return doc(FIRESTORE_DB, 'users', currentUser.uid);
    }
    
    private static getPlantsCollectionRef() {
        return collection(this.getUserRef(), 'plants');
    }

    static async getPlantById(plantId: string): Promise<Plant | null> {
        const plantRef = doc(this.getPlantsCollectionRef(), plantId);
        const plantSnap = await getDoc(plantRef);
        
        if (!plantSnap.exists()) return null;
        
        const data = { ...plantSnap.data(), id: plantSnap.id };
        return Plant.fromFirestore(data);
    }

    static async findPlantByLocation(location: number): Promise<string> {
        try {
            const plantsRef = this.getPlantsCollectionRef();
            const q = query(
                plantsRef,
                where('location', '==', location),
                where('isPlanted', '==', true)
            );
    
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                return '';
            }
            if (querySnapshot.size > 1) {
                console.warn(`Multiple plants found at location (${location})`);
            }
    
            const plantDoc = querySnapshot.docs[0];
            const plantData = plantDoc.data();
    
            return plantDoc.id;
        } catch (error) {
            console.error('Error finding plant by location:', error);
            throw error;
        }
    }

    static async updatePlant(plantId: string, updates: Partial<Plant>) {
        console.log("Updating plant ", plantId);
        const plantRef = doc(this.getPlantsCollectionRef(), plantId);
        
        const updateData = {
          ...updates,
          lastUpdated: Date.now()
        };
    
        await updateDoc(plantRef, updateData);
    }

    static async waterPlant(plantId: string, amount: number) {
        const plant = await this.getPlantById(plantId);
        if (!plant) throw new Error('Plant not found');
    
        const newWaterLevel = Math.min(plant.currWater + amount, plant.maxWater);
        await this.updatePlant(plantId, { currWater: newWaterLevel });

        // recalculate growthLevel if water affects it
        const newGrowthLevel = this.calculateGrowthLevel(plant, newWaterLevel);
        await this.updatePlant(plantId, { growthLevel: newGrowthLevel });

        console.log("Plant", plantId, "watered, waterLevel:", newWaterLevel, "growthLevel:", newGrowthLevel);
        return newWaterLevel;
    }

    static async updateGrowthProgress(plantId: string) {
        const plant = await this.getPlantById(plantId);
        if (!plant) return;
    
        const plantRef = doc(this.getPlantsCollectionRef(), plantId);
        const plantSnap = await getDoc(plantRef);
        const data = plantSnap.data();
        
        const timePassed = Date.now() - data?.lastUpdated;
        const hoursProgress = timePassed / (1000 * 60 * 60);
        const newAge = plant.age + (hoursProgress * plant.growthBoost);
    
        const waterConsumptionRate = 0.1;
        const waterConsumed = hoursProgress * waterConsumptionRate * plant.maxWater;
        const newWaterLevel = Math.max(0, plant.currWater - waterConsumed);

        const newGrowthLevel = this.calculateGrowthLevel(plant, newWaterLevel, newAge);

        await updateDoc(plantRef, {
          age: newAge,
          currWater: newWaterLevel,
          growthLevel: newGrowthLevel,
          lastUpdated: Date.now()
        });

        console.log("Updated plant growth progress:", { newAge, newWaterLevel, newGrowthLevel });
    }

    static calculateGrowthLevel(plant: Plant, waterLevel: number, age?: number): number {
        const currentAge = age ?? plant.age;
        const maxWater = plant.maxWater;

        if (currentAge > 20 && waterLevel >= maxWater * 0.9) {
            return 5;
        } else if (currentAge > 15 && waterLevel >= maxWater * 0.75) {
            return 4;
        } else if (currentAge > 10 && waterLevel >= maxWater * 0.6) {
            return 3; 
        } else if (currentAge > 5 && waterLevel >= maxWater * 0.4) {
            return 2;
        } else {
            return 1;
        }
    }
    
    static async deletePlant(plantId: string) {
        const plantRef = doc(this.getPlantsCollectionRef(), plantId);
        await deleteDoc(plantRef);
    }
    
    static getGrowthProgress(plant: Plant): number {
        return Math.min(100, (plant.age / plant.growthTime) * 100);
    }
    
    static getWaterLevel(plant: Plant): number {
        return (plant.currWater / plant.maxWater) * 100;
    }

    static async produceCoins(plantId: string, amount: number) {
        const plant = await this.getPlantById(plantId);
        if (!plant) throw new Error('Plant not found');
        const coinsRef = doc(this.getUserRef(), 'coins');
        const coinsSnap = await getDoc(coinsRef);
        const coins = coinsSnap.exists() ? coinsSnap.data() : { value: 0 };
        const newCoins = coins.value + this.getWaterLevel(plant) * plant.growthBoost * rarityValue[plant.rarity] * amount;
        await setDoc(coinsRef, { value: newCoins });
    }

    static async getPlantIdByDescription(plantType: string, rarity: Rarity): Promise<string | null> {
        const plantsCollectionRef = this.getPlantsCollectionRef();
        const q = query(plantsCollectionRef, where('type', '==', plantType), where('rarity', '==', rarity));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) return null;
        if (querySnapshot.size > 1) {
            console.warn(`Multiple seeds found for type (${plantType}) and rarity (${rarity})`);
        }

        const plantDoc = querySnapshot.docs[0];
        return plantDoc.id;
    }
}
