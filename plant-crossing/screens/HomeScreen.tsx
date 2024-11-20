import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

const HomeScreen = ({ onAnimationComplete, startAnimation }: any) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (startAnimation) {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => {
            onAnimationComplete();
          }, 100);
        });
      }, 1000);
    }
  }, [fadeAnim, scaleAnim, onAnimationComplete, startAnimation]);

  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

  return (
    <Animated.View 
      style={[
        StyleSheet.absoluteFill, 
        { opacity: fadeAnim, zIndex: 999 }
      ]}
    >
      <AnimatedImageBackground
        source={require('../assets/pixel-garden.png')}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <Animated.Text
            style={[styles.titleText, {
              transform: [{ scale: scaleAnim }],
            }, globalStyles.text]}
          >
            Plant{"\n"}Crossings
          </Animated.Text>
        </View>
      </AnimatedImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 80,
    textAlign: 'center',
    color: "white",
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
});

export default HomeScreen;