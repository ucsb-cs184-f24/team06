import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function GardenScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.bigText}>Garden Page</Text>
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
  bigText: {
    fontSize: 50, // You can increase this value to make the text even bigger
    fontWeight: 'bold',
  },
});