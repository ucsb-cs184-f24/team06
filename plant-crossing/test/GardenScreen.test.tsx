// GardenScreen.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import GardenScreen from '../screens/GardenScreen';
import { Seed } from '../data-structures/Seed';

// Mock data for testing
const mockSeed = new Seed('Fern', 'Common');

describe('GardenScreen', () => {
    it('renders the GardenScreen without crashing, assuming there are locked plots', () => {
        const { getAllByText } = render(<GardenScreen />);
        
        const lockedElements = getAllByText('Locked');
        
        expect(lockedElements.length).toBeGreaterThan(0);
    });      

  it('plants a selected seed by clicking on any available plot that is unlocked and has no seed or plant', () => {
    const { getByText, getAllByTestId, queryByText } = render(<GardenScreen />);
    let seedElement;
    let seedText;
  
    // hardcoded the seeds but might change this later when there's an easy way to retrieve a player's current inventory
    try {
        seedElement = getByText('Fern');
        seedText = 'Fern';
      } catch (e) {
        try {
          seedElement = getByText('Sunflower');
          seedText = 'Sunflower';
        } catch (e) {
          try {
            seedElement = getByText('Daisy');
            seedText = 'Daisy';
          } catch (e) {
            seedElement = getByText('Lavender');
            seedText = 'Lavender';
          }
        }
      }
      
    if (!seedElement) {
      throw new Error('None of the expected seeds were found');
    }
  
    fireEvent.press(seedElement);
  
    const plotElements = getAllByTestId(/plot-\d+/);
  
    const availablePlot = plotElements.find(plot => {
      const { testID } = plot.props;
      const splitTestID = testID.split('-');
      const [ , index, , unlocked, , seed ] = splitTestID;

      return unlocked === 'true' && seed === 'none';
    });
  
    if (availablePlot) {
      fireEvent.press(availablePlot);
    } else {
      throw new Error('No available unlocked plot with no seed or plant found!');
    }
  
    const plantedSeedElement = queryByText(seedText);
    
    expect(plantedSeedElement).toBeTruthy();
  });
  
});