import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useLocalization } from "@localization/i18n";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import TransactionService, { Transaction } from "@services/transactions";
import AuthService from "@services/auth";

export default function TransactionHistoryScreen() {
  const { t } = useLocalization();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transactionService = TransactionService.getInstance();
  const authService = AuthService.getInstance();

  const loadTransactions = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('token');

      if (!userId || !token) {
        router.replace('/auth/login');
        return;
      }

      const response = await transactionService.getTransactions(userId, token);
      if (response.success && response.data) {
        setTransactions(response.data);
        setError(null);
      } else {
        setError(response.message || 'İşlem geçmişi yüklenemedi.');
      }
    } catch (error) {
      console.error('Load transactions error:', error);
      setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadTransactions();
  }, []);

  useEffect(() => {
      loadTransactions();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#daba71" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Örnek işlem verileri (fallback)
  const fallbackTransactions: Transaction[] = [
    {
      id: 1,
      userId: '1',
      type: 'mining',
      amount: 1000,
      timestamp: '2024-03-20T10:00:00Z',
      status: 'completed',
      description: 'Mining reward'
    },
    {
      id: 2,
      userId: '1',
      type: 'transfer',
      amount: 500,
      timestamp: '2024-03-19T15:30:00Z',
      status: 'pending',
      description: 'Transfer to wallet'
    },
    {
      id: 3,
      userId: '1',
      type: 'reward',
      amount: 750,
      timestamp: '2024-03-18T09:15:00Z',
      status: 'completed',
      description: 'Daily reward'
    },
  ];

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'mining':
        return 'cpu';
      case 'transfer':
        return 'repeat';
      case 'reward':
        return 'gift';
      default:
        return 'circle';
    }
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'mining':
        return '#4CAF50';
      case 'transfer':
        return '#2196F3';
      case 'reward':
        return '#daba71';
      default:
        return '#757575';
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

  const renderTransaction = ({ item }: { item: Transaction }) => (
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
        <Text style={styles.transactionDate}>{new Date(item.timestamp).toLocaleDateString()}</Text>
      </View>
      <View style={styles.transactionAmountContainer}>
        <Text
          style={[
            styles.transactionAmount,
            { color: getTransactionColor(item.type) },
          ]}
        >
          {item.type === 'transfer' ? '-' : '+'}{item.amount.toFixed(2)} WM
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
        data={transactions.length > 0 ? transactions : fallbackTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#daba71']}
            tintColor="#daba71"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
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