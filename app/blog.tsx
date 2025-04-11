import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useLocalization } from "@localization/i18n";
import { useRouter } from "expo-router";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  tags: string[];
  content: string;
}

const BlogScreen = () => {
  const { t } = useLocalization();
  const router = useRouter();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const fetchBlogPosts = async (pageToFetch: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.api.world-moneys.com/public/blogs?page=${pageToFetch}`,
      );
      const json = await response.json();

      const transformed = json.data.map((post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.desc,
        image: post.photo.replace(/\\/g, ""),
        date: new Date(post.created_at).toLocaleDateString("tr-TR"),
        tags: JSON.parse(post.tag),
        content: post.desc,
      }));

      setPosts((prev) => [...prev, ...transformed]);
      setPage(json.current_page + 1);
      setHasMore(json.next_page_url !== null);
    } catch (err) {
      console.error("Failed to load posts", err);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchBlogPosts(1);
  }, []);

  const handlePostPress = (post: BlogPost) => {
    router.push({
      pathname: "/blog/[id]",
      params: { id: post.id },
    });
  };

  const renderItem = ({ item }: { item: BlogPost }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.postCard}
      onPress={() => handlePostPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <View style={styles.postContent}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postExcerpt}>{item.excerpt}</Text>
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.postDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      onEndReached={() => fetchBlogPosts(page)}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator size="small" /> : null}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  postCard: {
    margin: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  postContent: {
    padding: 15,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  postExcerpt: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: "#666",
  },
  postDate: {
    fontSize: 12,
    color: "#999",
  },
});

export default BlogScreen;
