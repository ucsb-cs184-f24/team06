// GardenGrid.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plot } from "./Plot";
import { Plant, Rarity } from "./Plant";
import { Seed } from "./Seed";

// Define the props for GardenGrid
interface GardenGridProps {
  plants: Plant[];
}

export class GardenPlot { 
    private plots: Plot[];
    private costsToUnlock: number[];
    public constructor(){ // 4 x 4 grid, last row locked
        this.plots = [];
        let numUnlocked = 12;
        let numLocked = 4;
        
        for(let i = 0; i < numUnlocked; i++){
            this.plots.push(new Plot(true));
        }
        for(let i = 0; i < numLocked; i++){
            this.plots.push(new Plot(false));
        }

        this.costsToUnlock = [100, 150, 200, 250];
    }

    public getPlots (){
        return this.plots;
    }
}

const plantedSeeds = [ // can change this later or pull randomly from items.ts
    new Seed("Fern Seed", Rarity.common, 2, 7),
    new Seed("Rose Seed", Rarity.common, 5, 5),
    new Seed("Cherry Blossom Seed", Rarity.rare, 5, 5),
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
];

// TO ADD: the player garden should be saved per user 
const playerGarden = new GardenPlot();
const playerPlots = playerGarden.getPlots();
playerPlots.map((plot, index) => {
    const seed = plantedSeeds[index];
    if(seed && plot.getUnlocked()){
        plot.plantSeed(seed);
    }
});

const columns = 4;
const screenWidth = Dimensions.get("window").width;
const plotSize = screenWidth / columns;

type itemProps = {title: string};

const Item = ({title}: itemProps) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
    </View>
);

export const GardenGrid = ({ selectedItem, setSelectedItem, onSeedPlanted }: GardenGridProps) => {
    const [plots, setPlots] = useState(playerGarden.getPlots()); // Use state to track plots

    const handlePress = (plot:Plot, index: number) => {
        if(plot?.getUnlocked()){
            if(plot.getSeed()){ // TO ADD: watering logic goes here
                plot.getSeed()?.waterSeed();
            } else if (selectedItem){
                plot.plantSeed(selectedItem);
                onSeedPlanted(selectedItem); // tell GardenScreen to remove from inventory
                setSelectedItem(null);
            }
        }
        else{ // unlocks plot, TO ADD: should cost coins to unlock plot
            plot.setUnlocked(true);
        }
        const updatedPlots = [...plots]; // this seems inefficient, (but follows react standards, so keep it?)
        updatedPlots[index] = plot;
        setPlots(updatedPlots);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={playerGarden.getPlots()}
                renderItem={({ item }) => {
                    let content;
                    if (item.getUnlocked()) {
                        if (item.getSeed()) {
                            content = (
                              <View style={styles.item}>
                                <Text style={styles.title}>
                                  {item.getNickname() || item.getType()}
                                </Text>
                              </View>
                            );
                        } else {
                            content = <View style={styles.emptyItem} />;
                        }
                    } else {
                        content = <Text style={styles.lockedItem}>Locked</Text>;
                    }

                    return (
                    <TouchableOpacity
                      onPress={() => console.log(`Pressed plot ${index}`)}
                    >
                      <View>{content}</View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => `plot-${index}`}
                numColumns={columns}
            />
        </SafeAreaView>
    );
};

export default GardenGrid;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  item: {
    backgroundColor: "#abf333",
    padding: 2,
    height: plotSize,
    width: plotSize,
    marginVertical: 0,
    marginHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyItem: {
    backgroundColor: "#cceeee",
    padding: 2,
    height: plotSize,
    width: plotSize,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  }
});
