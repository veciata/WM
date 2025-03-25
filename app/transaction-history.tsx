import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useLocalization } from "./localization/i18n";
import { Feather } from "@expo/vector-icons";

// Örnek işlem verileri
const transactions = [
  {
    id: "1",
    type: "deposit",
    amount: "1000",
    date: "2024-03-20",
    status: "completed",
  },
  {
    id: "2",
    type: "withdraw",
    amount: "500",
    date: "2024-03-19",
    status: "pending",
  },
  {
    id: "3",
    type: "transfer",
    amount: "750",
    date: "2024-03-18",
    status: "completed",
  },
];

export default function TransactionHistoryScreen() {
  const { t } = useLocalization();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return "arrow-down-circle";
      case "withdraw":
        return "arrow-up-circle";
      case "transfer":
        return "repeat";
      default:
        return "circle";
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "#4CAF50";
      case "withdraw":
        return "#F44336";
      case "transfer":
        return "#2196F3";
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

  const renderTransaction = ({ item }: { item: typeof transactions[0] }) => (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIconContainer}>
        <Feather
          name={getTransactionIcon(item.type)}
          size={24}
          color={getTransactionColor(item.type)}
        />
      </View>
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionType}>
          {t(`transaction.${item.type}`)}
        </Text>
        <Text style={styles.transactionDate}>{item.date}</Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text
          style={[
            styles.transactionAmount,
            { color: getTransactionColor(item.type) },
          ]}
        >
          {item.type === "withdraw" ? "-" : "+"}{item.amount} $
        </Text>
        <Text style={[styles.transactionStatus, { color: getStatusColor(item.status) }]}>
          {t(`status.${item.status}`)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: "#757575",
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  transactionStatus: {
    fontSize: 12,
    fontWeight: "500",
  },
}); 