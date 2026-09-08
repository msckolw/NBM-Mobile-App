import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator, FlatList, TouchableOpacity, Text } from 'react-native';
import NewsCard from '../components/NewsCard';
import { useThemeStore } from '../../../store/ThemeStore';
import TopicTabs from '../components/TopicTabs';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SafeAreaView } from 'react-native-safe-area-context';
import useNews from '../hooks/useNews';
import { useBookmarkStore } from '../../../store/BookmarkStore';
import SkeletonCard from '../components/SkeletonCard';
import { logEvent } from '../../../services/monitoring/analytics';
import { AnalyticsEvents } from '../../../services/monitoring/analyticsEvents';

const Home = () => {
  // const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    loading,
    loadingMore,
    articles,
    totalPages,
    error,
    refreshing,
    onRefresh,
    loadMore,
    page,
  } = useNews();
  const toggleBookmark = useBookmarkStore(s => s.toggleBookmark);
  const theme = useThemeStore((s: any) => s.theme);
  
  const [selectedTopic, setSelectedTopic] = useState('All');
  const firstArticleRendered = useRef(false);

  const safeArticles = (articles || []).filter(item => item && item?._id);

  useEffect(() => {
    console.log(
      `Home : Mounted | +${(
        Date.now() - globalThis.__APP_START_TIME__
      ).toFixed(0)}ms`,
    );
  }, []);

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

  if (!loading && error && safeArticles.length === 0) {
    return (
      <SafeAreaView
        edges={['top']}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme === 'light' ? '#fff' : '#000',
        }}
      >
        <View
  style={{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  }}
>
  <Text
    style={{
      fontSize: 18,
      fontWeight: '600',
      color: theme === 'light' ? '#111' : '#fff',
      marginBottom: 8,
    }}
  >
    Unable to load news
  </Text>

  <Text
    style={{
      fontSize: 14,
      textAlign: 'center',
      color: theme === 'light' ? '#666' : '#aaa',
      marginBottom: 20,
    }}
  >
    Something went wrong while loading the latest news.
  </Text>

  <TouchableOpacity
    onPress={onRefresh}
    style={{
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: '#007AFF',
    }}
  >
    <Text
      style={{
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
      }}
    >
      Try Again
    </Text>
  </TouchableOpacity>
</View>
      </SafeAreaView>
    );
  }

  const renderItem = ({item}: {item: any}) => {

    if (!firstArticleRendered.current) {
      firstArticleRendered.current = true;
    
      console.log(
        `TTI : First NewsCard rendered | +${(
          Date.now() - globalThis.__APP_START_TIME__
        ).toFixed(0)}ms`,
      );
    }
  
    const handleArticlePress = () => {
      // 🟢 ANALYTICS
      logEvent(AnalyticsEvents.ARTICLE_VIEWED, {
        article_id: item._id,
        source: 'home_feed',
        origin: 'Home',
      });
  
      navigation.navigate('ReadMore', {
        id: item._id,
        origin: 'ReadMore',
      });
    };

    
  
    return (
      <NewsCard
        article={item}
        origin="Home"
        title="Read More"
        secondaryTitle="News Sources"
        theme={theme}
        onPress={handleArticlePress}
        onSecondaryPress={() =>
          navigation.navigate('Sources', {
            id: item._id,
          })
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
  theme={theme}
  onPress={topic => {
    ReactNativeHapticFeedback.trigger('impactLight');

    setSelectedTopic(topic);
    
    logEvent('category_selected', {
      category: topic,
    });

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
