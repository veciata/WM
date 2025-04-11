import React, { useState, useEffect } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
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
import {
  Ionicons,
  FontAwesome,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";

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

const SocialMediaIcons = () => {
  return (
    <View style={styles.socialMediaContainer}>
      <TouchableOpacity
        style={styles.socialIcon}
        onPress={() => console.log("Twitter pressed")}
      >
        <FontAwesome name="twitter" size={24} color="#1DA1F2" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.socialIcon}
        onPress={() => console.log("Facebook pressed")}
      >
        <FontAwesome name="facebook" size={24} color="#4267B2" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.socialIcon}
        onPress={() => console.log("Instagram pressed")}
      >
        <FontAwesome name="instagram" size={24} color="#E1306C" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.socialIcon}
        onPress={() => console.log("Telegram pressed")}
      >
        <FontAwesome name="telegram" size={24} color="#0088cc" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.socialIcon}
        onPress={() => console.log("YouTube pressed")}
      >
        <AntDesign name="youtube" size={24} color="#FF0000" />
      </TouchableOpacity>
    </View>
  );
};

const CustomDrawerContent = (props: any) => {
  const { t } = useLocalization();
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>{t("Follow us on social media")}</Text>
        <SocialMediaIcons />
        <Text style={styles.copyrightText}>© 2025</Text>
      </View>
    </View>
  );
};

const MainApp = () => {
  const { t } = useLocalization();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        options={{
          title: t("Home"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Chat"
        component={Chat}
        options={{
          title: t("Chat"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Whitepaper"
        component={Whitepaper}
        options={{
          title: t("Whitepaper"),
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="description" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Faq"
        component={Faq}
        options={{
          title: t("Faq"),
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="help-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Blog"
        component={Blog}
        options={{
          title: t("Blog"),
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="article" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Kyc"
        component={Kyc}
        options={{
          title: t("Kyc"),
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="verified-user" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          title: t("Profile"),
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
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

const styles = StyleSheet.create({
  socialMediaContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  socialIcon: {
    padding: 5,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
  },
  copyrightText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
    color: "#999",
  },
});

export default RootLayout;
