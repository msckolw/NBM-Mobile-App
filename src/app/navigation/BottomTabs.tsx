import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../../features/news/screens/Home';
import Profile from '../../features/profile/screens/ProfileScreen'
import Search from '../../features/search/screens/SearchScreen'
import Bookmarks from '../../features/bookmarks/screens/BookmarksScreen'
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { devLog } from "../../utils/devLog";
import { useTheme } from '../../context/ThemeContext';





const Tab = createBottomTabNavigator();
const PlaceholderScreen = () => null;

export default function AppScreens() {
  devLog(
    `⏱️ [TABS] Render | +${
      Date.now() - globalThis.__APP_START_TIME__
    }ms`,
  );
const insets = useSafeAreaInsets();
const {theme} = useTheme();
const isDark = theme === 'dark';

useEffect(() => {
  devLog(
    `⏱️ [TABS] Mounted | +${
      Date.now() - globalThis.__APP_START_TIME__
    }ms`,
  );
}, []);

    return (
      <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        sceneStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
        },
        tabBarShowLabel: true,
    
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDark ? '#888' : '#555',
    
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          backgroundColor: isDark ? '#111' : '#fff',
          borderTopColor: isDark ? '#222' : '#ddd',
        },
    
        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'home-outline';
    
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Bookmarks') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
    
          return (
            <Ionicons
              name={iconName}
              size={26}
              color={color}
            />
          );
        },
      })}
    >
            <Tab.Screen name="Home" component={Home} />
            {/* <Tab.Screen name="SwipeFeedScreen" component={SwipeFeedScreen} /> */}
            <Tab.Screen name="Search" component={Search} />
            <Tab.Screen name="Bookmarks" component={Bookmarks} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    )
}