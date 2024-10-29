import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { GardenGrid } from '../data-structures/GardenPlots';
import Draggable from 'react-draggable'; 

  type InvItemProps = {
    item: InvItemData;
    onPress: () => void;
    backgroundColor: string;
    textColor: string;
  };

  type InvItemData = {
    id: string;
    title: string;
  };

  // TODO: replace this with inventory data structure
  const DATA: InvItemData[] = [
    {
      id: '1',
      title: 'First Item',
    },
    {
      id: '2',
      title: 'Second Item',
    },
    {
      id: '3',
      title: 'Third Item',
    },
  ];
  
  const InvItem = ({item, onPress, backgroundColor, textColor}: InvItemProps) => (
    <TouchableOpacity onPress={onPress} style={[styles.invItem, {backgroundColor}]}>
      <Text style={[styles.invText, {color: textColor}]}>{item.title}</Text>
    </TouchableOpacity>
  );

export default function GardenScreen() {

  const [selectedId, setSelectedId] = useState<string>();

  const renderItem = ({item}: {item: InvItemData}) => {
    const backgroundColor = item.id === selectedId ? '#8ba286' : '#d1dbcd';
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <InvItem
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={backgroundColor}
        textColor={color}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Garden Page</Text>
      {/* <Text style={styles.gardenSection}>placeholder</Text> */}
      <GardenGrid></GardenGrid> 
      <FlatList
          style={styles.inventorySection}
          data={DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          extraData={selectedId}
          horizontal={true}
        />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  gardenSection: {
    flex: 3,
  },
  plotSection: {
    flex: 1,
    backgroundColor: '#bd7743',
  },
  inventorySection: {
    flex: 1,
    backgroundColor: '#ededed',
  },
  invItem: {
    backgroundColor: '#d1dbcd', // #d1dbcd
    padding: 20,
    width: 150,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  invText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});