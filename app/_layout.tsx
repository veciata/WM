import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, ActivityIndicator } from "react-native";
import { useLocalization } from "@localization/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalizationProvider from "@localization/i18n";
import Home from './drawer/home'; // Make sure to import your screen components
import Chat from './chat';
import Whitepaper from './whitepaper';
import Faq from './faq';
import Blog from './blog';
import Kyc from './kyc';
import Settings from './settings';
import Profile from './profile';
import LoginScreen from './auth/login';
import RegisterScreen from './auth/register';

// Define allowed screens for authenticated users
const allowedScreens = [
  { name: "Home", component: Home },
  { name: "Chat", component: Chat },
  { name: "Whitepaper", component: Whitepaper },
  { name: "Faq", component: Faq },
  { name: "Blog", component: Blog },
  { name: "Kyc", component: Kyc },
  { name: "Settings", component: Settings },
  { name: "Profile", component: Profile },
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
      {allowedScreens.map(({ name, component }) => (
        <Drawer.Screen
          key={name}
          name={`drawer/${name}`}
          component={component}
          options={{
            drawerLabel: t(name),
            title: t(name),
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
      <Stack.Screen
        name="auth/login"
        component={LoginScreen}
        options={{ title: t("login") }}
      />
      <Stack.Screen
        name="auth/register"
        component={RegisterScreen}
        options={{ title: t("register") }}
      />
    </Stack.Navigator>
  );
};

const RootLayout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

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
    return <ActivityIndicator size="large" color="#2196F3" />; // Improved loading indicator
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
