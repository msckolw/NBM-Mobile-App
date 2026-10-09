import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {devLog} from '../../utils/devLog';
import {useTheme} from '../../context/ThemeContext';

import SwipeFeedScreen from '../../features/news/screens/swipefeedScreen';
import ReadMore from '../../features/readmore/screens/ReadMoreScreen';
import SourcesScreen from '../../features/sources/screens/SourcesScreen';
import CategoryFeedScreen from '../../features/news/screens/CategoryFeedScreen';
import Settings from '../../features/profile/screens/SettingsScreen';
import WebViewScreen from '../../features/webview/screens/WebViewScreen';
import Donation from '../../features/donation/screens/DonationScreen';

import AppScreens from './BottomTabs';
import AppHeader from '../../components/common/header';
import DonationSuccessScreen from '../../features/donation/screens/DonationSuccessScreen';

const Stack = createNativeStackNavigator();

const getDefaultHeaderTitle = (routeName: string): string => {
  const titles: Record<string, string> = {
    CategoryFeed: 'News',
    Sources: 'News Sources',
    SwipeFeed: 'Discover',
    Settings: 'Settings',
    Donation: 'Support NBM',
    WebViewScreen: 'Web',
    ReadMore: 'News',
  };

  return titles[routeName] ?? 'News';
};

export default function AppStack() {
  const {theme} = useTheme();
  const isDark = theme === 'dark';

  devLog(
    `⏱️ [APPSTACK] Render | +${
      Date.now() - globalThis.__APP_START_TIME__
    }ms`,
  );

  return (
    <Stack.Navigator
    screenOptions={({route}) => ({
      headerShown: route.name !== 'Tabs',
    
      header: ({navigation, route: headerRoute, options}) => (
        <AppHeader
          title={options.title ?? getDefaultHeaderTitle(headerRoute.name)}
          showBackButton={navigation.canGoBack()}
          onBackPress={() => navigation.goBack()}
        />
      ),
    
      // Let native-stack handle the status bar and header placement.
      headerTransparent: false,
    
      contentStyle: {
        backgroundColor: isDark ? '#000000' : '#FFFFFF',
      },
    })}>
      <Stack.Screen
        name="Tabs"
        component={AppScreens}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="CategoryFeed"
        component={CategoryFeedScreen}
        options={({route}) => ({
          title: String(route.params?.category ?? 'News').toUpperCase(),
        })}
      />

      <Stack.Screen
        name="ReadMore"
        component={ReadMore}
        options={({route}) => ({
          title: String(route.params?.category ?? 'News').toUpperCase(),
        })}
      />

      <Stack.Screen
        name="Sources"
        component={SourcesScreen}
        options={{title: 'News Sources'}}
      />

      <Stack.Screen
        name="SwipeFeed"
        component={SwipeFeedScreen}
        options={{title: 'Discover'}}
      />

      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{title: 'Settings'}}
      />

      <Stack.Screen
        name="Donation"
        component={Donation}
        options={{title: 'Support NBM'}}
      />

      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={({route}) => ({
          title: route.params?.title ?? 'Web',
        })}
      />
      <Stack.Screen
  name="DonationSuccess"
  component={DonationSuccessScreen}
  options={{
    title: 'Donation Successful',
    headerBackVisible: false,
  }}
/>
    </Stack.Navigator>
  );
}