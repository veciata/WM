import React, { useEffect, useState } from "react";
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import styles from "../styles/LandingPageStyles";
import { useLocalization } from "../localization/i18n";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const DAILY_MINING_LIMIT = 4;
const COOLDOWN_HOURS = 23;
const BACKGROUND_FETCH_TASK = 'BACKGROUND_FETCH_TASK';

// Bildirim izinlerini ayarla
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Bildirim izinlerini iste
async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert(
      "Bildirim İzni Gerekli",
      "Kazım süresi dolduğunda bildirim alabilmek için bildirim iznine ihtiyacımız var."
    );
    return false;
  }

  return true;
}

// Arka plan görevi tanımla
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const today = new Date().toDateString();
    const lastMiningTime = await AsyncStorage.getItem(`last_mining_time_${today}`);

    if (lastMiningTime) {
      const lastMining = new Date(lastMiningTime);
      const now = new Date();
      const diffHours = (now.getTime() - lastMining.getTime()) / (1000 * 60 * 60);

      if (diffHours >= COOLDOWN_HOURS) {
        await AsyncStorage.setItem(`mining_count_${today}`, "0");
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Kazım Süresi Doldu!",
            body: "23 saatlik bekleme süreniz doldu. Tekrar kazım yapabilirsiniz!",
          },
          trigger: null,
        });
      }
    }
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Background task error:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

const LandingPage: React.FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const [isMiningDisabled, setIsMiningDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState<string>("");

  useEffect(() => {
    checkMiningStatus();
    registerBackgroundTask();
    registerForPushNotificationsAsync();
    return () => {
      unregisterBackgroundTask();
    };
  }, []);

  const registerBackgroundTask = async () => {
    try {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
        minimumInterval: 60 * 60, // Her saat başı kontrol et
        stopOnTerminate: false,
        startOnBoot: true,
      });
    } catch (error) {
      console.error("Task registration failed:", error);
    }
  };

  const unregisterBackgroundTask = async () => {
    try {
      await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    } catch (error) {
      console.error("Task unregistration failed:", error);
    }
  };

  const checkMiningStatus = async () => {
    try {
      const today = new Date().toDateString();
      const miningCount = await AsyncStorage.getItem(`mining_count_${today}`);
      const lastMiningTime = await AsyncStorage.getItem(`last_mining_time_${today}`);

      if (miningCount && parseInt(miningCount) >= DAILY_MINING_LIMIT) {
        if (lastMiningTime) {
          const lastMining = new Date(lastMiningTime);
          const now = new Date();
          const diffHours = (now.getTime() - lastMining.getTime()) / (1000 * 60 * 60);

          if (diffHours < COOLDOWN_HOURS) {
            const remainingHours = Math.ceil(COOLDOWN_HOURS - diffHours);
            setIsMiningDisabled(true);
            setRemainingTime(`${remainingHours} saat`);
          } else {
            await AsyncStorage.setItem(`mining_count_${today}`, "0");
            setIsMiningDisabled(false);
            setRemainingTime("");
          }
        }
      } else {
        setIsMiningDisabled(false);
        setRemainingTime("");
      }
    } catch (error) {
      console.error("Error checking mining status:", error);
    }
  };

  const handleStartMining = async () => {
    try {
      const today = new Date().toDateString();
      const miningCount = await AsyncStorage.getItem(`mining_count_${today}`);
      const currentCount = miningCount ? parseInt(miningCount) : 0;

      if (currentCount >= DAILY_MINING_LIMIT) {
        Alert.alert(
          "Günlük Limit Aşıldı",
          `Günlük kazım limitine ulaştınız. ${COOLDOWN_HOURS} saat sonra tekrar kazım yapabilirsiniz.`
        );
        return;
      }

      await AsyncStorage.setItem(`mining_count_${today}`, (currentCount + 1).toString());
      await AsyncStorage.setItem(`last_mining_time_${today}`, new Date().toISOString());

      const lastMiningTime = await AsyncStorage.getItem(`last_mining_time_${today}`);
      if (lastMiningTime) {
        const lastMining = new Date(lastMiningTime);
        const now = new Date();
        const diffHours = (now.getTime() - lastMining.getTime()) / (1000 * 60 * 60);

        if (diffHours >= COOLDOWN_HOURS) {
          await AsyncStorage.setItem(`mining_count_${today}`, "0");
        }
      }

      setIsMiningDisabled(true);
      setRemainingTime(`${COOLDOWN_HOURS} saat`);

      Alert.alert(
        "Kazım Başladı",
        `Kazım işlemi başlatıldı. Kalan kazım hakkı: ${DAILY_MINING_LIMIT - (currentCount + 1)}`
      );
    } catch (error) {
      console.error("Error starting mining:", error);
      Alert.alert("Hata", "Kazım başlatılırken bir hata oluştu.");
    }
  };

  const handleTransactionHistory = () => {
    router.push("/transaction-history");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/WM-logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>{t("welcome")}</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>1,00025 {t("coin")}</Text>
        <Text style={styles.balanceSub}>{t("wesur")}</Text>
        <Text style={styles.subBalance}>1AY 1256.70C</Text>
        <Text style={styles.subBalance}>💧 560.82H10</Text>
      </View>

      <Button
        mode="contained"
        style={[styles.miningButton, isMiningDisabled && styles.disabledButton]}
        onPress={handleStartMining}
        disabled={isMiningDisabled}
      >
        {isMiningDisabled ? t("miningInProgress") : t("startMining")}
      </Button>

      <Button
        mode="contained"
        style={styles.transactionRed}
        onPress={handleTransactionHistory}
      >
        {t("transactionHistory")}
      </Button>
    </View>
  );
};

export default LandingPage;
