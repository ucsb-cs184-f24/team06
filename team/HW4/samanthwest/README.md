# HW04 Contribution

## Folder Structure
- **Project Root**: [Plant Crossing Repository](https://github.com/ucsb-cs184-f24/team06/plant-crossing)
  - **HW04 Folder**: [HW04 Contribution](https://github.com/ucsb-cs184-f24/team06/tree/main/team/HW4)
    - **Test File**: [test/ShopScreen.test.tsx](https://github.com/ucsb-cs184-f24/team06/blob/main/plant-crossing/test/ShopScreen.test.tsx)
    - **Jest Configuration**: 
      - [jest.config.js](https://github.com/yourteam/plant-crossing/tree/main/jest.config.js)
      - [jest-setup.js](https://github.com/yourteam/plant-crossing/tree/main/jest-setup.js)

## Description
This contribution introduces unit tests for the `ShopScreen` component of the Plant Crossing app

### Key Components:
1. **Test File**:  
   - Located in the `test/` folder, `ShopScreen.test.tsx` tests UI interactions for the `ShopScreen` component
   - It verifies modal visibility and correct alert functionality on button presses using Jest and React Native Testing
2. **Jest Setup and Configuration**:
   - **`jest-setup.js`**: Mocks necessary dependencies such as React Native's `NativeAnimatedHelper` and sets up the testing environment
   - **`jest.config.js`**: Configures Jest to work with the React Native and Expo ecosystem

These additions ensure the `ShopScreen` functions as expected, particularly regarding user interactions and alerts.
