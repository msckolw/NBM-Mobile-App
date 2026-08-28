import React, { useState } from 'react';
import { View, ActivityIndicator, FlatList } from 'react-native';
import NewsCard from '../components/NewsCard';
import { useThemeStore } from '../../../store/ThemeStore';
import TopicTabs from '../components/TopicTabs';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SafeAreaView } from 'react-native-safe-area-context';
import useNews from '../hooks/useNews';
import { useBookmarkStore } from '../../../store/BookmarkStore';
import SkeletonCard from '../components/SkeletonCard';

const Home = () => {
  // const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    loading,
    articles,
    totalPages,
    error,
    refreshing,
    onRefresh,
    loadMore,
    page,
    loadingMore
  } = useNews();
  const toggleBookmark = useBookmarkStore(s => s.toggleBookmark);
  const theme = useThemeStore((s: any) => s.theme);

  const [selectedTopic, setSelectedTopic] = useState('All');

  console.log('NewsFromnbackend', loading, articles, totalPages, error);
  console.log('themetoggle:', theme);

  const safeArticles = (articles || []).filter(item => item && item?._id);

  if (loading && page === 1) {
    return (
      <SafeAreaView
        edges={['top']}
        style={{
          flex: 1,
          backgroundColor: theme === 'light' ? '#fff' : '#000',
        }}
      >
        <TopicTabs selected={selectedTopic} onPress={() => {}} />

        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={item => item.toString()}
          renderItem={() => <SkeletonCard />}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  const renderItem = (item: any) => {
    console.log('ItemId:', item?.item?._id);
    return (
      <NewsCard
        article={item}
        origin="Home"
        title="Read More"
        secondaryTitle="News Sources"
        theme={theme}
        onPress={() =>
          navigation.navigate('ReadMore', {
            id: item?.item?._id,
            origin: 'ReadMore',
          })
        }
        onSecondaryPress={() =>
          navigation.navigate('Sources', { id: item?.item?._id })
        }
      />
    );
  };

  // toggleBookmark(articles);

  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}
    >
      {/* Header must NOT use flex */}
      <TopicTabs
        selected={selectedTopic}
        onPress={topic => {
          ReactNativeHapticFeedback.trigger('impactLight');
          setSelectedTopic(topic);
          if (topic === 'All') {
            return;
          }
          navigation.navigate('CategoryFeed', { topic });
        }}
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        data={safeArticles.filter(item => item)}
        keyExtractor={item => item?._id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onRefresh={onRefresh}
        refreshing={refreshing}
        // contentContainerStyle={{
        //   paddingBottom: insets.bottom + 70,
        // }}
      />
    </SafeAreaView>
  );
};

export default Home;
