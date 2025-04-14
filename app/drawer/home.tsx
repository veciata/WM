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
import {
  MaterialCommunityIcons,
  FontAwesome,
  Feather,
} from "@expo/vector-icons";
import styles from "@styles/LandingPageStyles";
import { useLocalization } from "@localization/i18n";
import { useRouter, useNavigation } from "expo-router";
import { UserService } from "@services/user";
import { MiningService } from "@services/mining";
import { useBackgroundTasks } from "@hooks/useBackgroundTasks";
import config from "@/config";
import { Platform } from "react-native";

const Home: React.FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const navigation = useNavigation();
  const [isMiningDisabled, setIsMiningDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
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
    setRemainingTime(status.remainingTime);
  };

  const handleStartMining = async () => {
    console.log(config.API_URL + `/v1/mining/ad-completed`);
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await fetch(config.API_URL + `/v1/mining/ad-completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          platform: Platform.OS,
        }),
      });

      const result = await response.json();

      console.log("Server Response:", result);

      if (result.success) {
        setUserBalance(result.balance?.toString() || "0"); // Ensure balance is updated correctly
        Alert.alert(
          t("success"),
          t("mining_reward_success", { amount: result.balance }),
        );
      } else {
        Alert.alert(t("error"), t(result.message || "Unknown error"));
      }
    } catch (error) {
      console.log("Error:", error);

      Alert.alert(t("error"), t("mining_reward_success", { amount: 0.025 }));
    } finally {
      setIsLoading(false);
    }
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
      {/* <View style={styles.balanceContainer}> */}
      {/*   <Text style={styles.balanceAmount}> */}
      {/*     {userBalance} {t("coin") ?? "WM"} */}
      {/*   </Text> */}
      {/* </View> */}

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
              t("miningInProgress")
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
