# HW04 Contribution

### Folder Structure
- **Project Root**: [Plant Crossing Repository](https://github.com/ucsb-cs184-f24/team06/plant-crossing)
  - **HW04 Folder**: [HW04 Contribution](https://github.com/ucsb-cs184-f24/team06/tree/main/team/HW4)
    - **Test File**: [test/GardenScreen.test.tsx](https://github.com/ucsb-cs184-f24/team06/blob/main/plant-crossing/test/GardenScreen.test.tsx)
    - **Jest Configuration**: 
      - [jest.config.js](https://github.com/yourteam/plant-crossing/tree/main/jest.config.js)
      - [jest-setup.js](https://github.com/yourteam/plant-crossing/tree/main/jest-setup.js)

### Description
I wrote unit tests for our `Garden Screen` component in `GardenScreen.test.tsx`.

### Components Tested
- **GardenGrid**:
  - Handles planting seeds and harvesting plants via callback functions.
- **PlayerInventory**:
  - Updates the `selectedItem` state when a seed is selected.
- **GardenTools**:
  - Updates the `selectedItem` state when a tool is selected.
### Key Test Cases
1. **Rendering**:
   - Verifies that the core components (`GardenGrid`, `PlayerInventory`, `GardenTools`) render successfully.
2. **Seed Selection**:
   - Ensures that selecting a seed updates the `selectedItem` state correctly.
3. **Planting Seeds**:
   - Confirms the `onSeedPlanted` callback is triggered and the seed is marked for removal from the inventory.
4. **Harvesting Plants**:
   - Ensures the `onPlantHarvested` callback is triggered and the harvested seed is added back to the inventory.
5. **Tool Selection**:
   - Verifies that selecting a tool updates the `selectedItem` state appropriately.
