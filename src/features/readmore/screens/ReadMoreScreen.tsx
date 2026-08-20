import React, { useMemo } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Share } from "react-native";
import { useDetailedNews } from "../../news/hooks/DetailedNews";
import { useThemeStore } from "../../../store/ThemeStore";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useBookmarkStore } from "../../../store/BookmarkStore";
// TEMPORARILY COMMENTED OUT FOR BUILD - WILL RESTORE LATER
// import { googleLogin } from "../../services/auth/googleAuth";


const ReadMore = (props: any) =>{
    const {id} = props?.route?.params || {};
    const {data, loading, error} = useDetailedNews(id);
    const theme = useThemeStore((s:any) => s.theme);
    const navigation = useNavigation();
    const { toggleBookmark, isBookmarked } = useBookmarkStore();

    const article = useMemo(() => {
      if (Array.isArray(data)) {
        return data[0];
      }
      return data;
    }, [data]);

    const bookmarked = !!(article && article._id) && isBookmarked(article._id);

    const handleShare = async () => {
      if (!article) return;
      try {
        await Share.share({
          title: article.title,
          message: `${article.title}\n\n${article.summary || ""}\n\nRead more: https://www.thenobiasmedia.com/article/${article._id}`,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    };

    if (!id) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16, backgroundColor: theme === "light" ? "#fff" : "#000" }}>
          <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>Missing article id.</Text>
        </View>
      );
    }

    if (loading) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme === "light" ? "#fff" : "#000" }}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16, backgroundColor: theme === "light" ? "#fff" : "#000" }}>
          <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>Failed to load article.</Text>
        </View>
      );
    }

    if (!article) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16, backgroundColor: theme === "light" ? "#fff" : "#000" }}>
          <Text style={{ color: theme === "light" ? "#000" : "#fff" }}>Article not found.</Text>
        </View>
      );
    }

    return (
      <View style={{ flex: 1, backgroundColor: theme === "light" ? "#fff" : "#000" }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={{ paddingHorizontal: 16, paddingTop: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <TouchableOpacity onPress={() => (navigation as any).goBack()} style={{ padding: 8 }}>
              <Icon name="arrow-back" size={22} color={theme === "light" ? "#000" : "#fff"} />
            </TouchableOpacity>

            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={handleShare} style={{ padding: 8, marginRight: 6 }}>
                <Icon name="share-social-outline" size={22} color={theme === "light" ? "#000" : "#fff"} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => toggleBookmark(article)} style={{ padding: 8 }}>
                <Icon name={bookmarked ? "bookmark" : "bookmark-outline"} size={22} color={theme === "light" ? "#000" : "#fff"} />
              </TouchableOpacity>
            </View>
          </View>

          {!!article.imageUrl && (
            <Image source={{ uri: article.imageUrl }} style={{ width: "100%", height: 240, marginTop: 12 }} resizeMode="cover" />
          )}

          <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
            <Text style={{ color: "#007AFF", fontSize: 12, fontWeight: "600" }}>{String(article?.category || "").toUpperCase()}</Text>
            <Text style={{ color: theme === "light" ? "#000" : "#fff", fontSize: 22, fontWeight: "700", marginTop: 8 }}>
              {article.title}
            </Text>
            {!!article.createdAt && (
              <Text style={{ color: theme === "light" ? "#666" : "#aaa", fontSize: 12, marginTop: 6 }}>
                {new Date(article.createdAt).toDateString()}
              </Text>
            )}

            {!!article.summary && (
              <Text style={{ color: theme === "light" ? "#333" : "#ddd", fontSize: 15, marginTop: 12, lineHeight: 22 }}>
                {article.summary}
              </Text>
            )}

            {!!article.content && (
              <Text style={{ color: theme === "light" ? "#000" : "#fff", fontSize: 16, marginTop: 14, lineHeight: 24 }}>
                {article.content}
              </Text>
            )}

            <TouchableOpacity
              onPress={() => (navigation as any).navigate("Sources", { id: article._id })}
              style={{ marginTop: 20, backgroundColor: "#007AFF", borderRadius: 12, paddingVertical: 12, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>News Sources</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
}



export default ReadMore; 
