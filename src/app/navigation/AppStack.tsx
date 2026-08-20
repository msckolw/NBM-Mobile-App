import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../features/news/screens/Home';
import Profile from '../../features/profile/screens/ProfileScreen'
import Search from '../../features/search/screens/Search'
import Bookmarks from '../../features/bookmarks/screens/Bookmarks'
import Ionicons from "react-native-vector-icons/Ionicons";
import SwipeFeedScreen from '../../features/news/screens/swipefeedScreen';
import ReadMore from '../../features/readmore/screens/ReadMoreScreen';
import SourcesScreen from '../../features/sources/screens/SourcesScreen';
import AppScreens from './BottomTabs';
import CategoryFeedScreen from '../../features/news/screens/CategoryFeedScreen';
import Settings from '../../features/profile/screens/SettingsScreen';
import { Alert, Pressable, View } from 'react-native';
// import HeaderButtons from '../components/common/HEaderButtons';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import TopicTabs from '../../features/news/components/TopicTabs';
import WebViewScreen from '../../features/webview/screens/WebViewScreen';




const Stack = createNativeStackNavigator();

const PlaceholderScreen = () =>null;


export default function AppStack (){
    return (
      <Stack.Navigator
      screenOptions={{
        headerShown: false,
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
