import React,{useEffect} from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, LogBox } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import ErrorBoundary from '../components/common/ErrorBoundary';
import RNBootSplash from "react-native-bootsplash";
// TEMPORARILY COMMENTED OUT FOR BUILD - WILL RESTORE LATER
// import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { ENV } from "./src/config/env"

// Enable console logging for debugging
if (__DEV__) {
  LogBox.ignoreAllLogs(false);
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    console.log('App component mounted');
    const init = async () => {
      try {
        await RNBootSplash.hide({ fade: true });
        console.log('Boot splash hidden');
      } catch (error) {
        console.error('Error hiding boot splash:', error);
      }
    };
    init();
  }, []);

  // TEMPORARILY COMMENTED OUT FOR BUILD - WILL RESTORE LATER
  // useEffect(() => {
  //   GoogleSignin.configure({
  //     webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
  //   });
  // }, []);
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ErrorBoundary>
        <RootNavigator />
        <Toast/>
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}


export default App;
