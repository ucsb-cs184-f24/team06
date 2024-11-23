Code merged in PR #105 (branch rf-creating-backend)

Main Contributions:
- Added CRUD functionality with Firebase to all Seed, Plant, and Plot functions so that user data saves across sessions (previously did not save across sessions as seen from the bottom two pictures cs184hw4.pdf file in this folder)
- User's garden plot and inventory is no longer hard coded and instead retrieved from Firebase data
- Unlocking plots and planting seeds in the garden plot saves to Firebase to be retrieved dynamically with an event listener
- Planting seeds removes them from the inventory (change saved to Firebase)
- User garden plot and inventory is retrieved from and saved to Firebase upon login and logout
- Rewrote Seed, Plant, and Plot data structures in new folder /types
- Wrote Seed, Plant, and Plot functions in new files SeedService, PlantService, and PlotService in the /managers folder (previously did not exist as seen from top picture in cs184hw4.pdf file)
  
