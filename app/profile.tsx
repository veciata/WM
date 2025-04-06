import React, { useEffect, useState } from 'react';
import { Button } from "react-native-paper";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLocalization } from '@localization/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const ProfileScreen: React.FC = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Retrieve user data from AsyncStorage
        const userId = await AsyncStorage.getItem('userId');
        const token = await AsyncStorage.getItem('token');

        if (!userId || !token) {
          router.replace('/auth/login');
          return;
        }

        // Retrieve user information from AsyncStorage or API
        // Here you can replace it with a fetch request if needed
        const userName = await AsyncStorage.getItem('userName');
        const userEmail = await AsyncStorage.getItem('userEmail');

        setUserInfo({
          userName: userName || 'Kullanıcı Adı',
          userEmail: userEmail || 'kullanici@email.com',
        });

      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const logout = async () => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        // If no token exists, directly proceed to logout
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('token');
        router.replace('/auth/login');
        return;
      }

      // Making a fetch request to the API for logout
      const response = await fetch('https://api.world-moneys.com/public/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // On successful logout, remove token and user ID from AsyncStorage
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('token');

        // Redirect to login screen
        router.replace('/auth/login');
      } else {
        // Handle any issues with the logout API response
        const errorMessage = await response.text();
        console.error('Logout failed:', errorMessage);
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred while logging out.");
    }
  };

  if (!userInfo) {
    return null; // Optionally, you can show a loading spinner until user info is available
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.username}>{userInfo.userName}</Text>
        <Text style={styles.email}>{userInfo.userEmail}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1,000.25</Text>
          <Text style={styles.statLabel}>WM</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>1256.70</Text>
          <Text style={styles.statLabel}>C</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>560.82</Text>
          <Text style={styles.statLabel}>H10</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Profili Düzenle</Text>
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
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 15,
  },
  avatar: {
    width: '100%',
    height: '100%',
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
    backgroundColor: '#FF6347', // Add red color to the logout button
  }
});

export default ProfileScreen;
