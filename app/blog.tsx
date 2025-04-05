import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalization } from '@localization/i18n';
import { useRouter } from 'expo-router';
import BlogDetailScreen from '@blog/[id]';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  tags: string[];
  content: string;
}

const localBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'WM Coin Nedir?',
    excerpt: 'WM Coin, dünya çapında kullanılan yeni nesil bir kripto para birimidir...',
    image: 'https://via.placeholder.com/300x200',
    date: '15 Mart 2024',
    tags: ['Kripto', 'WM Coin', 'Başlangıç'],
    content: 'WM Coin, dünya çapında kullanılan yeni nesil bir kripto para birimidir. Güvenli, hızlı ve kullanıcı dostu özellikleriyle öne çıkan WM Coin, modern finans sisteminin vazgeçilmez bir parçası haline gelmiştir...'
  },
  {
    id: 2,
    title: 'Madencilik Nasıl Yapılır?',
    excerpt: 'WM Coin madenciliği için gerekli adımlar ve ipuçları...',
    image: 'https://via.placeholder.com/300x200',
    date: '10 Mart 2024',
    tags: ['Madencilik', 'Rehber', 'WM Coin'],
    content: 'WM Coin madenciliği, kullanıcıların ağa katkıda bulunmasını ve ödül kazanmasını sağlayan önemli bir süreçtir. Bu rehberde, madencilik sürecinin tüm detaylarını bulabilirsiniz...'
  },
  {
    id: 3,
    title: 'Yeni Özellikler',
    excerpt: 'WM platformuna eklenen yeni özellikler ve güncellemeler...',
    image: 'https://via.placeholder.com/300x200',
    date: '5 Mart 2024',
    tags: ['Güncelleme', 'Yeni Özellikler', 'Platform'],
    content: 'WM platformu sürekli gelişiyor ve yeni özellikler ekliyor. Bu yazıda, son güncellemelerle birlikte gelen yeni özellikleri detaylı olarak inceleyebilirsiniz...'
  },
];

const BlogScreen = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const [remoteBlogPosts, setRemoteBlogPosts] = React.useState<BlogPost[] | null>(null);

  React.useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('https://www.api.world-moneys.com/public/blogs');
        const data = await response.json();

        // Transform the remote data to match our BlogPost interface
        const transformedPosts: BlogPost[] = data.data.map((post: any) => ({
          id: post.id,
          title: post.title,
          excerpt: post.desc,
          image: post.photo.replace(/\\/g, ''),
          date: new Date(post.created_at).toLocaleDateString('tr-TR'),
          tags: JSON.parse(post.tag),
          content: post.detail
        }));

        setRemoteBlogPosts(transformedPosts);
      } catch (error) {
        console.error('Failed to fetch blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, []);



  const handlePostPress = (post: BlogPost) => {
    router.push({
      pathname: '/blog/[id]',
      params: { id: post.id }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{t('blog')}</Text>

      {(remoteBlogPosts ?? localBlogPosts).map((post) => (
        <TouchableOpacity
          key={post.id}
          style={styles.postCard}
          onPress={() => handlePostPress(post)}
        >
          <Image source={{ uri: post.image }} style={styles.postImage} />
          <View style={styles.postContent}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postExcerpt}>{post.excerpt}</Text>
            <View style={styles.tagsContainer}>
              {post.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.postDate}>{post.date}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    color: '#000',
  },
  postCard: {
    margin: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  postContent: {
    padding: 15,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#000',
  },
  postExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  postDate: {
    fontSize: 12,
    color: '#999',
  },
});

export default BlogScreen; 
