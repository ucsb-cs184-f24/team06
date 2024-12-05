import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { FIRESTORE_DB } from "../FirebaseConfig";
import { Plot } from "../types/Plot";
import { Plant } from "../types/Plant";
import { SeedService } from "./SeedService";
import { Seed } from "../types/Seed";

export class PlotService {
    static async getPlotByLocation(userId: string, plotLocation: number) {
        try {
          const plotsRef = collection(FIRESTORE_DB, 'users', userId, 'plots');
          const plotQuery = query(plotsRef, where('location', '==', plotLocation));
          const querySnapshot = await getDocs(plotQuery);
    
          if (!querySnapshot.empty) {
            console.log(`Plot with location ${plotLocation} found`);
            return querySnapshot.docs[0].ref;
          } else {
            console.error(`Error: Plot with location ${plotLocation} not found`);
            return null;
          }
        } catch (error) {
          console.error('Error retrieving plot:', error);
          return null;
        }
      }
    
      static async unlockPlot(userId: string, plotLocation: number) {
        try {
          const plotRef = await this.getPlotByLocation(userId, plotLocation);
    
          if (plotRef) {
            await updateDoc(plotRef, { unlocked: true });
            console.log(`Plot ${plotLocation} unlocked successfully`);
          }
        } catch (error) {
          console.error(`Error unlocking plot ${plotLocation}:`, error);
        }
      }
    
      static async addPlantToPlot(userId: string, plotLocation: number, seed: Seed) {
        try {
          const plotRef = await this.getPlotByLocation(userId, plotLocation);
    
          if (plotRef) {
            const plotSnapshot = await getDoc(plotRef);
            const plotData = plotSnapshot.data();
            console.log(plotData);
    
            if (plotData?.unlocked && !plotData?.plant) {
              console.log(`Plot ${plotLocation} is unlocked and empty`);
              console.log(seed);
              const seedId = await SeedService.getSeedIdByDescription(seed.type, seed.rarity);
              if (!seedId) {
                console.error(`Error: Seed with description ${seed.type} and rarity ${seed.rarity} not found.`);
                return;
              }
              const plant = await SeedService.plantSeed(seedId, plotLocation);   
              await updateDoc(plotRef, { plant: plant.toFirestore() });
              console.log(`Plant added to plot ${plotLocation}`);
            } else {
              console.error(`Error: Plot ${plotLocation} is either locked or already has a plant.`);
            }
          }
        } catch (error) {
          console.error(`Error adding plant to plot ${plotLocation}:`, error);
        }
      }
    
      static async removePlantFromPlot(userId: string, plotLocation: number) {
        try {
          const plotRef = await this.getPlotByLocation(userId, plotLocation);
    
          if (plotRef) {
            const plotSnapshot = await getDoc(plotRef);
            const plotData = plotSnapshot.data();
    
            if (plotData?.plant) {
              await updateDoc(plotRef, { plant: null });
              console.log(`Plant removed from plot ${plotLocation}`);
            } else {
              console.error(`Error: Plot ${plotLocation} does not have a plant.`);
            }
          }
        } catch (error) {
          console.error(`Error removing plant from plot ${plotLocation}:`, error);
        }
      }

      static async syncPlantInPlot(userId: string, plotLocation: number) {
        try {
            const plotRef = doc(FIRESTORE_DB, `users/${userId}/plots/${plotLocation}`);
            const plotSnapshot = await getDoc(plotRef);

            if (!plotSnapshot.exists()) {
                console.error(`Plot with location ${plotLocation} not found.`);
                return;
            }

            const plotData = plotSnapshot.data();

            if (plotData?.plant) {
                const plantRef = doc(FIRESTORE_DB, `users/${userId}/plants/${plotData.plant.id}`);
                const plantSnapshot = await getDoc(plantRef);

                if (!plantSnapshot.exists()) {
                    console.error(`Plant with ID ${plotData.plant.id} not found.`);
                    return;
                }

                const updatedPlantData = plantSnapshot.data();
                await updateDoc(plotRef, { plant: updatedPlantData });

                console.log(`Synchronized plant data in plot ${plotLocation}.`);
            }
        } catch (error) {
            console.error(`Error synchronizing plant in plot ${plotLocation}:`, error);
        }
    }
}
