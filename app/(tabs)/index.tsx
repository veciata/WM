import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import styles from "./LandingPageStyles";
import { useLocalization } from "../localization/i18n";

const LandingPage: React.FC = () => {
  const { t } = useLocalization();

  const handleStartMining = () => {
    console.log("Mining Started");
  };

  const handleTransactionHistory = () => {
    console.log("Transaction History");
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>W</Text>
        </View>
        <Text style={styles.title}>{t("title")}</Text>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceAmount}>{t("balance")}</Text>
        <Text style={styles.balanceSub}>{t("wesur")}</Text>
        <Text style={styles.subBalance}>1AY 1256.70C</Text>
        <Text style={styles.subBalance}>💧 560.82H10</Text>
      </View>

      <Button
        mode="contained"
        style={styles.miningButton}
        onPress={handleStartMining}
      >
        {t("startMining")}
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
