import React, {useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  LogBox,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';

import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from '../components/common/ErrorBoundary';
import {store} from '../store';
import {useThemeStore} from '../store/ThemeStore';

if (__DEV__) {
  LogBox.ignoreAllLogs(false);
}

function App() {
  // ALL HOOKS FIRST
  const theme = useThemeStore(state => state.theme);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const init = async () => {
      try {
        await RNBootSplash.hide({fade: true});
      } catch (error) {
        console.error('Error hiding boot splash:', error);
      }
    };

    init();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          />

          <ErrorBoundary>
            <RootNavigator />
            <Toast />
          </ErrorBoundary>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;