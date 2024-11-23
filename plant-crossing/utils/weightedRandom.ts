import { ShopItem } from '../data-structures/Item';
import { Seed } from '../types/Seed';

// helper function to randomly pick an item based on weights
export function weightedRandomSelection(items: Seed[], weights: number[]): ShopItem {
  const cumulativeWeights: number[] = [];
  let sum = 0;

  // create cumulative weight array
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    cumulativeWeights[i] = sum;
  }

  // get a random number in the range of 0 to sum
  const random = Math.random() * sum;

  // find the item that corresponds to this random number
  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (random < cumulativeWeights[i]) {
      return new ShopItem(items[i]);
    }
  }

  return new ShopItem(items[items.length - 1]); // fallback to the last item
}
