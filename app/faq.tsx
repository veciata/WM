import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalization } from "./localization/i18n";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQScreen = () => {
  const { t } = useLocalization();
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await fetch('https://www.api.world-moneys.com/public/faq');
        const data = await response.json();

        const transformedFAQ: FAQItem[] = data.data.map((item: any) => ({
          question: item.title,
          answer: item.detail,
        }));

        setFaqItems(transformedFAQ);
      } catch (error) {
        console.error('Failed to fetch FAQ:', error);

        setFaqItems([
          {
            question: "WM Coin nedir?",
            answer: "WM Coin, blockchain teknolojisi üzerine inşa edilmiş yenilikçi bir dijital varlıktır. Güvenli, hızlı ve düşük maliyetli işlemler yapmanızı sağlar."
          },
          {
            question: "WM Coin nasıl satın alabilirim?",
            answer: "WM Coin'i platformumuz üzerinden veya desteklenen borsalardan satın alabilirsiniz. Detaylı bilgi için destek ekibimizle iletişime geçebilirsiniz."
          },
          {
            question: "WM Coin'in avantajları nelerdir?",
            answer: "Düşük işlem ücretleri, hızlı transferler, güvenli altyapı ve geniş kullanım alanı WM Coin'in başlıca avantajlarıdır."
          },
          {
            question: "Cüzdanımı nasıl güvende tutabilirim?",
            answer: "İki faktörlü doğrulama kullanın, güçlü bir şifre belirleyin ve özel anahtarlarınızı güvenli bir yerde saklayın. Düzenli yedekleme yapmayı unutmayın."
          },
          {
            question: "Teknik destek nasıl alabilirim?",
            answer: "7/24 destek ekibimize platform üzerinden veya support@world-moneys.com adresinden ulaşabilirsiniz."
          }
        ]);
      }
    };

    fetchFAQ();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t("faq")}</Text>
      {faqItems.map((item, index) => (
        <View key={index} style={styles.faqItem}>
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#000',
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  answer: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default FAQScreen;
