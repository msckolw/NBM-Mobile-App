import React, {useEffect} from 'react';
import {Pressable, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import Home from '../../features/news/screens/Home';
import Profile from '../../features/profile/screens/ProfileScreen';
import Search from '../../features/search/screens/SearchScreen';
import Bookmarks from '../../features/bookmarks/screens/BookmarksScreen';
import Donation from '../../features/donation/screens/DonationScreen';

import AppHeader from '../../components/common/header';
import {devLog} from '../../utils/devLog';
import {useTheme} from '../../context/ThemeContext';

const Tab = createBottomTabNavigator();

const TAB_TITLES: Record<string, string> = {
  Home: 'THE NOBIAS MEDIA',
  Search: 'Search',
  Donate: 'Support NBM',
  Bookmarks: 'Bookmarks',
  Profile: 'Profile',
};

export default function AppScreens() {
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
      screenOptions={({route, navigation}) => ({
        headerShown: true,

        header: () => (
          <AppHeader
            variant={route.name === 'Home' ? 'home' : 'screen'}
            title={TAB_TITLES[route.name] ?? route.name}
            showBackButton={false}
            rightAction={
              route.name === 'Home' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Search news"
                    onPress={() => navigation.navigate('Search' as never)}
                    hitSlop={8}
                    style={{
                      width: 44,
                      height: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons
                      name="search-outline"
                      size={23}
                      color={isDark ? '#FFFFFF' : '#171717'}
                    />
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Open profile"
                    onPress={() => navigation.navigate('Profile' as never)}
                    hitSlop={8}
                    style={{
                      width: 44,
                      height: 44,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Ionicons
                      name="person-circle-outline"
                      size={25}
                      color={isDark ? '#FFFFFF' : '#171717'}
                    />
                  </Pressable>
                </View>
              ) : undefined
            }
          />
        ),

        sceneStyle: {
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
        },

        tabBarShowLabel: true,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: isDark ? '#888888' : '#555555',

        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          backgroundColor: isDark ? '#111111' : '#FFFFFF',
          borderTopColor: isDark ? '#222222' : '#DDDDDD',
        },

        tabBarIcon: ({focused, color, size}) => {
          let iconName = 'home-outline';

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Donate':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'Bookmarks':
              iconName = focused ? 'bookmark' : 'bookmark-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return (
            <Ionicons name={iconName} size={size ?? 26} color={color} />
          );
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{title: 'Home'}}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{title: 'Search'}}
      />

      <Tab.Screen
        name="Donate"
        component={Donation}
        options={{title: 'Support NBM'}}
      />

      <Tab.Screen
        name="Bookmarks"
        component={Bookmarks}
        options={{title: 'Bookmarks'}}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}