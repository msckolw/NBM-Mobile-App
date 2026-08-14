import { FlatList, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBookmarkStore } from "../../../store/BookmarkStore";
import NewsCard from "../../../components/news/NewsCard";

export default function BookmarksScreen() {
  const items = useBookmarkStore((s) => s.items);
  const navigation = useNavigation();

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <NewsCard
          onPress={() =>
            (navigation as any).navigate("ReadMore", { id: item._id })
          }
          title="Read More"
          origin="ReadMore"
          article={item}
          theme="light"
        />
      )}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No bookmarks yet</Text>
          <Text style={styles.emptyMessage}>
            Articles you save will appear here.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 200,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
     color: "#666",
  },
  emptyMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});