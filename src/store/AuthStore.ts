import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';

type User = {
  id: string;
  name: string;
  email: string;
  photo?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
};

let safeAsyncStorage: any = null;

const getAsyncStorage = () => {
  if (safeAsyncStorage) {
    return safeAsyncStorage;
  }

  try {
    const AsyncStorage =
      require('@react-native-async-storage/async-storage').default;

    if (AsyncStorage) {
      safeAsyncStorage = AsyncStorage;
      return AsyncStorage;
    }
  } catch (error) {
    console.warn('AsyncStorage not available:', error);
  }

  const memoryStorage: Record<string, string> = {};

  safeAsyncStorage = {
    getItem: async (key: string) => memoryStorage[key] || null,

    setItem: async (key: string, value: string) => {
      memoryStorage[key] = value;
    },

    removeItem: async (key: string) => {
      delete memoryStorage[key];
    },
  };

  return safeAsyncStorage;
};

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        set({
          user,
          token,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
        });
      },
    }),
    {
      name: 'auth-storage',

      storage: createJSONStorage(() => getAsyncStorage()),

      partialize: state => ({
        user: state.user,
        token: state.token,
      }),
    },
  ),
);

export default useAuthStore;