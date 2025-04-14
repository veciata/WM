import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import { UserService } from "@/components/services/user";
import { useLocalization } from "@localization/i18n";
import { useRouter, useNavigation } from "expo-router";

const Balance = () => {
  const [balance, setBalance] = useState("0");
  const { t } = useLocalization();
  const router = useRouter();

  const loadBalance = async () => {
    const user = await UserService.fetchUserData();
    if (!user) {
      router.replace("Login");
      return;
    }
    setBalance(user.balance);
  };

  useEffect(() => {
    loadBalance();

    const interval = setInterval(() => {
      loadBalance();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatBalance = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    }).format(number);
  };

  return (
    <View>
      <Text style={styles.text}>
        {formatBalance(balance)} {t("coin")}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#daba71",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default Balance;
