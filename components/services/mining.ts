import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";
import * as Notifications from "expo-notifications";
// import AdsService from "./ads";
const API_URL = Config.API_URL;
const DAILY_MINING_LIMIT = 4;
const COOLDOWN_HOURS = 23;

export const MiningService = {
  async checkMiningStatus() {
    try {
      const response = await fetch(`${API_URL}/v1/mining/status`, {
        // Fixed the URL syntax
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch mining status");
      }

      const result = await response.json();

      if (result.success) {
        return {
          isDisabled: result.isDisabled, // Boolean to indicate if mining is disabled
          remainingTime: result.remainingTime, // Remaining time until mining can be re-enabled
        };
      } else {
        throw new Error(result.message || "Error fetching mining status");
      }
    } catch (error) {
      console.error("Error checking mining status:", error);
      return {
        isDisabled: true, // Default to disabled if there's an error
        remainingTime: 0, // No remaining time in case of error
      };
    }
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

  async handleCooldownNotification() {
    try {
      const today = new Date().toDateString();
      const lastMiningTime = await AsyncStorage.getItem(
        `last_mining_time_${today}`,
      );

      if (lastMiningTime) {
        const { isCooldownOver } = this.calculateCooldown(lastMiningTime);

        if (isCooldownOver) {
          await AsyncStorage.setItem(`mining_count_${today}`, "0");
          await this.sendNotification(
            "Kazım Süresi Doldu!",
            "23 saatlik bekleme süreniz doldu. Tekrar kazım yapabilirsiniz!",
          );
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Cooldown notification error:", error);
      return false;
    }
  },

  async sendNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  },

  // Make sure the calculateCooldown method exists
  calculateCooldown(lastMiningTime) {
    const now = new Date();
    const lastMiningDate = new Date(lastMiningTime);
    const timeDiff = now - lastMiningDate; // Time difference in milliseconds
    const isCooldownOver = timeDiff >= COOLDOWN_HOURS * 60 * 60 * 1000;

    return { isCooldownOver };
  },
};
