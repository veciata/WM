import React, { useEffect, useState } from "react";
import { View, Alert, Text, Image, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import styles from "@styles/LandingPageStyles";
import { useLocalization } from "@localization/i18n";
import { useRouter, useNavigation } from "expo-router";
import { UserService } from "@services/user";
import { MiningService } from "@services/mining";
import { useBackgroundTasks } from "@hooks/useBackgroundTasks";

const Home: React.FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const navigation = useNavigation();
  const [isMiningDisabled, setIsMiningDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [userId, setUserId] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(false);

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
    setRemainingTime(status.remainingTime || 0);
    console.log("Remaining time:", formatRemainingTime(status.remainingTime));

    // Start interval to decrease remainingTime by 1 every second
    if (status.remainingTime > 0) {
      const intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId); // Stop interval when time is up
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId); // Cleanup the interval on unmount or re-run
    }
  };

  const formatRemainingTime = (seconds: number) => {
    if (seconds < 0) {
      seconds = 0;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = Math.floor(seconds % 60);

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleStartMining = async () => {
    setIsLoading(true);

    try {
      const reward = await MiningService.startMining(userId);
      Alert.alert(t("success"), t("mining_successful "));

      setUserBalance(reward.balance);
    } catch (error) {
      console.error("Mining error:", error);
      Alert.alert(t("error"), error.message ?? t("mining_failed"));
    } finally {
      setIsLoading(false);
    }
    setIsMiningDisabled(true);
    await checkMiningStatus();
    setUserBalance(user.balance);
  };

  const handleTransactionHistory = () => {
    navigation.navigate("HiddenScreens", { screen: "TransactionHistory" });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/WM-logo.png")}
        style={styles.logo}
      />

      <Button
        mode="contained"
        style={[
          styles.miningButton,
          (isMiningDisabled || isLoading) && styles.disabledButton,
        ]}
        onPress={handleStartMining}
        disabled={isMiningDisabled || isLoading}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons
            name={isMiningDisabled ? "gift-off-outline" : "gift"}
            size={20}
            color="#fff"
          />
          <Text style={{ marginLeft: 8, color: "#fff" }}>
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : isMiningDisabled ? (
              `${t("miningInProgress")} (${formatRemainingTime(remainingTime)})`
            ) : (
              t("startMining")
            )}
          </Text>
        </View>
      </Button>

      <Button
        mode="contained"
        style={styles.transactionRed}
        onPress={handleTransactionHistory}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome name="file-text-o" size={20} color="$d3d3d3" />
          <Text style={{ marginLeft: 8, color: "$d3d3d3" }}>
            {t("transactionHistory")}
          </Text>
        </View>
      </Button>
    </View>
  );
};

export default Home;
