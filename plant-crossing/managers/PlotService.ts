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
              console.log(seed.id);
              const plant = await SeedService.plantSeed(seed.id!, plotLocation);   
              await updateDoc(plotRef, { plant });
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
}
