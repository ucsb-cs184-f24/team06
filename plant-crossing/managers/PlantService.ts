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

    static async boostPlant(plantId: string, rarity: Rarity){
        const boostValue = 1 + (rarityValue[rarity] * .25); // power of growth boost increases with rarity
        
        await this.updatePlant(plantId, {growthBoost: boostValue});
        console.log("plant", plantId, "boosted, boostvalue:", boostValue);
        return boostValue;
    }

    static async resetBoost(plantId: string, rarity: Rarity){
        const boostValue = 1 + (rarityValue[rarity] * .25); // power of growth boost increases with rarity
        // let duration = 60000 * boostValue; // 1 minute * boostValue
        let duration = 10000 * boostValue;
        
        await new Promise(resolve => setTimeout(resolve, duration));
        await this.updatePlant(plantId, {growthBoost: 69});
        console.log("plant", plantId, "boost removed.");
        return boostValue;
    }

    static async waterPlant(plantId: string, amount: number) {
        try {
            // Fetch plant data
            const plant = await this.getPlantById(plantId);
            if (!plant) throw new Error('Plant not found');
            
            // Calculate the new water level
            const newWaterLevel = Math.min(plant.currWater + amount, plant.maxWater);
            
            // Update only the water level of the plant
            await this.updatePlant(plantId, { currWater: newWaterLevel });
            
            console.log("Plant", plantId, "watered, waterLevel:", newWaterLevel);
            return newWaterLevel;
        } catch (error) {
            console.error(`Error watering plant ${plantId}:`, error);
            throw error;
        }
    }
    

    static async updateGrowthProgress(plantId: string, userLastLogin: number) {
        try {
            // Fetch plant data
            const plant = await this.getPlantById(plantId);
            if (!plant) {
                console.warn(`Plant with ID ${plantId} not found.`);
                return;
            }
    
            // Reference to the plant in Firestore
            const plantRef = doc(this.getPlantsCollectionRef(), plantId);
            const plantSnap = await getDoc(plantRef);
            const data = plantSnap.data();
    
            if (!data) {
                console.warn(`Plant data missing for ID ${plantId}`);
                return;
            }
    
            // Use the greater of lastLogin or plant's lastUpdated
            const lastCheckTime = Math.max(data.lastUpdated || 0, userLastLogin);
            const timePassed = Date.now() - lastCheckTime;
            const hoursProgress = timePassed / (1000 * 60 * 60);
    
            // Update plant age based on growth boost
            const newAge = plant.age + (hoursProgress * plant.growthBoost);
    
            // Calculate water consumption
            const waterConsumptionRate = 0.1; // Adjust as needed
            const waterConsumed = hoursProgress * waterConsumptionRate * plant.maxWater;
            const newWaterLevel = Math.max(0, plant.currWater - waterConsumed);
    
            // Determine the new growth level
            const newGrowthLevel = this.calculateGrowthLevel(plant, newWaterLevel, newAge);
    
            // Update plant data in Firestore
            await updateDoc(plantRef, {
                age: newAge,
                currWater: newWaterLevel,
                growthLevel: newGrowthLevel,
                lastUpdated: Date.now(),
            });
    
            console.log("Updated plant growth progress:", {
                plantId,
                newAge,
                newWaterLevel,
                newGrowthLevel,
            });
        } catch (error) {
            console.error(`Error updating growth progress for plant ${plantId}:`, error);
        }
    }
    
    
    static calculateGrowthLevel(plant: Plant, waterLevel: number, age?: number): number {
        const currentAge = age ?? plant.age;
        const maxWater = plant.maxWater;
    
        // Growth level thresholds
        if (currentAge > 20 && waterLevel >= maxWater * 0.9) {
            return 5; // Fully grown
        } else if (currentAge > 15 && waterLevel >= maxWater * 0.75) {
            return 4;
        } else if (currentAge > 10 && waterLevel >= maxWater * 0.6) {
            return 3;
        } else if (currentAge > 5 && waterLevel >= maxWater * 0.4) {
            return 2;
        } else {
            return 1; // Initial growth level
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
            console.warn(`Multiple plants found for type (${plantType}) and rarity (${rarity})`);
        }

        const plantDoc = querySnapshot.docs[0];
        return plantDoc.id;
    }
}
