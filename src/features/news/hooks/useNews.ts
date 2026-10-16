import { useCallback, useEffect, useRef, useState } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { getNews, getNewsByCategoryPaged } from '../../../api/news';
import { recordError } from '../../../services/monitoring/crashlytics';
import { devLog } from '../../../utils/devLog';

type Article = {
  _id: string;
  category?: string;
  [key: string]: any;
};

export type NewsError =
  | 'NO_NETWORK'
  | 'TIMEOUT'
  | 'SERVER_ERROR'
  | 'CONNECTION_ERROR'
  | 'FAILED';

const useNews = (selectedCategory = 'All') => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<NewsError | null>(null);

  const requestInFlight = useRef(false);
  const requestId = useRef(0);

  const category =
    selectedCategory.trim().toLowerCase() === 'all'
      ? 'all'
      : selectedCategory.trim().toLowerCase();

  const fetchNews = useCallback(
    async (pageNumber: number, replace = false) => {
      if (requestInFlight.current) {
        return;
      }

      requestInFlight.current = true;
      const currentRequestId = ++requestId.current;

      setError(null);

      if (replace) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const maxRetries = pageNumber === 1 ? 1 : 0;

        for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
          try {
            const response =
              category === 'all'
                ? await getNews(pageNumber)
                : await getNewsByCategoryPaged(category, pageNumber);

            if (currentRequestId !== requestId.current) {
              return;
            }

            const nextArticles: Article[] = (response?.articles ?? []).filter(
              (item: Article | null | undefined): item is Article =>
                !!item?._id,
            );

            setArticles(previous => {
              if (replace || pageNumber === 1) {
                return nextArticles;
              }

              const existingIds = new Set(previous.map(article => article._id));

              return [
                ...previous,
                ...nextArticles.filter(
                  article => !existingIds.has(article._id),
                ),
              ];
            });

            setPage(response?.currentPage ?? pageNumber);
            setTotalPages(response?.totalPages ?? 1);
            return;
          } catch (requestError: any) {
            if (currentRequestId !== requestId.current) {
              return;
            }

            const isOffline = requestError?.name === 'NETWORK_UNAVAILABLE';

            const status = requestError?.response?.status;
            const code = requestError?.code;
            const hasNoResponse = !requestError?.response;

            // Retry transient network errors, timeouts, and server errors.
            // Do not retry when our network interceptor confirms the device is offline.
            const isTransientFailure =
              !isOffline &&
              (hasNoResponse ||
                status >= 500 ||
                ['ECONNABORTED', 'ETIMEDOUT', 'ERR_TIMED_OUT'].includes(code));

            devLog('News request failed', {
              category,
              page: pageNumber,
              retry: retryCount,
              message: requestError?.message,
              code,
              status,
              url: requestError?.config?.url,
              baseURL: requestError?.config?.baseURL,
              isOffline,
              isTransientFailure,
            });

            if (isTransientFailure && retryCount < maxRetries) {
              devLog(
                `Retrying news request | category=${category} | page=${pageNumber}`,
              );

              await new Promise(resolve =>
                setTimeout(resolve, 1000 * (retryCount + 1)),
              );

              // A category change or unmount may have invalidated this request.
              if (currentRequestId !== requestId.current) {
                return;
              }

              continue;
            }

            let newsError: NewsError;

            if (isOffline) {
              newsError = 'NO_NETWORK';
            } else if (
              code === 'ECONNABORTED' ||
              code === 'ETIMEDOUT' ||
              code === 'ERR_TIMED_OUT'
            ) {
              newsError = 'TIMEOUT';
            } else if (status >= 500) {
              newsError = 'SERVER_ERROR';
            } else if (!requestError?.response) {
              newsError = 'CONNECTION_ERROR';
            } else {
              newsError = 'FAILED';
            }

            setError(newsError);

            recordError(
              requestError instanceof Error
                ? requestError
                : new Error('Unknown article fetch error'),
              'Failed to fetch articles',
            );

            return;
          }
        }
      } finally {
        if (currentRequestId === requestId.current) {
          requestInFlight.current = false;
          setLoading(false);
          setLoadingMore(false);
          setRefreshing(false);
        }
      }
    },
    [category],
  );

  useEffect(() => {
    requestId.current += 1;
    requestInFlight.current = false;

    setArticles([]);
    setPage(1);
    setTotalPages(1);
    setError(null);
    setLoading(true);

    fetchNews(1, true);

    return () => {
      requestId.current += 1;
      requestInFlight.current = false;
    };
  }, [fetchNews]);

  const onRefresh = useCallback(async () => {
    if (requestInFlight.current) {
      return;
    }

    setRefreshing(true);
    await fetchNews(1, true);
    ReactNativeHapticFeedback.trigger('impactLight');
  }, [fetchNews]);

  const loadMore = useCallback(() => {
    if (
      requestInFlight.current ||
      loading ||
      loadingMore ||
      page >= totalPages ||
      articles.length === 0
    ) {
      return;
    }

    void fetchNews(page + 1);
  }, [articles.length, fetchNews, loading, loadingMore, page, totalPages]);

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
