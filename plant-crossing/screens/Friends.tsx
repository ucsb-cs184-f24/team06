// Friends.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

interface Friend {
  id: string;
  name: string;
  status: string;
}

const friendsData: Friend[] = [
  { id: '1', name: 'John Doe', status: 'Online' },
  { id: '2', name: 'Jane Smith', status: 'Offline' },
  { id: '3', name: 'Chris Johnson', status: 'Online' },
  { id: '4', name: 'Emma Brown', status: 'Busy' },
];

const Friends = () => {
  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={styles.friendItem}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
      <FlatList
        data={friendsData}
        keyExtractor={(item) => item.id}
        renderItem={renderFriendItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
  },
  status: {
    fontSize: 14,
    color: '#888',
  },
});

export default Friends;
