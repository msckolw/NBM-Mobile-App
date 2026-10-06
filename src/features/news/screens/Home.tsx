import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import NewsCard from '../components/NewsCard';
import {useTheme} from '../../../context/ThemeContext';
import TopicTabs from '../components/TopicTabs';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import useNews from '../hooks/useNews';
import SkeletonCard from '../components/SkeletonCard';
import { logEvent } from '../../../services/monitoring/analytics';
import { AnalyticsEvents } from '../../../services/monitoring/analyticsEvents';
import { devLog } from "../../../utils/devLog";
import FastImage from '@d11/react-native-fast-image';



const Home = () => {
  devLog(
    `⏱️ [HOME] Component render | +${(
      Date.now() - globalThis.__APP_START_TIME__
    ).toFixed(0)}ms`,
  );
  // const insets = useSafeAreaInsets();
  const {theme, isThemeReady} = useTheme();
  const insets = useSafeAreaInsets();
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

  console.log("Error Fetching nwes", error)
  

  devLog(
    'THEME:',
    theme,
    'READY:',
    isThemeReady,
  );
  
 

  // const safeArticles = (articles || []).filter(item => item && item?._id);


  const renderSkeletonPlaceholder = useCallback(
    () => <SkeletonCard />,
    [],
  );


  useEffect(() => {
    if (!articles.length) {
      return;
    }
  
    const imageUrls = articles
      .slice(0, 5)
      .map(article => article?.imageUrl)
      .filter(Boolean);
  
    imageUrls.forEach(url => {
      FastImage.preload([
        {
          uri: url,
          priority: FastImage.priority.high,
        },
      ]);
    });
  }, [articles]);


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



  // if (loading && page === 1) {
  //   return (
  //     <SafeAreaView
  //     edges={['top']}
  //     style={{
  //       flex: 1,
  //       backgroundColor: theme === 'light' ? '#fff' : '#000',
  //     }}
  //   >
  
  //       <TopicTabs theme={theme} selected={selectedTopic} onPress={() => {}} />

  //       <FlatList
  //         data={[1, 2, 3, 4, 5]}
  //         keyExtractor={item => item.toString()}
  //         renderItem={renderSkeletonPlaceholder}
  //         showsVerticalScrollIndicator={false}
  //       />
  //     </SafeAreaView>
  //   );
  // }

  

  if (!loading && error && articles.length === 0) {
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
    fontSize: 20,
    fontWeight: '700',
    color: theme === 'light' ? '#111' : '#fff',
    marginBottom: 8,
  }}>
  {error === 'NO_NETWORK'
    ? 'No internet connection'
    : 'Unable to load news'}
</Text>

<Text
  style={{
    fontSize: 15,
    color: theme === 'light' ? '#666' : '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  }}>
  {error === 'NO_NETWORK'
    ? 'Please check your internet connection and try again.'
    : 'Something went wrong while loading the latest news.'}
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
    <View
    style={{
      flex: 1,
      paddingTop: insets.top,
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
  data={loading && page === 1 ? [1, 2, 3, 4, 5] : articles}
  keyExtractor={(item, index) =>
    loading && page === 1 ? `skeleton-${index}` : item._id.toString()
  }
  renderItem={
    loading && page === 1
      ? renderSkeletonPlaceholder
      : renderItem
  }
  onEndReached={loading ? undefined : loadMore}
  onRefresh={onRefresh}
  refreshing={refreshing}
  initialNumToRender={5}
  maxToRenderPerBatch={10}
  windowSize={5}
  // removeClippedSubviews
/>
    </View>
  );
};

export default Home;
