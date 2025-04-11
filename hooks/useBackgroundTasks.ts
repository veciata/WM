import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_FETCH_TASK = "BACKGROUND_FETCH_TASK";
const COOLDOWN_HOURS = 23;

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const today = new Date().toDateString();
    const lastMiningTime = await AsyncStorage.getItem(
      `last_mining_time_${today}`,
    );

    if (lastMiningTime) {
      const lastMining = new Date(lastMiningTime);
      const now = new Date();
      const diffHours =
        (now.getTime() - lastMining.getTime()) / (1000 * 60 * 60);

      if (diffHours >= COOLDOWN_HOURS) {
        await AsyncStorage.setItem(`mining_count_${today}`, "0");
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Mining Cooldown Complete!",
            body: "Your 23-hour cooldown period has ended. You can mine again now!",
          },
          trigger: null,
        });
      }
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export const useBackgroundTasks = () => {
  useEffect(() => {
    const registerTasks = async () => {
      try {
        await Notifications.requestPermissionsAsync();
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 60 * 60, // 1 hour
          stopOnTerminate: false,
          startOnBoot: true,
        });
      } catch (error) {
        console.error("Background task registration failed:", error);
      }
    };

    registerTasks();

    return () => {
      BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK).catch(
        () => {},
      );
    };
  }, []);
};
