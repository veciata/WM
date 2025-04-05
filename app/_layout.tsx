import React, { useState } from "react";
import { Stack } from "expo-router/stack";
import { Drawer } from "expo-router/drawer";
import { usePathname } from "expo-router";
import { useLocalization } from "@localization/i18n";
import LocalizationProvider from "@localization/i18n";

const allowedScreens = [
  "(tabs)",
  "chat",
  "whitepaper",
  "faq",
  "blog",
  "kyc",
  "settings",
  "profile"
];

export default function RootLayout() {
  const { t } = useLocalization();
  const pathname = usePathname();
  const isAuthScreen = pathname?.startsWith('/auth/');

  if (isAuthScreen) {
    return (
      <LocalizationProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="auth" options={{ headerShown: false }} />
        </Stack>
      </LocalizationProvider>
    );
  }

  return (
    <LocalizationProvider>
      <Drawer
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#2196F3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
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
      </Drawer>
    </LocalizationProvider>
  );
}

function DrawerContent() {
  const { t, currentLanguage, setLanguage } = useLocalization();
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#000",
        drawerStyle: { width: 280 },
        drawerLabelStyle: { fontSize: 16 },
        drawerActiveTintColor: "#daba71",
        headerLeft: () =>
          !isHomePage ? (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
          ) : undefined,
        headerRight: () => (
          <TouchableOpacity style={styles.languageButton} onPress={() => setLanguageModalVisible(true)}>
            <Text style={styles.languageText}>{currentLanguage === "tr" ? "TR" : "EN"}</Text>
            <Feather name="chevron-down" size={20} color="#000" />
          </TouchableOpacity>
        ),
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
    </Drawer>
  );
}

export default function Layout() {
  return (
    <LocalizationProvider>
      <DrawerContent />
    </LocalizationProvider>
  );
}

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
