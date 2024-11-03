import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Accelerometer } from "expo-sensors";
import AsyncStorage from "@react-native-async-storage/async-storage";

// BUG
// currently the shake timer isn't mapped to unique users
// so if one user shakes their seed, all other users won't be able to shake a seed until the initial user's 5 hours is up :/

const seedTypes = ["Sunflower", "Pumpkin", "Chia", "Flax", "Sesame", "Hemp"]; // replace with seed registry once that's been implemented
const FIVE_HOURS_MS = 5 * 60 * 60 * 1000; // 5 hour timer

export default function FreeSeed() {
  const [seed, setSeed] = useState("");
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

    if (shakeDetected && canShake()) {
      const randomSeed = seedTypes[Math.floor(Math.random() * seedTypes.length)];
      setSeed(randomSeed); // still need to add the seed to a player's inventory once it's been shaken out
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
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>
        {remainingTime ? `Next shake in: ${remainingTime}` : "Shake for a seed!"}
      </Text>
      <View style={styles.square}>
        <Text style={styles.seedText}>{seed || "Mystery Seed"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  timerText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  square: {
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.6,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#cd9c59",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  seedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});