import { useEffect, useState } from "react";
import { View, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { getNews } from "../../../api/news";
import NewsCard from "../../../components/news/NewsCard";

const { height } = Dimensions.get("window");

export default function SwipeFeedScreen() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  console.log("ArticlesFromSwipe:", articles)

  const loadNews = async () => {
    try {
      const response = await getNews(page);
      console.log("API_RESPONSE:", response);
      setArticles(response.articles || []);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.log("ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
  }, [page]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage((p) => p + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = (item:any)=> {
    return (
        <NewsCard article = {item}/>
    )
}

  return (
    <FlatList
      data={articles}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item._id}
      renderItem = {renderItem}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
}
