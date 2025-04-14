import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Clipboard from "expo-clipboard";
import { UserService } from "@services/user";

const WalletScreen = () => {
  const [balance, setBalance] = useState("0");
  const [transactions, setTransactions] = useState([]);
  const walletAddress = "0x12ab...34cd";

  useEffect(() => {
    fetchBalanceAndTransactions();
  }, []);

  const fetchBalanceAndTransactions = async () => {
    const user = await UserService.getStoredUser();
    if (user) {
      setBalance(user.balance?.toString() || "0");
      setTransactions(user.recent_transactions || []);
    }
  };

  const handleCopyAddress = () => {
    Clipboard.setString(walletAddress);
    Alert.alert("Cüzdan Adresi", "Adres panoya kopyalandı");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Cüzdan</Text>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Bakiye</Text>
        <Text style={styles.balanceValue}>{balance} WM</Text>
      </View>

      <View style={styles.walletAddressContainer}>
        <Text style={styles.walletAddressLabel}>Cüzdan Adresi</Text>
        <View style={styles.walletRow}>
          <Text style={styles.walletAddress}>{walletAddress}</Text>
          <TouchableOpacity onPress={handleCopyAddress}>
            <Ionicons name="copy-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Son İşlemler</Text>

      <FlatList
        data={transactions}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#555" />
            <View style={styles.transactionText}>
              <Text>{item.type}</Text>
              <Text>{item.amount} WM</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default WalletScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  balanceContainer: {
    backgroundColor: "#324D4C",
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  balanceLabel: {
    color: "#fff",
    fontSize: 14,
  },
  balanceValue: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  walletAddressContainer: {
    marginBottom: 16,
  },
  walletAddressLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletAddress: {
    fontSize: 16,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginVertical: 12,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  transactionText: {
    marginLeft: 8,
  },
});
