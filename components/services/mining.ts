import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";
import * as Notifications from "expo-notifications";
// import AdsService from "./ads";

// Define constants at the top
const API_URL = Config.API_URL;
console.log(API_URL);
const DAILY_MINING_LIMIT = 4;
const COOLDOWN_HOURS = 23;

export const MiningService = {
  async checkMiningStatus() {
    try {
      const today = new Date().toDateString();
      const miningCount =
        parseInt(await AsyncStorage.getItem(`mining_count_${today}`)) || 0;
      const lastMiningTime = await AsyncStorage.getItem(
        `last_mining_time_${today}`,
      );

      if (miningCount >= DAILY_MINING_LIMIT && lastMiningTime) {
        const { remainingHours, isCooldownOver } =
          this.calculateCooldown(lastMiningTime);

        if (!isCooldownOver) {
          return {
            isDisabled: true,
            message: `Daily limit reached. Try again in ${remainingHours} hours.`,
            remainingTime: `${remainingHours} hours`,
          };
        } else {
          await AsyncStorage.setItem(`mining_count_${today}`, "0");
          return { isDisabled: false, message: "", remainingTime: "" };
        }
      }
      return { isDisabled: false, message: "", remainingTime: "" };
    } catch (error) {
      console.error("Error checking mining status:", error);
      return { isDisabled: false, message: "", remainingTime: "" };
    }
  },

  calculateCooldown(lastMiningTime: string) {
    const lastMining = new Date(lastMiningTime);
    const now = new Date();
    const diffHours = (now.getTime() - lastMining.getTime()) / (1000 * 60 * 60);
    const remainingHours = Math.ceil(COOLDOWN_HOURS - diffHours);

    return {
      remainingHours,
      isCooldownOver: diffHours >= COOLDOWN_HOURS,
    };
  },

  async startMining(userId: string) {
    try {
      const today = new Date().toDateString();
      const miningCount =
        parseInt(await AsyncStorage.getItem(`mining_count_${today}`)) || 0;

      if (miningCount >= DAILY_MINING_LIMIT) {
        throw new Error(
          `Daily mining limit reached. Try again in ${COOLDOWN_HOURS} hours.`,
        );
      }

      // Show ad before mining
      const adsService = AdsService.getInstance();
      if (!adsService.isAvailable()) {
        throw new Error("Ad service not available");
      }

      const isAdWatched = await adsService.showRewardedAd();
      if (!isAdWatched) {
        throw new Error("Failed to watch ad");
      }

      // Perform mining API call
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/mining/start`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        throw new Error("Mining request failed");
      }

      // Update mining count and last mining time
      const newCount = miningCount + 1;
      await AsyncStorage.setItem(`mining_count_${today}`, newCount.toString());
      await AsyncStorage.setItem(
        `last_mining_time_${today}`,
        new Date().toISOString(),
      );

      return {
        success: true,
        message: `Mining successful! Remaining attempts: ${DAILY_MINING_LIMIT - newCount}`,
        remainingCount: DAILY_MINING_LIMIT - newCount,
      };
    } catch (error) {
      console.error("Mining error:", error.message);
      throw error;
    }
  },

  // ... rest of the service methods remain the same ...
};
