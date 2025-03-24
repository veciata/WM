import { Drawer } from "expo-router/drawer";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "expo-router";
import { useLocalization } from "./localization/i18n";

export default function Layout() {
  const navigation = useNavigation();
  const { t, currentLanguage, changeLanguage } = useLocalization();

  const toggleLanguage = () => {
    const newLanguage = currentLanguage === "en" ? "tr" : "en";
    changeLanguage(newLanguage);
  };

  return (
    <Drawer
      screenOptions={{
        headerTitle: () => (
          <TouchableOpacity onPress={() => navigation.navigate("chat")} style={styles.chatButton}>
            <Icon name="message-square" size={28} color="#000" />
          </TouchableOpacity>
        ),
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
            <Icon name="globe" size={24} color="#000" />
            <Text style={styles.languageText}>{t("currentLanguage")}</Text>
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.iconButton}>
            <Icon name="menu" size={28} color="#000" />
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen name="(tabs)" options={{ drawerLabel: t("home") }} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: 15,
  },
  chatButton: {
    padding: 10,
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  languageText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});
