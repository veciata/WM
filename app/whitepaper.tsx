import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import RenderHtml from "react-native-render-html";

const WhitepaperPage = () => {
  const [whitepaperContent, setWhitepaperContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://www.api.world-moneys.com/public/content/whitepaper")
      .then((response) => response.json())
      .then((data) => {
        if (data && data.content) {
          const parsedContent = JSON.parse(data.content);
          setWhitepaperContent(parsedContent.content);
        }
      })
      .catch((err) => setError("Veri çekilirken bir hata oluştu."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <RenderHtml contentWidth={1000} source={{ html: whitepaperContent }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WhitepaperPage;
