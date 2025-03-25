import React, { useEffect } from "react";
import { View, Text, StyleSheet, Linking, Alert } from "react-native";
import { useLocalization } from "./localization/i18n";

const FAQ_URL = "https://wesurmining.com/faq";

const FAQScreen: React.FC = () => {
  const { t } = useLocalization();

  useEffect(() => {
    openFAQ();
  }, []);

  const openFAQ = async () => {
    try {
      const supported = await Linking.canOpenURL(FAQ_URL);
      
      if (supported) {
        await Linking.openURL(FAQ_URL);
      } else {
        Alert.alert(
          "Hata",
          "SSS sayfasına yönlendirilemiyor. Lütfen daha sonra tekrar deneyin."
        );
      }
    } catch (error) {
      console.error("Error opening FAQ:", error);
      Alert.alert(
        "Hata",
        "SSS sayfasına yönlendirilemiyor. Lütfen daha sonra tekrar deneyin."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SSS sayfasına yönlendiriliyorsunuz...</Text>
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

export default FAQScreen; 