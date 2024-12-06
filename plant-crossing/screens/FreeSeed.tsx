import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, ImageBackground } from "react-native";
import { Accelerometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SeedService } from "../managers/SeedService";
import { Seed } from "../types/Seed";
import { availableSeeds } from "../data/items";

const FIVE_HOURS_MS = 60 * 60 * 1000; // 5 hour timer

const sprites = {
  Bag: require('../assets/bag-sprites/bag.png'),
  EmptyBag: require('../assets/bag-sprites/empty-bag.png'),
  Common: require('../assets/seed-sprites/seed-common.png'),
  Uncommon: require('../assets/seed-sprites/seed-uncommon.png'),
  Rare: require('../assets/seed-sprites/seed-rare.png'),
  Unique: require('../assets/seed-sprites/seed-unique.png'),
  Legendary: require('../assets/seed-sprites/seed-legendary.png'),
};

const background = require('../assets/wood_texture.jpg');

export default function FreeSeed() {
  const [seed, setSeed] = useState<Seed | null>(null);
  const [lastShakeTime, setLastShakeTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    const getLastShakeTime = async () => {
      const storedTime = await AsyncStorage.getItem("lastShakeTime");
      if (storedTime) {
        setLastShakeTime(parseInt(storedTime, 10));
      }
    };

    getLastShakeTime();

    Accelerometer.setUpdateInterval(1000);
    const subscription = Accelerometer.addListener(handleShake);
    const timer = setInterval(updateRemainingTime, 1000);

    return () => {
      subscription && subscription.remove();
      clearInterval(timer);
    };
  }, [lastShakeTime]);

  const handleShake = async ({ x, y, z }) => {
    const shakeThreshold = 1.78;
    const shakeDetected =
      Math.abs(x) > shakeThreshold || Math.abs(y) > shakeThreshold || Math.abs(z) > shakeThreshold;

    // Prevent shaking again if the timer is active
    if (shakeDetected && canShake() && !seed) {
      const randomSeed = availableSeeds[Math.floor(Math.random() * availableSeeds.length)];
      setSeed(randomSeed);
      await SeedService.addSeed(randomSeed);
      const currentTime = Date.now();
      setLastShakeTime(currentTime);

      await AsyncStorage.setItem("lastShakeTime", currentTime.toString());
    }
  };

  const canShake = () => {
    return !lastShakeTime || Date.now() - lastShakeTime >= FIVE_HOURS_MS;
  };

  const updateRemainingTime = () => {
    if (!lastShakeTime) {
      setRemainingTime("");
      return;
    }

    const timeSinceLastShake = Date.now() - lastShakeTime;
    const timeRemaining = FIVE_HOURS_MS - timeSinceLastShake;

    if (timeRemaining > 0) {
      const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
    } else {
      setRemainingTime("");
      setSeed(null); // Clear the seed only when the timer expires
    }
  };

  const currentSprite = canShake() ? sprites.Bag : sprites.EmptyBag;

  return (
    <ImageBackground source={background} style={styles.container}>
      <Text style={styles.text}>
        {remainingTime ? `Next shake in: ${remainingTime}` : "Shake for a seed!"}
      </Text>
      <View style={styles.square}>
        <Image source={currentSprite} style={styles.spriteImage} />
        {seed && (
          <Text style={styles.text}>{seed.type}</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  square: {
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  spriteImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});