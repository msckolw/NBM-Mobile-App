import React, {useEffect} from 'react';
import {
  StatusBar,
  LogBox,
} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import {Provider} from 'react-redux';

import RootNavigator from './navigation/RootNavigator';
import ErrorBoundary from '../components/common/ErrorBoundary';
import {store} from '../store';
import {configureGoogleSignIn} from '../services/auth/googleAuth';
import {devLog} from '../utils/devLog';
import {ThemeProvider, useTheme} from '../context/ThemeContext';
import { initializeAnalyticsDeviceInfo } from '../services/monitoring/analytics';
import { initializeNetworkMonitoring } from '../services/monitoring/crashlytics';

if (__DEV__) {
  LogBox.ignoreAllLogs(false);
}

function AppContent() {
  const {theme, isThemeReady} = useTheme();

  const isDarkMode = theme === 'dark';
  

  useEffect(() => {
    devLog(
      `App Mounted | +${
        Date.now() - globalThis.__APP_START_TIME__
      }ms`,
    );

    initializeAnalyticsDeviceInfo();
    const unsubscribeNetworkMonitoring = initializeNetworkMonitoring();
    configureGoogleSignIn();

    const init = async () => {
      try {
        await BootSplash.hide({fade: true});
      } catch (error) {
        console.error('Error hiding boot splash:', error);
      }
    };

    init();
    return () => {
      unsubscribeNetworkMonitoring();
    };
  }, []);

  if (!isThemeReady) {
    return null;
  }

  return (
    <Provider store={store}>
     <SafeAreaProvider initialMetrics={initialWindowMetrics}>
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

function App() {
  devLog(
    `App Render | +${
      Date.now() - globalThis.__APP_START_TIME__
    }ms`,
  );

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;