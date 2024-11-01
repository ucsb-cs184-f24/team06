import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

const Loader = ({ 
  size = 500, 
  color = '#4CAF50',
  duration = 2000,
  loop = true,
}) => {
  const stemHeight = new Animated.Value(0);
  const leftLeaf = new Animated.Value(0);
  const rightLeaf = new Animated.Value(0);
  const topLeaf = new Animated.Value(0);

  useEffect(() => {
    const reset = () => {
      stemHeight.setValue(0);
      leftLeaf.setValue(0);
      rightLeaf.setValue(0);
      topLeaf.setValue(0);
    };

    const animate = () => {
      reset();
      
      Animated.sequence([
        Animated.timing(stemHeight, {
          toValue: 1,
          duration: duration * 0.4,
          useNativeDriver: true,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        Animated.parallel([
          Animated.timing(leftLeaf, {
            toValue: 1,
            duration: duration * 0.3,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
          Animated.timing(rightLeaf, {
            toValue: 1,
            duration: duration * 0.3,
            useNativeDriver: true,
            easing: Easing.bezier(0.4, 0, 0.2, 1),
          }),
        ]),
        Animated.timing(topLeaf, {
          toValue: 1,
          duration: duration * 0.3,
          useNativeDriver: true,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      ]).start(() => {
        if (loop) {
          setTimeout(animate, 500);
        }
      });
    };

    animate();
    return () => {
      stemHeight.stopAnimation();
      leftLeaf.stopAnimation();
      rightLeaf.stopAnimation();
      topLeaf.stopAnimation();
    };
  }, [duration, loop]);

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    stem: {
      width: size * 0.1,
      height: size * 0.6,
      backgroundColor: color,
      borderRadius: size * 0.05,
      transform: [{ scaleY: stemHeight }],
      transformOrigin: 'bottom',
    },
    leaf: {
      position: 'absolute',
      width: size * 0.3,
      height: size * 0.3,
      backgroundColor: color,
      borderTopLeftRadius: size * 0.15,
      borderBottomRightRadius: size * 0.15,
    },
    leftLeafWrapper: {
      position: 'absolute',
      left: size * 0.15,
      bottom: size * 0.4,
      transform: [
        { rotate: '45deg' },
        { scale: leftLeaf },
      ],
    },
    rightLeafWrapper: {
      position: 'absolute',
      right: size * 0.15,
      bottom: size * 0.4,
      transform: [
        { rotate: '-45deg' },
        { scale: rightLeaf },
      ],
    },
    topLeafWrapper: {
      position: 'absolute',
      left: '50%',
      top: size * 0.1,
      marginLeft: -(size * 0.15),
      transform: [
        { scale: topLeaf },
      ],
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.leaf, styles.topLeafWrapper]} />
      <Animated.View style={styles.stem}>
        <Animated.View style={[styles.leaf, styles.leftLeafWrapper]} />
        <Animated.View style={[styles.leaf, styles.rightLeafWrapper]} />
      </Animated.View>
    </View>
  );
};

export default Loader;