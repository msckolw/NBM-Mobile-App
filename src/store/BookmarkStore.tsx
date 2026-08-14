import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Safe AsyncStorage import
const getAsyncStorage = () => {
  try {
    return require("@react-native-async-storage/async-storage").default;
  } catch (error) {
    console.warn("AsyncStorage not available, using in-memory storage");
    const memoryStorage: { [key: string]: string } = {};
    return {
      getItem: async (key: string) => memoryStorage[key] || null,
      setItem: async (key: string, value: string) => { memoryStorage[key] = value; },
      removeItem: async (key: string) => { delete memoryStorage[key]; },
    };
  }
};

interface Article {
  _id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  createdAt: string;
}

interface BookmarkState {
  items: Article[];
  toggleBookmark: (article: Article) => void;
  isBookmarked: (id: string) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleBookmark: (article) => {
        const exists = get().items.some((i) => i._id === article._id);

        if (exists) {
          set({
            items: get().items.filter((i) => i._id !== article._id),
          });
        } else {
          set({
            items: [...get().items, article],
          });
        }
      },

      isBookmarked: (id) => {
        return get().items.some((i) => i._id === id);
      },
    }),
    {
      name: "bookmark-storage",
      storage: createJSONStorage(() => getAsyncStorage()),
    }
  )
);
