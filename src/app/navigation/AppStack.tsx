import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SwipeFeedScreen from '../../features/news/screens/swipefeedScreen';
import ReadMore from '../../features/readmore/screens/ReadMoreScreen';
import SourcesScreen from '../../features/sources/screens/SourcesScreen';
import AppScreens from './BottomTabs';
import CategoryFeedScreen from '../../features/news/screens/CategoryFeedScreen';
import Settings from '../../features/profile/screens/SettingsScreen';
import WebViewScreen from '../../features/webview/screens/WebViewScreen';
import { devLog } from "../../utils/devLog";
import {useTheme} from '../../context/ThemeContext';





const Stack = createNativeStackNavigator();

// const PlaceholderScreen = () =>null;


export default function AppStack (){
  const {theme} = useTheme();

  const isDark = theme === 'dark';
    devLog(
    `⏱️ [APPSTACK] Render | +${
      Date.now() - globalThis.__APP_START_TIME__
    }ms`,
  );
    return (
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
        },
      }}
    >
      {/* Bottom Tabs */}
      <Stack.Screen options={{ headerShown: false }} name="Tabs" component={AppScreens} />

      {/* Other screens */}
      <Stack.Screen name="CategoryFeed" component={CategoryFeedScreen} />
      <Stack.Screen name="ReadMore" component={ReadMore} />
      <Stack.Screen name="Sources" component={SourcesScreen} />
      <Stack.Screen name="SwipeFeed" component={SwipeFeedScreen} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen 
  name="WebViewScreen" 
  component={WebViewScreen}
  options={{ headerShown: true, title: "Contact Us" }}
/>

      {/* <Stack.Screen name="Home" component={Home} /> */}

    </Stack.Navigator>

    
  );
}
