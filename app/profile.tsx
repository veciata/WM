import React, { useEffect, useState } from 'react';
import { Button } from "react-native-paper";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalization } from '@localization/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

interface UserInfo {
  userName: string;
  userEmail: string;
  userBalance: number;
  userCreatedAt: string;
}

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ProfileScreen: React.FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const [userData, token] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('token')
        ]);

        if (!userData || !token) {
          await AsyncStorage.multiRemove(['user', 'token']);
          router.replace('/auth/login');
          return;
        }

        const parsedUserData = JSON.parse(userData);

        setUserInfo({
          userName: parsedUserData.name || t('profile.default_name'),
          userEmail: parsedUserData.email || t('profile.default_email'),
          userBalance: parsedUserData.balance || 0,
          userCreatedAt: formatDate(parsedUserData.created_at),
        });
      } catch (error) {
        console.error("Error fetching user info:", error);
        router.replace('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const logout = async () => {
    try {
      const [token, user] = await AsyncStorage.multiGet(['token', 'user']);

      if (!token[1] || !user[1]) {
        await AsyncStorage.multiRemove(['user', 'token']);
        router.replace('/auth/login');
        return;
      }

      const response = await fetch('https://api.world-moneys.com/public/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token[1]}`,
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      await AsyncStorage.multiRemove(['user', 'token']);
      router.replace('/auth/login');
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading || !userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{userInfo.userName}</Text>
        <Text style={styles.email}>{userInfo.userEmail}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userInfo.userBalance}</Text>
          <Text style={styles.statLabel}>WM</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{userInfo.userCreatedAt}</Text>
          <Text style={styles.statLabel}>{t("profile")} {t("created")}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>{t("profile")} {t("edit")}</Text>
      </TouchableOpacity>

      <Button
        mode="contained"
        style={styles.transactionRed}
        onPress={logout}
      >
        {t("logout")}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#daba71',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#daba71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionRed: {
    marginTop: 15,
    backgroundColor: '#FF6347',
  }
});

export default ProfileScreen;
