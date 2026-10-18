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
import Ionicons from 'react-native-vector-icons/Ionicons';




const getNewsErrorMessage = (error: NewsError | null | undefined) => {
  switch (error) {
    case 'NO_NETWORK':
      return {
        title: 'No Internet Connection',
        message: 'Please check your internet connection and try again.',
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

    default:
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
  const [modalError, setModalError] = useState<NewsError | null>(null);

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

  
  // const safeArticles = (articles || []).filter(item => item && item?._id);


  const renderSkeletonPlaceholder = useCallback(
    () => <SkeletonCard />,
    [],
  );
  const showInitialSkeletons =
  loading && page === 1 && articles.length === 0;
  const errorDetails = getNewsErrorMessage(modalError);




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
    if (loading || articles.length > 0 || !error) {
      return;
    }
  
    setModalError(error);
    setShowNetworkModal(true);
  }, [loading, articles.length, error]);





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
  

  // if (!loading && error && articles.length === 0) {
  //   const errorDetails = getNewsErrorMessage(error);
  
  //   return (
  //     <SafeAreaView
  //       edges={['top']}
  //       style={{
  //         flex: 1,
  //         backgroundColor: theme === 'light' ? '#fff' : '#000',
  //       }}>
  //       <View
  //         style={{
  //           flex: 1,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           paddingHorizontal: 24,
  //         }}>
  //         <Text
  //           style={{
  //             fontSize: 20,
  //             fontWeight: '700',
  //             color: theme === 'light' ? '#111' : '#fff',
  //             marginBottom: 8,
  //             textAlign: 'center',
  //           }}>
  //           {errorDetails.title}
  //         </Text>
  
  //         <Text
  //           style={{
  //             fontSize: 15,
  //             color: theme === 'light' ? '#666' : '#aaa',
  //             textAlign: 'center',
  //             marginBottom: 20,
  //           }}>
  //           {errorDetails.message}
  //         </Text>
  
  //         <TouchableOpacity
  //           onPress={onRefresh}
  //           style={{
  //             paddingHorizontal: 24,
  //             paddingVertical: 12,
  //             borderRadius: 8,
  //             backgroundColor: '#007AFF',
  //           }}>
  //           <Text
  //             style={{
  //               color: '#fff',
  //               fontSize: 15,
  //               fontWeight: '600',
  //             }}>
  //             Retry
  //           </Text>
  //         </TouchableOpacity>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

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
  data={showInitialSkeletons ? [1, 2, 3, 4, 5] : articles}
  keyExtractor={(item, index) =>
    showInitialSkeletons ? `skeleton-${index}` : item._id.toString()
  }
  renderItem={
    showInitialSkeletons
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
      <View
        style={styles.emptyContainer}
        accessibilityRole="text"
        accessibilityLabel="No news available in this category"
      >
        <Ionicons
          name="newspaper-outline"
          size={40}
          color={theme.textSecondary}
          accessibilityElementsHidden
        />
  
        <Text style={[styles.emptyTitle, {color: theme.text}]}>
          No stories yet
        </Text>
  
        <Text
          style={[
            styles.emptyDescription,
            {color: theme.textSecondary},
          ]}
        >
          There are no articles in this category right now.
          Explore another topic to discover more stories.
        </Text>
      </View>
    ) : null
  }
  
/>
<ConfirmationModal
  visible={showNetworkModal}
  title={errorDetails.title}
  message={errorDetails.message}
  confirmText="Retry"
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
  flexGrow: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 32,
  paddingVertical: 64,
},

emptyTitle: {
  fontSize: 18,
  fontWeight: '600',
  textAlign: 'center',
  marginTop: 16,
  marginBottom: 8,
},

emptyDescription: {
  fontSize: 14,
  lineHeight: 21,
  textAlign: 'center',
  maxWidth: 300,
},
imageContainer: {
  paddingHorizontal: 16,
},
image: {
  width: '100%',
  height: 220,
  resizeMode: 'cover',
  borderRadius: 12,
},

})