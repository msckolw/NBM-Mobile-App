import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import useAuthStore from '../../../store/AuthStore';
import { useThemeStore } from '../../../store/ThemeStore';
import { useNavigation } from '@react-navigation/native';
import useAndroidBackHandler from '../../../hooks/useAndroidBackHandler';
import { SafeAreaView } from 'react-native-safe-area-context';

const Settings = () => {
  useAndroidBackHandler();
  const theme = useThemeStore(s => s.theme);
  const toggleTheme = useThemeStore(s => s.toggleTheme);

  const navigation = useNavigation();

  console.log(
    '🔥 SETTINGS STACK:',
    JSON.stringify(navigation.getState(), null, 2),
  );
  return (
    <SafeAreaView
      edges={['top']}
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: theme === 'light' ? '#fff' : '#000',
      }}
    >
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
        }}
        onPress={() =>
          navigation.navigate('WebViewScreen', {
            url: 'https://www.thenobiasmedia.com/privacy-policy',
          })
        }
      >
        <Text style={{ color: '#000' }}>Privacy Policy</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
        }}
        onPress={() =>
          navigation.navigate('WebViewScreen', {
            url: 'https://www.thenobiasmedia.com/terms-conditions',
          })
        }
      >
        <Text style={{ color: '#000' }}>Terms And Conditions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
        }}
        onPress={() =>
          navigation.navigate('WebViewScreen', {
            url: 'https://www.thenobiasmedia.com/about',
          })
        }
      >
        <Text style={{ color: '#000' }}>About Us</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
        }}
        onPress={() =>
          navigation.navigate('WebViewScreen', {
            url: 'https://www.thenobiasmedia.com/contact',
          })
        }
      >
        <Text style={{ color: '#000' }}>Contact Us</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderWidth: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 5,
        }}
        onPress={() =>
          navigation.navigate('WebViewScreen', {
            url: 'https://www.thenobiasmedia.com/contact',
          })
        }
      >
        <Text style={{ color: '#000' }}>Delete Account</Text>
      </TouchableOpacity>
      {/* 
       <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          position:'relative',
          top:500
          // alignItems: "center",
          // padding: 16
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: '600' }}>Dark Mode</Text>
        <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
      </View> */}
    </SafeAreaView>
  );
};

export default Settings;
