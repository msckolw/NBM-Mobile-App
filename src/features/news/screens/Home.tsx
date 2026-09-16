import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import NewsCard from '../components/NewsCard';
import {useTheme} from '../../../context/ThemeContext';
import TopicTabs from '../components/TopicTabs';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SafeAreaView } from 'react-native-safe-area-context';
import useNews from '../hooks/useNews';
import SkeletonCard from '../components/SkeletonCard';
import { logEvent } from '../../../services/monitoring/analytics';
import { AnalyticsEvents } from '../../../services/monitoring/analyticsEvents';
import { devLog } from "../../../utils/devLog";



const Home = () => {
  devLog(
    `⏱️ [HOME] Component render | +${(
      Date.now() - globalThis.__APP_START_TIME__
    ).toFixed(0)}ms`,
  );
  // const insets = useSafeAreaInsets();
  const {theme, isThemeReady} = useTheme();
  const [selectedTopic, setSelectedTopic] = useState('All');
  const firstArticleRendered = useRef(false);

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
  

  devLog(
    'THEME:',
    theme,
    'READY:',
    isThemeReady,
  );
  
 

  const safeArticles = (articles || []).filter(item => item && item?._id);


  const renderSkeletonPlaceholder = useCallback(
    () => <SkeletonCard />,
    [],
  );


  useEffect(() => {
    devLog(
      `Home : Mounted | +${(
        Date.now() - globalThis.__APP_START_TIME__
      ).toFixed(0)}ms`,
    );
  }, []);




  const handleArticlePress = useCallback((id: string) => {
    logEvent(AnalyticsEvents.ARTICLE_VIEWED, {
      article_id: id,
      source: 'home_feed',
      origin: 'Home',
    });
  
    navigation.navigate('ReadMore', {
      id,
      origin: 'ReadMore',
    });
  }, [navigation]);


  const handleSourcesPress = useCallback(
    (id: string) => {
      navigation.navigate('Sources' as never, {
        id,
      } as never);
    },
    [navigation],
  );

  

  const renderItem = useCallback(({item}: {item: any})=>{
    if (!firstArticleRendered.current) {
      firstArticleRendered.current = true;
    
      // devLog(
      //   `TTI : First NewsCard rendered | +${(
      //     Date.now() - globalThis.__APP_START_TIME__
      //   ).toFixed(0)}ms`,
      // );
    }
    return (
      <NewsCard
      article={item}
      origin="Home"
      title="Read More"
      secondaryTitle="News Sources"
      theme={theme}
      onPress={() => handleArticlePress(item._id)}
      onSecondaryPress={() => handleSourcesPress(item._id)}
    />
    );
  }, [theme, handleArticlePress, handleSourcesPress])



  if (loading && page === 1) {
    return (
      <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}
    >
  
        <TopicTabs theme={theme} selected={selectedTopic} onPress={() => {}} />

        <FlatList
          data={[1, 2, 3, 4, 5]}
          keyExtractor={item => item.toString()}
          renderItem={renderSkeletonPlaceholder}
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
        data={safeArticles}
        keyExtractor={item => item?._id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onRefresh={onRefresh}
        refreshing={refreshing}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        // contentContainerStyle={{
        //   paddingBottom: insets.bottom + 70,
        // }}
      />
    </SafeAreaView>
  );
};

export default Home;
