import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";
import styles from "@styles/LandingPageStyles";
import { useLocalization } from "@localization/i18n";
import { useRouter } from "expo-router";
import { UserService } from "@services/user";
import { MiningService } from "@services/mining";
import { useBackgroundTasks } from "@hooks/useBackgroundTasks";

const Home: React.FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const [isMiningDisabled, setIsMiningDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [userId, setUserId] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

  // Initialize background tasks
  useBackgroundTasks();

  useEffect(() => {
    const initializeApp = async () => {
      const user = await UserService.getStoredUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }

      setUserId(user.id.toString());
      setUserBalance(user.balance);
      await checkMiningStatus();
    };

    initializeApp();
  }, []);

  const checkMiningStatus = async () => {
    const status = await MiningService.checkMiningStatus();
    setIsMiningDisabled(status.isDisabled);
    setRemainingTime(status.remainingTime);
  };

  const handleStartMining = async () => {
    Alert.alert("Hata", "İnternet bağlantınız yok veya reklam bulunamadı.");
  };
  // const handleStartMining = async () => {
  //   setIsLoading(true);
  //   try {
  //     await MiningService.startMining(userId);
  //     const userData = await UserService.fetchUserData();
  //     if (userData) setUserBalance(userData.balance);
  //     await checkMiningStatus();
  //   } catch (error) {
  //     console.error("Mining error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleTransactionHistory = () => {
    router.push("/drawer/transaction-history");
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/WM-logo.png")}
        style={styles.logo}
      />

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>
          {userBalance} {t("coin") ?? "WM"}
        </Text>
      </View>

      <Button
        mode="contained"
        style={[styles.miningButton, isMiningDisabled && styles.disabledButton]}
        onPress={handleStartMining}
        disabled={isMiningDisabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : isMiningDisabled ? (
          t("miningInProgress")
        ) : (
          t("startMining")
        )}
      </Button>

      {isMiningDisabled && remainingTime && (
        <Text style={styles.cooldownText}>
          {t("cooldownRemaining")}: {remainingTime}
        </Text>
      )}

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

export default Home;
