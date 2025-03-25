import React, { useEffect } from "react";
import { View, Text, StyleSheet, Linking, Alert } from "react-native";
import { useLocalization } from "./localization/i18n";

const WHITEPAPER_URL = "https://wesurmining.com/whitepaper";

const WhitepaperScreen: React.FC = () => {
  const { t } = useLocalization();

  useEffect(() => {
    openWhitepaper();
  }, []);

  const openWhitepaper = async () => {
    try {
      const supported = await Linking.canOpenURL(WHITEPAPER_URL);
      
      if (supported) {
        await Linking.openURL(WHITEPAPER_URL);
      } else {
        Alert.alert(
          "Hata",
          "Whitepaper sayfasına yönlendirilemiyor. Lütfen daha sonra tekrar deneyin."
        );
      }
    } catch (error) {
      console.error("Error opening whitepaper:", error);
      Alert.alert(
        "Hata",
        "Whitepaper sayfasına yönlendirilemiyor. Lütfen daha sonra tekrar deneyin."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Whitepaper sayfasına yönlendiriliyorsunuz...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8faf6',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default WhitepaperScreen; 