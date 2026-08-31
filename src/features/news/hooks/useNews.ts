import { useCallback, useEffect, useState } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { getNews } from '../../../api/news';
import { recordError } from '../../../services/monitoring/crashlytics';

const useNews = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (pageNumber: number) => {
    try {
      setError(null);

      const res = await getNews(pageNumber);

      console.log('NEWS API RESPONSE:', res);

      const sanitized = (res?.articles || []).filter(
        item => item && item?._id,
      );

      if (pageNumber === 1) {
        setArticles(sanitized);
      } else {
        setArticles(prev => [...prev, ...sanitized]);
      }

      setTotalPages(res?.totalPages || 1);
    } catch (error) {
      console.log('Error fetching news:', error);
      setError('Failed to load news');
      recordError(
        error instanceof Error
          ? error
          : new Error('Unknown article fetch error'),
        'Failed to fetch articles',)
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(1);
  }, [fetchNews]);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      setPage(1);
      await fetchNews(1);

      ReactNativeHapticFeedback.trigger('impactLight');
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    if (loading) return;

    if (page >= totalPages) return;

    const nextPage = page + 1;

    setPage(nextPage);
    fetchNews(nextPage);
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
  };
};

export default useNews;