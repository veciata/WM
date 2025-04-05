import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalization } from "@localization/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalizationProvider from "@localization/i18n";
import LoginScreen from './auth/login';
import RegisterScreen from './auth/register';

// Define allowed screens for authenticated users
const allowedScreens = [
  "drawer/home",
  "drawer/chat",
  "drawer/whitepaper",
  "drawer/faq",
  "drawer/blog",
  "drawer/kyc",
  "drawer/settings",
  "drawer/profile",
  "drawer/transaction-history",
];

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AuthLayout = () => {
  const { t } = useLocalization();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#2196F3" },
        headerTintColor: "#fff",
        drawerStyle: { width: 280 },
        drawerActiveTintColor: "#daba71",
      }}
    >
      {allowedScreens.map((screen) => (
        <Drawer.Screen
          key={screen}
          name={screen}
          options={{
            drawerLabel: t(screen),
            title: t(screen),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
};

const GuestLayout = () => {
  const { t } = useLocalization();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#2196F3" },
        headerTintColor: "#fff",
      }}
    >
      {/* Add your guest screens like login, register, etc. */}
      <Stack.Screen
        name="auth/login"
        component={LoginScreen} // Your LoginScreen component
        options={{ title: t("login") }}
      />
      <Stack.Screen
        name="auth/register"
        component={RegisterScreen} // Your RegisterScreen component
        options={{ title: t("register") }}
      />
    </Stack.Navigator>
  );
};

const RootLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Add null for loading state

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const token = await AsyncStorage.getItem("token");

        if (userId && token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, []);

  if (isAuthenticated === null) {
    return <Text>Loading...</Text>; // Show loading indicator while checking authentication
  }

  return (
    <LocalizationProvider>
      {isAuthenticated ? <AuthLayout /> : <GuestLayout />}
    </LocalizationProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 15,
    padding: 8,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    padding: 8,
  },
  languageText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
});
