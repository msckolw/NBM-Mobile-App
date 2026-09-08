import React, {useEffect} from 'react';
import {
  StatusBar,
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
import { configureGoogleSignIn } from "../services/auth/googleAuth";
import BootSplash from 'react-native-bootsplash';

if (__DEV__) {
  LogBox.ignoreAllLogs(false);
}

function App() {
  // ALL HOOKS FIRST
  const theme = useThemeStore(state => state.theme);
  const isDarkMode = theme === 'dark';


  useEffect(() => {
    const init = async () => {
      await BootSplash.hide({fade: true});
    };

    init();
  }, []);


//test analytics
  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       await logEvent('app_open_test');
  
  //       await RNBootSplash.hide({fade: true});
  //     } catch (error) {
  //       console.error('Error initializing app:', error);
  //     }
  //   };
  
  //   init();
  // }, []);
  
  useEffect(() => {
    configureGoogleSignIn();
  
    const init = async () => {
      try {
        await RNBootSplash.hide({fade: true});
      } catch (error) {
        console.error('Error hiding boot splash:', error);
      }
    };
  
    init();
  }, []);


//test crashlytics

  // useEffect(() => {
  //   const crashlytics = getCrashlytics();
  
  //   recordError(
  //     crashlytics,
  //     new Error('NoBiasNews Crashlytics test'),
  //   );
    
  // }, []);\\



  

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