import config from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://api.world-moneys.com/public/api";

export const UserService = {
  async fetchUserData() {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return null;

      const response = await fetch(config.API_URL + `/auth/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("response:", response);

      if (response.ok) {
        const userData = await response.json();
        await AsyncStorage.setItem("user", JSON.stringify(userData));
        console.log("Fetched user data:", userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  },

  async getStoredUser() {
    const userJson = await AsyncStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  },
};
