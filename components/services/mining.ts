import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";
import * as Notifications from "expo-notifications";
import config from "@/config";
import { Platform } from "react-native";
// import AdsService from "./ads";
const API_URL = Config.API_URL;

export const MiningService = {
  async checkMiningStatus() {
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/v1/mining/status`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch mining status");
      }

      const result = await response.json();
      console.log(result);

      if (result.success) {
        return {
          isDisabled: result.isDisabled,
          remainingTime: result.remainingTime,
        };
      } else {
        throw new Error(result.message || "Error fetching mining status");
      }
    } catch (error) {
      console.error("Error checking mining status:", error);
      return {
        isDisabled: true,
        remainingTime: 0,
      };
    }
  },

  async startMining(userId: string) {
    try {
      const today = new Date().toDateString();
      const miningCount =
        parseInt(await AsyncStorage.getItem(`mining_count_${today}`)) || 0;

      // Remove the daily limit check
      // if (miningCount >= DAILY_MINING_LIMIT) {
      //   throw new Error(`Daily  limit reached. Try again in hours.`);
      // }

      // const adsService = AdsService.getInstance();
      // if (!adsService.isAvailable()) {
      //   throw new Error("Ad service not available");
      // }

      // const isAdWatched = await adsService.showRewardedAd();
      // if (!isAdWatched) {
      //   throw new Error("Failed to watch ad");
      // }
      const isAdWatched = true;

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(config.API_URL + `/v1/mining/ad-completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          platform: Platform.OS, // Make sure this is not null or undefined
        }),
      });
      if (!response.ok) {
        throw new Error("Mining request failed");
      }

      const newCount = miningCount + 1;
      await AsyncStorage.setItem(`mining_count_${today}`, newCount.toString());
      await AsyncStorage.setItem(
        `last_mining_time_${today}`,
        new Date().toISOString(),
      );

      return {
        success: true,
        message: `Mining successful!`,
        remainingCount: newCount,
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

  calculateCooldown(lastMiningTime) {
    const now = new Date();
    const lastMiningDate = new Date(lastMiningTime);
    const timeDiff = now - lastMiningDate;
    const isCooldownOver = timeDiff >= COOLDOWN_HOURS * 60 * 60 * 1000;

    return { isCooldownOver };
  },
};
