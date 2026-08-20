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


const Tab = createBottomTabNavigator();
const PlaceholderScreen = () => null;

export default function AppScreens() {
    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true, // or false for minimal look
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "#555",
          tabBarStyle: {
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
  
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "home-outline";
  
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } 
//             "search"
// ✔ "search-outline"
// ✔ "search-circle"
// ✔ "search-circle-outline"
            else if (route.name === "Search") {
              iconName = focused ? "search" : "search";
            }else if (route.name === "Categories") {
              iconName = focused ? "grid" : "grid-outline";
            } else if (route.name === "Bookmarks") {
              iconName = focused ? "bookmark" : "bookmark-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }
  
            return <Ionicons name={iconName} size={26} color={color} />;
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