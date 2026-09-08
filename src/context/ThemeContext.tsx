import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
  } from 'react';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  type Theme = 'light' | 'dark';
  
  type ThemeContextType = {
    theme: Theme;
    toggleTheme: () => void;
    isThemeReady: boolean;
  };
  
  const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
  
  const THEME_STORAGE_KEY = '@nbm_theme';
  
  type ThemeProviderProps = {
    children: ReactNode;
  };
  
  export const ThemeProvider = ({children}: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>('light');
    const [isThemeReady, setIsThemeReady] = useState(false);
  
    useEffect(() => {
      const loadTheme = async () => {
        try {
          const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
  
          if (savedTheme === 'light' || savedTheme === 'dark') {
            setTheme(savedTheme);
          }
        } catch (error) {
          console.error('Failed to load theme:', error);
        } finally {
          setIsThemeReady(true);
        }
      };
  
      loadTheme();
    }, []);
  
    const toggleTheme = async () => {
      const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
  
      setTheme(nextTheme);
  
      try {
        await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch (error) {
        console.error('Failed to save theme:', error);
      }
    };
  
    return (
      <ThemeContext.Provider
        value={{
          theme,
          toggleTheme,
          isThemeReady,
        }}>
        {children}
      </ThemeContext.Provider>
    );
  };
  
  export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
  
    if (!context) {
      throw new Error('useTheme must be used inside ThemeProvider');
    }
  
    return context;
  };