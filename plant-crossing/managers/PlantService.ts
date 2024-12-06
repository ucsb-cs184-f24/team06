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
    

    static async updateGrowthProgress(plantId: string) {
        try {
            const plant = await this.getPlantById(plantId);
            if (!plant) {
                console.warn(`Plant with ID ${plantId} not found.`);
                return;
            }
    
            // Log fetched plant details
            console.log(`Fetched plant:`, plant);
    
            // Use createdAt directly from the plant object
            const plantingTime = plant.createdAt;
            if (!plantingTime) {
                console.error(`Plant with ID ${plantId} is missing a createdAt timestamp.`);
                return;
            }
    
            const timeElapsed = Date.now() - plantingTime;
            console.log(`Time Elapsed since planting: ${timeElapsed} ms`);
    
            const growthTimeInMs = plant.growthTime * 3600000; // Convert hours to ms
            const growthPercentage = timeElapsed / growthTimeInMs;
            console.log(`growth percentage ${growthPercentage}`);
    
            const newGrowthLevel = Math.max(Math.min(Math.floor(growthPercentage * 5), 5), 1);

    
            console.log(`Updating growth level to ${newGrowthLevel}`);
    
            const plantRef = doc(this.getPlantsCollectionRef(), plantId);
            await updateDoc(plantRef, {
                growthLevel: newGrowthLevel,
                lastUpdated: Date.now(),
            });
    
            console.log("Growth progress updated successfully:", {
                plantId,
                newGrowthLevel,
            });
        } catch (error) {
            console.error(`Error updating growth progress for plant ${plantId}:`, error);
        }
    }
    

    
    
    
    
    static calculateGrowthLevel(plant: Plant, lastLogin: number): number {
        const timePassed = Date.now() - lastLogin; // Time since last login in milliseconds
        const growthTimeMs = plant.growthTime * 60 * 1000; // Convert `growthTime` from minutes to milliseconds
        const growthPercentage = Math.min(1, timePassed / growthTimeMs); // Growth progress capped at 100%
    
        // Determine the growth level based on percentage progress
        if (growthPercentage >= 1) {
            return 5; // Fully grown
        } else if (growthPercentage >= 0.8) {
            return 4;
        } else if (growthPercentage >= 0.6) {
            return 3;
        } else if (growthPercentage >= 0.4) {
            return 2;
        } else {
            return 1; // Initial growth stage
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

    static async produceCoins(plantId: string, amount: number): Promise<number> {
        try {
            const plant = await this.getPlantById(plantId);
            if (!plant) throw new Error('Plant not found');
    
            const userRef = this.getUserRef();
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) throw new Error('User document not found');
    
            const coins = userSnap.data().coins || 0;
            const coinsProduced = plant.growthLevel * rarityValue[plant.rarity] * (1 + Math.floor(amount / 60000));
            const newCoins = coins + coinsProduced;
    
            await updateDoc(userRef, { coins: newCoins });
    
            console.log(`Plant ${plant.nickname} produced ${coinsProduced} coins while you were gone. You now have ${newCoins} coins!`);
            return coinsProduced; // Return the coins produced
        } catch (error) {
            console.error(`Error producing coins for plant ${plantId}:`, error);
            throw error; // Ensure any errors are propagated
        }
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
