import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import useAuthStore from '../../../store/AuthStore';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/index';
import { logout } from '../../auth/store/authslice';
import { useCallback } from 'react';
import { setAuth } from '../../auth/store/authslice';
import { googleSignIn } from '../../../api/auth';
import { googleLogin, googleLogout } from '../../../services/auth/googleAuth';
import { log, setUserId } from '../../../services/monitoring/crashlytics';
import { logEvent } from '../../../services/monitoring/analytics';
import { devLog } from "../../../utils/devLog";
import { useTheme } from '../../../context/ThemeContext';




const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector(
    (state: RootState) => state.auth,
  );
  
  const {theme} = useTheme();
  const navigation = useNavigation()
  



  const handleGoogleLogin = useCallback(async () => {
    logEvent('login_started', {
      method: 'google',
    });
  
    log('Google login started');
  
    try {
      const result = await googleLogin();
  
      if (!result?.user?.email) {
        // setShowAuthModal(false);
        return;
      }
  
      log('Google authentication successful');
  
      const response = await googleSignIn({
        email: result.user.email,
        name: result.user.name ?? '',
      });
  
      devLog('Backend Google login:', response);
  
      if (response?.success) {
        logEvent('login_success', {
          method: 'google',
        });
  
        log('Backend authentication successful');
  
        dispatch(
          setAuth({
            token: response.token,
            user: response.user,
          }),
        );
  
        setUserId(String(response.user.id));
  
        Alert.alert(
          'Login successful',
          'You have been successfully logged in.',
        );
  
        log('User session established');
      }
    } catch (error) {
      logEvent('login_failed', {
        method: 'google',
      });
  
      console.error('Google login failed:', error);
  
      Alert.alert(
        'Login failed',
        'Unable to login with Google. Please try again.',
      );
    }
  }, [dispatch]);



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

  const handleLogout = async () => {
    await googleLogout();
  
    dispatch(logout());
  
    Alert.alert(
      'Logged out',
      'You have been successfully logged out.',
    );
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


   

      {token ? (
  <TouchableOpacity
    onPress={confirmLogout}
    style={{
      height: 56,
      borderRadius: 14,
      backgroundColor: theme === 'light' ? '#F5F5F5' : '#1A1A1A',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 10,
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
) : (
  <TouchableOpacity
    onPress={handleGoogleLogin}
    style={{
      height: 56,
      borderRadius: 14,
      backgroundColor: theme === 'light' ? '#F5F5F5' : '#1A1A1A',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginTop: 10,
    }}
  >
    <Icon
      name="logo-google"
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
      Login with Google
    </Text>

    <Icon
      name="chevron-forward"
      size={20}
      color={theme === 'light' ? '#777' : '#aaa'}
    />
  </TouchableOpacity>
)}

<TouchableOpacity
        onPress={() => navigation.navigate('Donation')}
        style={{
          height: 56,
          borderRadius: 14,
          backgroundColor: theme === 'light' ? '#F5F5F5' : '#1A1A1A',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          marginTop:10
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
          Donation
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
