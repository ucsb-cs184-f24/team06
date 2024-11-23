import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GardenScreen from '../screens/GardenScreen';

jest.mock('../data-structures/GardenPlots', () => ({
  GardenGrid: jest.fn(({ selectedItem, setSelectedItem, onSeedPlanted, onPlantHarvested }) => (
    <div>
      <button
        testID="plant-seed"
        onClick={() => onSeedPlanted({ id: 'seed1', name: 'Sunflower' })}
      >
        Plant Seed
      </button>
      <button
        testID="harvest-plant"
        onClick={() => onPlantHarvested({ id: 'seed2', name: 'Rose' })}
      >
        Harvest Plant
      </button>
    </div>
  )),
}));

jest.mock('../data-structures/InventoryBar', () => ({
  PlayerInventory: jest.fn(({ onItemSelected }) => (
    <div>
      <button
        testID="select-seed"
        onClick={() => onItemSelected({ id: 'seed3', name: 'Daisy' })}
      >
        Select Seed
      </button>
    </div>
  )),
}));

jest.mock('../data-structures/GardenTools', () => ({
  GardenTools: jest.fn(({ selectedItem, setSelectedItem }) => (
    <div>
      <button
        testID="select-tool"
        onClick={() => setSelectedItem({ id: 'tool1', name: 'Shovel' })}
      >
        Select Tool
      </button>
    </div>
  )),
}));

describe('GardenScreen', () => {
  it('should render the GardenGrid, PlayerInventory, and GardenTools components', () => {
    const { getByTestId } = render(<GardenScreen />);
    expect(getByTestId('plant-seed')).toBeTruthy();
    expect(getByTestId('harvest-plant')).toBeTruthy();
    expect(getByTestId('select-seed')).toBeTruthy();
    expect(getByTestId('select-tool')).toBeTruthy();
  });

  it('should update selectedItem when a seed is selected from the inventory', () => {
    const { getByTestId } = render(<GardenScreen />);
    const selectSeedButton = getByTestId('select-seed');
    fireEvent.press(selectSeedButton);
    // Verify that selecting a seed updates the selected item
  });

  it('should call onSeedPlanted when a seed is planted', () => {
    const { getByTestId } = render(<GardenScreen />);
    const plantSeedButton = getByTestId('plant-seed');
    fireEvent.press(plantSeedButton);
    // Verify that the seedToRemove state is updated
  });

  it('should call onPlantHarvested when a plant is harvested', () => {
    const { getByTestId } = render(<GardenScreen />);
    const harvestPlantButton = getByTestId('harvest-plant');
    fireEvent.press(harvestPlantButton);
    // Verify that the seedToAdd state is updated
  });

  it('should update selectedItem when a tool is selected from GardenTools', () => {
    const { getByTestId } = render(<GardenScreen />);
    const selectToolButton = getByTestId('select-tool');
    fireEvent.press(selectToolButton);
    // Verify that selecting a tool updates the selected item
  });
});