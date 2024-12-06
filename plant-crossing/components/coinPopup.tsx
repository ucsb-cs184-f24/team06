import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { globalStyles } from "../styles/globalStyles";

const sprites = {
    Coin: require('../assets/coin.png'), // Make sure the path is correct
};

export interface CoinPopupProps {
    visible: boolean;
    onClose: () => void;
    coinsProduced: number;
}

export const CoinPopup: React.FC<CoinPopupProps> = ({ 
  visible, 
  onClose, 
  coinsProduced 
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Coin Image */}
          <Image source={sprites.Coin} style={styles.coinImage} />
          
          <Text style={[styles.title, globalStyles.text]}>Welcome Back!</Text>
          <Text style={[styles.description, globalStyles.text]}>
            While you were away, your plants produced {coinsProduced} coins!
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.confirmButton]} 
              onPress={onClose}
            >
              <Text style={[styles.buttonText, globalStyles.text]}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  coinImage: {
    width: 80, // Adjust size as needed
    height: 80,
    marginBottom: 16, // Space between the image and the title
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
  },
  confirmButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});