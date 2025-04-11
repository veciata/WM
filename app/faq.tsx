import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";
import { useLocalization } from "@localization/i18n";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQScreen = () => {
  const { t } = useLocalization();
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFAQ = async () => {
      try {
        const response = await fetch(
          "https://www.api.world-moneys.com/public/faq",
        );
        const data = await response.json();

        if (Array.isArray(data)) {
          const transformedFAQ: FAQItem[] = data.map((item: any) => ({
            question: item.title,
            answer: item.desc,
          }));

          setFaqItems(transformedFAQ);
          setFilteredFaqs(transformedFAQ);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        console.error("Failed to fetch FAQ:", error);

        const fallback = [
          {
            question: "WM Coin nedir?",
            answer:
              "WM Coin, blockchain teknolojisi üzerine inşa edilmiş yenilikçi bir dijital varlıktır. Güvenli, hızlı ve düşük maliyetli işlemler yapmanızı sağlar.",
          },
        ];

        setFaqItems(fallback);
        setFilteredFaqs(fallback);
      }
    };

    fetchFAQ();
  }, []);

  const handleSearch = (text: string) => {
    setSearchTerm(text);

    const filtered = faqItems.filter(
      (item) =>
        item.question.toLowerCase().includes(text.toLowerCase()) ||
        item.answer.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredFaqs(filtered);
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Soru veya açıklama ara..."
        value={searchTerm}
        onChangeText={handleSearch}
        placeholderTextColor="#999"
      />
      {filteredFaqs.map((item, index) => (
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
    backgroundColor: "#fff",
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
    color: "#000",
  },
  faqItem: {
    marginBottom: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 3,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  answer: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});

export default FAQScreen;
