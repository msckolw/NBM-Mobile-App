import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/App/Home/Home';
import Profile from '../screens/App/Profile/ProfileScreen'
import Search from '../screens/App/Search/Search'
import Bookmarks from '../screens/App/Bookmarks/Bookmarks'
import Ionicons from "react-native-vector-icons/Ionicons";
import SwipeFeedScreen from '../screens/App/Home/swipefeedScreen';
import ReadMore from '../screens/ReadMore/ReadMoreScreen';
import SourcesScreen from '../screens/Sources/SourcesScreen';
import AppScreens from './BottomTabs';
import CategoryFeedScreen from '../screens/App/Home/CategoryFeedScreen';
import Settings from '../screens/App/Profile/SettingsScreen';
import { Alert, Pressable, View } from 'react-native';
// import HeaderButtons from '../components/common/HEaderButtons';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import TopicTabs from '../components/news/TopicTabs';
import WebViewScreen from '../screens/WebView/WebViewScreen';




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
