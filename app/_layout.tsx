import React from "react";
import { Drawer } from "expo-router/drawer";
import { usePathname, useRouter } from "expo-router";
import { TouchableOpacity, StyleSheet, Text, View, Modal, FlatList, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalization, LanguageCode } from "./localization/i18n";
import LocalizationProvider from "./localization/i18n";
import { useState } from "react";

const languages = [
  { code: 'tr' as LanguageCode, name: 'Türkçe' },
  { code: 'en' as LanguageCode, name: 'English' },
];

function DrawerContent() {
  const { t, currentLanguage, setLanguage } = useLocalization();
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  return (
    <>
      <Drawer
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#000",
          drawerStyle: {
            width: 280,
          },
          drawerLabelStyle: {
            fontSize: 16,
          },
          drawerActiveTintColor: "#daba71",
          headerLeft: () => !isHomePage ? (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={24} color="#000" />
            </TouchableOpacity>
          ) : undefined,
          headerRight: () => (
            <TouchableOpacity
              style={styles.languageButton}
              onPress={() => setLanguageModalVisible(true)}
            >
              <Text style={styles.languageText}>
                {currentLanguage === 'tr' ? 'TR' : 'EN'}
              </Text>
              <Feather name="chevron-down" size={20} color="#000" />
            </TouchableOpacity>
          ),
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: t("home"),
            title: t("home"),
            headerShown: true,
            headerTitleAlign: "center",
            headerTitle: () => null
          }}
        />
        <Drawer.Screen
          name="chat"
          options={{
            drawerLabel: t("chat"),
            title: t("chat"),
          }}
        />
        <Drawer.Screen
          name="whitepaper"
          options={{
            drawerLabel: t("whitepaper"),
            title: t("whitepaper"),
          }}
        />
        <Drawer.Screen
          name="faq"
          options={{
            drawerLabel: t("faq"),
            title: t("faq"),
          }}
        />
        <Drawer.Screen
          name="blog"
          options={{
            drawerLabel: t("blog"),
            title: t("blog"),
          }}
        />
        <Drawer.Screen
          name="kyc"
          options={{
            drawerLabel: "KYC Onay",
            title: "KYC Onay",
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: t("settings"),
            title: t("settings"),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: t("profile"),
            title: t("profile"),
          }}
        />
      </Drawer>

      <Modal
        visible={isLanguageModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLanguageModalVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setLanguageModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Dil Seçimi</Text>
                <TouchableOpacity
                  onPress={() => setLanguageModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Feather name="x" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.languageItem,
                      currentLanguage === item.code && styles.languageItemActive
                    ]}
                    onPress={() => {
                      setLanguage(item.code);
                      setLanguageModalVisible(false);
                    }}
                  >
                    <View style={styles.languageItemContent}>
                      <Text style={[
                        styles.languageItemText,
                        currentLanguage === item.code && styles.languageItemTextActive
                      ]}>
                        {item.name}
                      </Text>
                      {currentLanguage === item.code && (
                        <Feather name="check" size={20} color="#daba71" />
                      )}
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    padding: 8,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '85%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  languageItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  languageItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageItemActive: {
    backgroundColor: '#fff9e6',
  },
  languageItemText: {
    fontSize: 16,
    color: '#333',
  },
  languageItemTextActive: {
    color: '#daba71',
    fontWeight: '600',
  },
  headerLogo: {
    width: 100,
    height: 30,
  },
});
