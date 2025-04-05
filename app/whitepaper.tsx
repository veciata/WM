import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';

const WhitepaperPage = () => {
  const [whitepaperContent, setWhitepaperContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API'den veri çekme
    fetch('https://www.api.world-moneys.com/public/content/whitepaper') // URL'yi doğru şekilde ekleyin
      .then(response => response.json())
      .then(data => {
        if (data && data.content) {
          // 'content' string'ini JSON olarak çözümleyelim
          const parsedContent = JSON.parse(data.content);
          setWhitepaperContent(parsedContent.content); // Ana içeriği al
        }
      })
      .catch(err => setError('Veri çekilirken bir hata oluştu.'))
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
      <Text style={styles.contentText}>{whitepaperContent}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WhitepaperPage;
