import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalization } from "@localization/i18n";
import { useLocalSearchParams } from 'expo-router';

const BlogDetailScreen: React.FC = () => {
  const { t } = useLocalization();
  const { id } = useLocalSearchParams();

  // Gerçek uygulamada bu veri API'den gelecek
  const blogPosts = [
    {
      id: 1,
      title: 'WM Coin Nedir?',
      excerpt: 'WM Coin, dünya çapında kullanılan yeni nesil bir kripto para birimidir...',
      image: 'https://via.placeholder.com/300x200',
      date: '15 Mart 2024',
      tags: ['Kripto', 'WM Coin', 'Başlangıç'],
      content: 'WM Coin, dünya çapında kullanılan yeni nesil bir kripto para birimidir. Güvenli, hızlı ve kullanıcı dostu özellikleriyle öne çıkan WM Coin, modern finans sisteminin vazgeçilmez bir parçası haline gelmiştir.\n\nWM Coin\'in temel özellikleri:\n\n1. Güvenlik: En son blockchain teknolojisi ile güvenli işlemler\n2. Hız: Saniyeler içinde tamamlanan transferler\n3. Kullanıcı Dostu: Kolay kullanım ve anlaşılır arayüz\n\nWM Coin, geleceğin finans sisteminin öncüsü olmaya devam ediyor. Kullanıcılarımızın güvenliği ve memnuniyeti bizim için her zaman ön planda.'
    },
    {
      id: 2,
      title: 'Madencilik Nasıl Yapılır?',
      excerpt: 'WM Coin madenciliği için gerekli adımlar ve ipuçları...',
      image: 'https://via.placeholder.com/300x200',
      date: '10 Mart 2024',
      tags: ['Madencilik', 'Rehber', 'WM Coin'],
      content: 'WM Coin madenciliği, kullanıcıların ağa katkıda bulunmasını ve ödül kazanmasını sağlayan önemli bir süreçtir. Bu rehberde, madencilik sürecinin tüm detaylarını bulabilirsiniz.\n\nMadencilik Adımları:\n\n1. Cüzdan Oluşturma\n2. Madencilik Yazılımı Kurulumu\n3. Ağa Bağlanma\n4. Madencilik Başlatma\n\nDetaylı bilgi için rehberimizi takip edin.'
    },
    {
      id: 3,
      title: 'Yeni Özellikler',
      excerpt: 'WM platformuna eklenen yeni özellikler ve güncellemeler...',
      image: 'https://via.placeholder.com/300x200',
      date: '5 Mart 2024',
      tags: ['Güncelleme', 'Yeni Özellikler', 'Platform'],
      content: 'WM platformu sürekli gelişiyor ve yeni özellikler ekliyor. Bu yazıda, son güncellemelerle birlikte gelen yeni özellikleri detaylı olarak inceleyebilirsiniz.\n\nYeni Eklenen Özellikler:\n\n1. Gelişmiş Grafik Arayüzü\n2. Otomatik Alım-Satım\n3. Portföy Yönetimi\n\nKullanıcılarımızın geri bildirimleri doğrultusunda sürekli kendimizi geliştiriyoruz.'
    },
  ];

  const post = blogPosts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t('postNotFound')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: post.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.date}>{post.date}</Text>
        <Text style={styles.contentText}>{post.content}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 20,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BlogDetailScreen;
