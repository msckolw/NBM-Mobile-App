import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import NewsCard from '../components/NewsCard';
import {useTheme} from '../../../context/ThemeContext';
import TopicTabs from '../components/TopicTabs';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import useNews, { NewsError } from '../hooks/useNews';
import SkeletonCard from '../components/SkeletonCard';
import { logEvent } from '../../../services/monitoring/analytics';
import { AnalyticsEvents } from '../../../services/monitoring/analyticsEvents';
import { devLog } from "../../../utils/devLog";
import FastImage from '@d11/react-native-fast-image';
import ConfirmationModal from '../../../components/common/ConfirmationModal';




  const getNewsErrorMessage = (error: NewsError) => {
    switch (error) {
      case 'NO_NETWORK':
        return {
          title: 'No Internet Connection',
          message: 'Please Check your internet connection and try again.',
        };
  
      case 'TIMEOUT':
        return {
          title: 'Request Timed Out',
          message: 'The request took too long. Please try again.',
        };
  
      case 'SERVER_ERROR':
        return {
          title: 'Service Temporarily Unavailable',
          message: 'We couldn’t load the latest news. Please try again shortly.',
        };
  
      case 'CONNECTION_ERROR':
        return {
          title: 'Connection Problem',
          message: 'We couldn’t connect to the news service. Please try again.',
        };
  
      case 'FAILED':
        return {
          title: 'Unable to Load News',
          message: 'Something went wrong while loading news. Please try again.',
        };
    }
  };


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
  const [showNetworkModal, setShowNetworkModal] = useState(false);

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
  } = useNews(selectedTopic);;

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







  const handleArticlePress = useCallback(
    (id: string, category?: string) => {
      logEvent(AnalyticsEvents.ARTICLE_VIEWED, {
        article_id: id,
        source: 'home_feed',
        origin: 'Home',
      });
  
      navigation.navigate('ReadMore', {
        id,
        origin: 'ReadMore',
        category,
      });
    },
    [navigation],
  );


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
      onPress={() => handleArticlePress(item._id, item.category)}
      onSecondaryPress={() => handleSourcesPress(item._id)}
    />
    );
  }, [theme, handleArticlePress, handleSourcesPress])
  

  if (!loading && error && articles.length === 0) {
    const errorDetails = getNewsErrorMessage(error);
    return (
      <SafeAreaView
        edges={['top']}
        style={{
          flex: 1,
          backgroundColor: theme === 'light' ? '#fff' : '#000',
        }}>
        <ConfirmationModal
          visible={true}
          title={errorDetails.title}
          message={errorDetails.message}
          confirmText="Retry"
          cancelText="Cancel"
          onCancel={() => {
            // Close the modal and return to the normal Home screen
            setShowNetworkModal(false);
          }}
          onConfirm={() => {
            setShowNetworkModal(false);
            onRefresh();
          }}
        />
      </SafeAreaView>
    );
  }

  // toggleBookmark(articles);

  return (
    <View
    style={{
      flex: 1,
      // paddingTop: insets.top,
      backgroundColor: theme === 'light' ? '#fff' : '#000',
    }}>
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
  ListEmptyComponent={
    !loading && !refreshing && !error ? (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No news available
        </Text>
  
        <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
          There are no articles in this category yet. Try another topic.
        </Text>
      </View>
    ) : null
  }
/>
<ConfirmationModal
  visible={showNetworkModal}
  title="No Internet Connection"
  message="Please check your internet connection and try again."
  confirmText="Retry"
  cancelText="Cancel"
  onCancel={() => setShowNetworkModal(false)}
  onConfirm={() => {
    setShowNetworkModal(false);
    onRefresh();
  }}
/>
    </View>
  );
};

export default Home;


export const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
})