import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useLocalization } from "./localization/i18n";

interface WhitepaperSection {
  id: number;
  title: string;
  content: string;
  order: number;
}

const API_URL = "https://www.api.world-moneys.com/public/api/content/whitepaper";

const WhitepaperScreen = () => {
  const { t } = useLocalization();
  const [sections, setSections] = React.useState<WhitepaperSection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchWhitepaper = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const sortedSections = data.data.sort((a: WhitepaperSection, b: WhitepaperSection) => a.order - b.order);
        setSections(sortedSections);
      } catch (error) {
        console.error('Failed to fetch whitepaper:', error);
        setError('Whitepaper yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchWhitepaper();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#daba71" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const fallbackSections: WhitepaperSection[] = [
    {
      id: 1,
      title: "Giriş",
      content: "WM Coin, blockchain teknolojisinin gücünü kullanarak finansal işlemleri daha erişilebilir, güvenli ve verimli hale getirmeyi amaçlayan yenilikçi bir kripto para projesidir.",
      order: 1
    },
    {
      id: 2,
      title: "Teknoloji",
      content: "Projemiz, en son blockchain teknolojilerini kullanarak yüksek işlem hızı, düşük maliyetler ve maksimum güvenlik sağlar. Akıllı kontrat altyapımız, şeffaf ve güvenilir işlemler gerçekleştirmenizi sağlar.",
      order: 2
    },
    {
      id: 3,
      title: "Tokenomics",
      content: "Toplam arz: 1,000,000,000 WM\nDolaşımdaki arz: 300,000,000 WM\nKilitli token: 700,000,000 WM\n\nToken dağılımı:\n- Ekosistem geliştirme: 30%\n- Topluluk ödülleri: 25%\n- Takım: 15%\n- Pazarlama: 10%\n- Likidite: 20%",
      order: 3
    },
    {
      id: 4,
      title: "Yol Haritası",
      content: "2025 Q2: Mainnet lansmanı\n2025 Q3: DEX entegrasyonu\n2025 Q4: Mobil cüzdan lansmanı\n2026 Q1: Cross-chain köprü geliştirmesi\n2026 Q2: DAO yönetim sisteminin devreye alınması",
      order: 4
    },
    {
      id: 5,
      title: "Ekosistem",
      content: "WM Coin ekosistemi, DeFi protokolleri, NFT pazaryeri, stake havuzları ve cross-chain köprü çözümleri gibi çeşitli ürün ve hizmetleri içerir. Kullanıcılar, bu ekosistem içinde WM Coin'lerini çeşitli şekillerde değerlendirebilirler.",
      order: 5
    }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t("whitepaper")}</Text>
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.content}>{section.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
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
  section: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  content: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});

export default WhitepaperScreen; 