import AsyncStorage from "@react-native-async-storage/async-storage";
import Config from "@/config";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

const API_URL = Config.API_URL;
const COOLDOWN_HOURS = 23;

export const MiningService = {
  // Fetch mining status (disabled or remaining time)
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

  // Start mining operation
  async startMining(userId: string) {
    try {
      const today = new Date().toDateString();

      const isAdWatched = true; // Simulating ad watching

      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/v1/mining/ad-completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          platform: Platform.OS,
        }),
      });

      console.log("response:", response);
      // Assuming response is a fetch Response object, we need to extract the JSON body first
      response
        .json()
        .then((data) => {
          console.log("Parsed response:", data);

          if (!data.success) {
            throw new Error("Mining request failed");
          }
          // If necessary, handle the successful response here
          console.log("Mining success:", data);
        })
        .catch((error) => {
          console.error("Error parsing response:", error);
        });

      await AsyncStorage.setItem(
        `last_mining_time_${today}`,
        new Date().toISOString(),
      );

      return {
        success: true,
        message: `Mining successful!`,
      };
    } catch (error) {
      console.error("Mining error:", error.message);
      throw error;
    }
  },

  // Update user balance after mining
  async updateUserBalance(userId: string) {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_URL}/v1/user/balance`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch balance");
      }

      const result = await response.json();
      return result.balance; // Ensure this matches your API response structure
    } catch (error) {
      console.error("Error updating balance:", error);
      return "0"; // Return a fallback value if an error occurs
    }
  },

  // Handle cooldown notifications
  async handleCooldownNotification() {
    try {
      const today = new Date().toDateString();
      const lastMiningTime = await AsyncStorage.getItem(
        `last_mining_time_${today}`,
      );

      if (lastMiningTime) {
        const { isCooldownOver } = this.calculateCooldown(lastMiningTime);

        if (isCooldownOver) {
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

  // Send a push notification
  async sendNotification(title: string, body: string) {
    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger: null,
    });
  },

  // Calculate cooldown time
  calculateCooldown(lastMiningTime) {
    const now = new Date();
    const lastMiningDate = new Date(lastMiningTime);
    const timeDiff = now - lastMiningDate;
    const isCooldownOver = timeDiff >= COOLDOWN_HOURS * 60 * 60 * 1000;

    return { isCooldownOver };
  },
};
