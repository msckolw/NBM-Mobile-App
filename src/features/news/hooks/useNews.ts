import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Alert } from 'react-native';
import { getNews } from '../../../api/news';
import NewsCard from '../components/NewsCard';
import SkeletonCard from '../components/SkeletonCard';
import { useBookmarkStore } from '../../../store/BookmarkStore';
import { useThemeStore } from '../../../store/ThemeStore';
import TopicTabs from '../components/TopicTabs';
import { useNavigation } from '@react-navigation/native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const useNews = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('All');

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  const fetchNews = async (pageNumber: number) => {
    try {
      // const res = await getNews(page);
      const res = await getNews(pageNumber);
      const sanitized = (res.articles || []).filter(Boolean);
      if (pageNumber > 1) {
        setLoadingMore(true);
      }

      if (pageNumber === 1) {
        setArticles(sanitized);
      } else {
        setArticles(prev => [...prev, ...sanitized]);
      }

      setTotalPages(res.totalPages);
      console.log('res.articles', res.totalPages);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);

      if (pageNumber > 1) {
        setLoadingMore(false);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setPage(1);

    try {
      const res = await getNews(1);
      setArticles(res.articles || []);
    } catch (err) {
      console.log(err);
    }
    ReactNativeHapticFeedback.trigger('impactLight');
    setRefreshing(false);
  };

  const loadMore = () => {
    console.log('loadingMore');
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  return {
    articles,
    loading,
    error,
    totalPages,
    refreshing,
    page,
    onRefresh,
    loadMore,
    loadingMore
  };
};

export default useNews;
