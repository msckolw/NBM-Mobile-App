import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark';

type ThemeState = {
  theme: ThemeType;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      theme: 'light',

      toggleTheme: () =>
        set(state => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'theme-storage',

      // React Native persistence
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);