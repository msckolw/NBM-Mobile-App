import { useCallback, useEffect, useRef, useState } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { getNews } from '../../../api/news';
import { recordError } from '../../../services/monitoring/crashlytics';
import { devLog } from '../../../utils/devLog';

const useNews = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Prevent overlapping requests.
  const requestInFlight = useRef(false);
  console.log("requestInFlight", requestInFlight)

  const fetchNews = useCallback(
    async (pageNumber: number, retryCount = 0) => {
      if (requestInFlight.current) {
        return;
      }
  
      requestInFlight.current = true;
  
      // Measure TTI
      const requestStart = Date.now();
  
      devLog(
        `Request started | page=${pageNumber} | retry=${retryCount} | +${(
          requestStart - globalThis.__APP_START_TIME__
        ).toFixed(0)}ms`,
      );
  
      try {
        setError(null);
  
        const res = await getNews(pageNumber);
  
        const responseTime = Date.now();
  
        devLog(
          `News API response | +${(
            responseTime - globalThis.__APP_START_TIME__
          ).toFixed(0)}ms | API=${(
            responseTime - requestStart
          ).toFixed(0)}ms`,
        );
  
        devLog('NEWS API RESPONSE:', res);
  
        const sanitized = (res?.articles || []).filter(
          item => item && item?._id,
        );
  
        if (pageNumber === 1) {
          setArticles(sanitized);
        } else {
          setArticles(prev => [...prev, ...sanitized]);
        }
  
        devLog(
          `News Articles state queued | count=${sanitized.length} | +${(
            Date.now() - globalThis.__APP_START_TIME__
          ).toFixed(0)}ms`,
        );
  
        setPage(pageNumber);
        setTotalPages(res?.totalPages || 1);
      } catch (error) {
        devLog(
          `Error fetching news | page=${pageNumber} | retry=${retryCount}`,
          error,
        );
  
        // Retry only the initial news request.
        const maxRetries = 2;
  
        if (pageNumber === 1 && retryCount < maxRetries) {
          const retryDelay = 1000 * Math.pow(2, retryCount);
  
          devLog(
            `Retrying news request | attempt=${retryCount + 1}/${maxRetries} | delay=${retryDelay}ms`,
          );
  
          requestInFlight.current = false;
  
          await new Promise(resolve =>
            setTimeout(resolve, retryDelay),
          );
  
          return fetchNews(pageNumber, retryCount + 1);
        }
  
        setError('Failed to load news');
  
        recordError(
          error instanceof Error
            ? error
            : new Error('Unknown article fetch error'),
          'Failed to fetch articles',
        );
      } finally {
        requestInFlight.current = false;
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    console.log('News is fetching');
    fetchNews(1);
    console.log('News is fetched');
  }, [fetchNews]);

  //Refresh News

  const onRefresh = useCallback(async () => {
    if (requestInFlight.current) {
      return;
    }

    setRefreshing(true);

    try {
      await fetchNews(1);

      ReactNativeHapticFeedback.trigger('impactLight');
    } finally {
      setRefreshing(false);
    }
  }, [fetchNews]);

  //Load More

  const loadMore = useCallback(() => {
    if (requestInFlight.current) {
      return;
    }

    if (page >= totalPages) {
      return;
    }

    const nextPage = page + 1;

    setLoadingMore(true);

    fetchNews(nextPage);
  }, [page, totalPages, fetchNews]);

  return {
    articles,
    loading,
    loadingMore,
    error,
    totalPages,
    refreshing,
    page,
    onRefresh,
    loadMore,
  };
};

export default useNews;
