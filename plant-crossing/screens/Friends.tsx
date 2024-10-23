import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Friends = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
      {/* Empty content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Friends;
