import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import useAuthStore from '../../../store/AuthStore';
import { useThemeStore } from '../../../store/ThemeStore';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/index';
import { logout } from '../../auth/store/authslice';


const Profile = () => {
  const { user, token } = useSelector(
    (state: RootState) => state.auth,
  );
  
  const theme = useThemeStore((s: any) => s.theme);
  const navigation = useNavigation()
  
  const dispatch = useDispatch<AppDispatch>();



  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: handleLogout,
        },
      ],
    );
  };

  const handleLogout = () => {
    console.log('logout called');
  
    dispatch(logout());
  
    setTimeout(() => {
      Alert.alert(
        'Logged out',
        'You have been successfully logged out.',
      );
    }, 300);
  };




  return (
    <SafeAreaView
    edges={['top']}
    style={{
      flex: 1,
      backgroundColor: theme === 'light' ? '#fff' : '#000',
    }}
  >
    <View style={{ paddingHorizontal: 16 }}>
      
      <Text
        style={{
          fontSize: 28,
          fontWeight: '700',
          color: theme === 'light' ? '#000' : '#fff',
          marginBottom: 20,
        }}
      >
        Profile
      </Text>
  
      <TouchableOpacity
        onPress={() => navigation.navigate('Settings')}
        style={{
          height: 56,
          borderRadius: 14,
          backgroundColor: theme === 'light' ? '#F5F5F5' : '#1A1A1A',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
        }}
      >
        <Icon
          name="settings-outline"
          size={22}
          color={theme === 'light' ? '#222' : '#fff'}
        />
  
        <Text
          style={{
            flex: 1,
            marginLeft: 14,
            fontSize: 16,
            fontWeight: '600',
            color: theme === 'light' ? '#000' : '#fff',
          }}
        >
          Settings
        </Text>
  
        <Icon
          name="chevron-forward"
          size={20}
          color={theme === 'light' ? '#777' : '#aaa'}
        />
      </TouchableOpacity>


      <TouchableOpacity
  onPress={token ? confirmLogout : undefined}
  disabled={!token}
  style={{
    height: 56,
    borderRadius: 14,
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
    opacity: token ? 1 : 0.5,
  }}
>
  <Icon
    name="log-out-outline"
    size={22}
    color={theme === 'light' ? '#222' : '#fff'}
  />

  <Text
    style={{
      flex: 1,
      marginLeft: 14,
      fontSize: 16,
      fontWeight: '600',
      color: theme === 'light' ? '#000' : '#fff',
    }}
  >
    Logout
  </Text>

  <Icon
    name="chevron-forward"
    size={20}
    color={theme === 'light' ? '#777' : '#aaa'}
  />
</TouchableOpacity>
  
    </View>
  </SafeAreaView>
  );
};

export default Profile;
