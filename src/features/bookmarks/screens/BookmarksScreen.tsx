import { FlatList, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBookmarkStore } from "../../../store/BookmarkStore";
import NewsCard from "../../news/components/NewsCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useAppSelector} from '../../../store/hooks';

export default function BookmarksScreen() {
  // const items = useBookmarkStore((s) => s.items);
  const items = useAppSelector(state => state.bookmarks.items);
  const navigation = useNavigation();
  const {theme} = useTheme();


  return (
    <SafeAreaView
    edges={['top']}
    style={{
      flex: 1,
      backgroundColor: theme === 'light' ? '#fff' : '#000',
    }}
  >
      {/* Header must NOT use flex */}
      {/* <TopicTabs
        // selected={selectedTopic}
        // onPress={topic => {
        //   ReactNativeHapticFeedback.trigger('impactLight');
        //   setSelectedTopic(topic);
        //   if (topic === 'All') {
        //     return;
        //   }
        //   navigation.navigate('CategoryFeed', { topic });
        // }}
        onPress = {()=>devLog("dawd")}
      /> */}
   <FlatList
  data={items}
  keyExtractor={(item) => item._id}
  contentContainerStyle={items.length === 0 ? {flex: 1} : undefined}
  renderItem={({item}) => (
    <NewsCard
      onPress={() =>
        (navigation as any).navigate('ReadMore', {id: item._id})
      }
      title="Read More"
      origin="ReadMore"
      article={item}
      theme={theme}
    />
  )}
  ListEmptyComponent={
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: theme === 'dark' ? '#1A1A1A' : '#F5F5F5',
          },
        ]}>
        <Ionicons
          name="bookmark-outline"
          size={34}
          color={theme === 'dark' ? '#fff' : '#222'}
        />
      </View>
  
      <Text
        style={[
          styles.emptyTitle,
          {color: theme === 'dark' ? '#fff' : '#111'},
        ]}>
        No bookmarks yet
      </Text>
  
      <Text
        style={[
          styles.emptyMessage,
          {color: theme === 'dark' ? '#aaa' : '#666'},
        ]}>
        Articles you save will appear here.
      </Text>
    </View>
  }
/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});