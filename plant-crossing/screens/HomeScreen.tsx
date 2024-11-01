import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Loader from '../components/Loader';
import LottieLoader from '../components/LottieLoader';

const HomeScreen = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 2,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete();
      });
    }, 2000);
  }, [fadeAnim, scaleAnim, onAnimationComplete]);

  return (
    <Loader />
    // <LottieLoader />
    // <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
    //   <Animated.Text
    //     style={{
    //       fontSize: 80,
    //       transform: [{ scale: scaleAnim }],
    //       textAlign: 'center',
    //       color: "#39c900",
    //     }}
    //   >
    //     Plant{"\n"}Crossings
    //   </Animated.Text>
    // </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#005500',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;