
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CachedNewsPage<T> = {
  articles: T[];
  currentPage: number;
  totalPages: number;
  cachedAt: number;
};

const CACHE_VERSION = 'v1';
const CACHE_PREFIX = `nbm:news:${CACHE_VERSION}`;

const getCacheKey = (category: string, page: number) =>
  `${CACHE_PREFIX}:${encodeURIComponent(category.trim().toLowerCase())}:${page}`;

export const getCachedNews = async <T>(
  category: string,
  page: number,
): Promise<CachedNewsPage<T> | null> => {
  try {
    const raw = await AsyncStorage.getItem(getCacheKey(category, page));

    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw) as CachedNewsPage<T>;

    if (
      !Array.isArray(cached.articles) ||
      typeof cached.currentPage !== 'number' ||
      typeof cached.totalPages !== 'number' ||
      typeof cached.cachedAt !== 'number'
    ) {
      return null;
    }

    return cached;
  } catch {
    // A corrupt or inaccessible cache must not prevent network fetching.
    return null;
  }
};

export const saveCachedNews = async <T>(
  category: string,
  page: number,
  data: {
    articles: T[];
    currentPage?: number;
    totalPages?: number;
  },
): Promise<void> => {
  try {
    const cached: CachedNewsPage<T> = {
      articles: data.articles,
      currentPage: data.currentPage ?? page,
      totalPages: data.totalPages ?? 1,
      cachedAt: Date.now(),
    };

    await AsyncStorage.setItem(
      getCacheKey(category, page),
      JSON.stringify(cached),
    );
  } catch {
    // Cache failures should not break the news feed.
  }
};
