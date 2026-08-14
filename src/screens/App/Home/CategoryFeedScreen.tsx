import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator, FlatList, RefreshControl, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getNewsByCategoryPaged } from "../../../api/news";
import NewsCard from "../../../components/news/NewsCard";
import TopicTabs from "../../../components/news/TopicTabs";
import { useThemeStore } from "../../../store/ThemeStore";

export default function CategoryFeedScreen({ route }) {
  const { topic } = route.params;
  const theme = useThemeStore((s:any) => s.theme);

  const navigation = useNavigation();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const normalizedCategory = String(topic || "").toLowerCase();

  const fetchCategoryNews = useCallback(
    async ({ pageToLoad, replace }: { pageToLoad: number; replace: boolean }) => {
      try {
        setError(null);
        if (replace) {
          setLoading(true);
        }
        const res = await getNewsByCategoryPaged(normalizedCategory, pageToLoad);
        const nextArticles = res?.articles || [];
        const nextTotalPages = res?.totalPages || 1;

        setTotalPages(nextTotalPages);
        setPage(res?.currentPage || pageToLoad);

        setArticles((prev) => (replace ? nextArticles : [...prev, ...nextArticles]));
      } catch (e) {
        console.log("Fetch error:", e);
        setError("Failed to load articles");
        if (replace) {
          setArticles([]);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [normalizedCategory]
  );

  useEffect(() => {
    setArticles([]);
    setPage(1);
    setTotalPages(1);
    fetchCategoryNews({ pageToLoad: 1, replace: true });
  }, [fetchCategoryNews, topic]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategoryNews({ pageToLoad: 1, replace: true });
  };

  const loadMore = () => {
    if (loading) return;
    if (page >= totalPages) return;
    fetchCategoryNews({ pageToLoad: page + 1, replace: false });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme === "light" ? "#fff" : "#000" }}>
      <TopicTabs
        selected={topic}
        onPress={(nextTopic) => {
          if (nextTopic === "All") {
            (navigation as any).goBack();
            return;
          }
          (navigation as any).setParams({ topic: nextTopic });
        }}
      />

      {loading && page === 1 ? (
        <View style={{ padding: 16 }}>
          <ActivityIndicator size="large" />
        </View>
      ) : error && articles.length === 0 ? (
        <View style={{ padding: 16 }}>
          <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item) => String(item?._id)}
          renderItem={({ item }) => (
            <NewsCard
              article={item}
              origin="ReadMore"
              theme={theme}
              title="Read More"
              secondaryTitle="News Sources"
              onPress={() => (navigation as any).navigate('ReadMore', { id: item?._id, origin: "ReadMore" })}
              onSecondaryPress={() => (navigation as any).navigate('Sources', { id: item?._id })}
            />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}
