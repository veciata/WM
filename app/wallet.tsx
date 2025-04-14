import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Clipboard from "expo-clipboard";
import { UserService } from "@services/user";
import WalletService, { WalletTransaction } from "@services/wallet";
import { useLocalization } from "@localization/i18n";
import { useNavigation } from "@react-navigation/native";
import styles from "@styles/WalletPageStyles";

const WalletScreen = () => {
  const { t } = useLocalization(); // Get translation function
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const walletAddress = "0x12ab...34cd";
  const navigation = useNavigation();

  useEffect(() => {
    fetchBalanceAndTransactions();
  }, []);

  const fetchBalanceAndTransactions = async () => {
    const user = await UserService.getStoredUser();
    if (user) {
      setBalance(user.balance?.toString() || "0");
      const response = await WalletService.getInstance().getWalletTransactions(
        user.token,
      );
      if (response.success) {
        setTransactions(response.data || []);
      } else {
        Alert.alert(
          t("error"),
          response.message || t("failed_to_load_wallet_transactions"),
        );
      }
    }
  };

  const handleCopyAddress = () => {
    Clipboard.setString(walletAddress);
    Alert.alert(t("wallet_address"), t("address_copied"));
  };

  const handleTakeCoin = () => {
    Alert.alert(t("coin_purchase"), t("coin_purchase_started"));
  };

  const handleSendCoin = () => {
    Alert.alert(t("coin_send"), t("coin_send_started"));
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "mining":
        return "cpu";
      case "transfer":
        return "repeat";
      case "reward":
        return "gift";
      default:
        return "circle";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "mining":
        return "#4CAF50";
      case "transfer":
        return "#2196F3";
      case "reward":
        return "#daba71";
      default:
        return "#757575";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "pending":
        return "#FFC107";
      case "failed":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const renderTransaction = ({ item }: { item: WalletTransaction }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>
        <Feather
          name={getTransactionIcon(item.type)}
          size={20}
          color={getTransactionColor(item.type)}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>{item.type}</Text>
        <Text style={styles.transactionDate}>
          {new Date(item.timestamp).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text
          style={[
            styles.transactionAmount,
            { color: getTransactionColor(item.type) },
          ]}
        >
          {item.type === "transfer" ? "-" : "+"}
          {item.amount} WM
        </Text>
        <Text
          style={[
            styles.transactionStatus,
            { color: getStatusColor(item.status) },
          ]}
        >
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const handleSeeMore = () => {
    navigation.navigate("TransactionHistory");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{t("wallet")}</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>{t("balance")}</Text>
        <Text style={styles.balanceValue}>{balance} WM</Text>
      </View>

      <View style={styles.walletAddressContainer}>
        <Text style={styles.walletAddressLabel}>{t("wallet_address")}</Text>
        <View style={styles.walletRow}>
          <Text style={styles.walletAddress}>{walletAddress}</Text>
          <TouchableOpacity onPress={handleCopyAddress}>
            <Ionicons name="copy-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={handleTakeCoin}>
          <Text style={styles.buttonText}>{t("coin_purchase")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleSendCoin}>
          <Text style={styles.buttonText}>{t("coin_send")}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>{t("recent_transactions")}</Text>

      <FlatList
        data={transactions.slice(0, 5)} // Limit to first 5 transactions
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderTransaction}
      />

      {transactions.length > 5 && (
        <TouchableOpacity onPress={handleSeeMore} style={styles.seeMoreButton}>
          <Text style={styles.seeMoreText}>{t("see_more")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default WalletScreen;
