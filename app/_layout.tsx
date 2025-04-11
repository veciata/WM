import React, { useState, useEffect } from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { ActivityIndicator, View, TouchableOpacity, Text } from "react-native";
import { useLocalization } from "@localization/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocalizationProvider from "@localization/i18n";
import Home from "./drawer/home";
import Chat from "./chat";
import Whitepaper from "./whitepaper";
import Faq from "./faq";
import Blog from "./blog";
import Kyc from "./kyc";
import Profile from "./profile";
import LoginScreen from "./auth/login";
import RegisterScreen from "./auth/register";
import { Ionicons } from "@expo/vector-icons";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const LanguageSelector = () => {
  const { t, locale, setLanguage } = useLocalization();
  const [showDropdown, setShowDropdown] = useState(false);

  const languages = [
    { code: "en", name: "English" },
    { code: "tr", name: "Türkçe" },
    // Add more languages as needed
  ];

  return (
    <View style={{ marginRight: 15 }}>
      <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
        <Ionicons name="language" size={24} color="white" />
      </TouchableOpacity>

      {showDropdown && (
        <View
          style={{
            position: "absolute",
            top: 40,
            right: 0,
            backgroundColor: "white",
            borderRadius: 8,
            padding: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
            zIndex: 1000,
          }}
        >
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => {
                setLanguage(lang.code);
                setShowDropdown(false);
              }}
              style={{
                padding: 8,
                backgroundColor:
                  locale === lang.code ? "#f0f0f0" : "transparent",
                borderRadius: 4,
                minWidth: 100,
              }}
            >
              <Text style={{ color: "#000" }}>{lang.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const MainApp = () => {
  const { t } = useLocalization();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#324D4C" },
        headerTintColor: "#fff",
        drawerStyle: { width: 280 },
        drawerActiveTintColor: "#daba71",
        headerRight: () => <LanguageSelector />,
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={{ title: t("Home") }}
      />
      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{ title: t("Chat") }}
      />
      <Drawer.Screen
        name="Whitepaper"
        component={Whitepaper}
        options={{ title: t("Whitepaper") }}
      />
      <Drawer.Screen name="Faq" component={Faq} options={{ title: t("Faq") }} />
      <Drawer.Screen
        name="Blog"
        component={Blog}
        options={{ title: t("Blog") }}
      />
      <Drawer.Screen name="Kyc" component={Kyc} options={{ title: t("Kyc") }} />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{ title: t("Profile") }}
      />
    </Drawer.Navigator>
  );
};

const AuthStack = () => {
  const { t } = useLocalization();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#324D4C" },
        headerTintColor: "#fff",
        headerRight: () => <LanguageSelector />,
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
        const token = await AsyncStorage.getItem("token");
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();

    // Listen for auth changes
    const interval = setInterval(checkAuthStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  if (isAuthenticated === null) {
    return <ActivityIndicator size="large" color="#324D4C" />;
  }

  return (
    <LocalizationProvider>
      {isAuthenticated ? <MainApp /> : <AuthStack />}
    </LocalizationProvider>
  );
};

export default RootLayout;
