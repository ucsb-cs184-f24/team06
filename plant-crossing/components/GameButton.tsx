import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TouchableOpacityProps 
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';


interface GameButtonProps extends TouchableOpacityProps {
  title: string;
  textStyle?: object;
}

export const GameButton = ({ 
  title, 
  style, 
  textStyle, 
  ...props 
}: GameButtonProps) => (
  <TouchableOpacity 
    style={[styles.button, style]} 
    {...props}
  >
    <Text style={[styles.buttonText, globalStyles.text]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontFamily: globalStyles.text.fontFamily,
  },
});