import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/index';
import { googleLogout } from '../../../services/auth/googleAuth';
import { devLog } from "../../../utils/devLog";
import { useTheme } from '../../../context/ThemeContext';
import { showToast } from '../../../services/ui/toastService';
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import { authService } from '../../../services/auth/authService';
import { googleLoginService } from '../../../services/auth/googleLoginService';




const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  
  const {theme} = useTheme();
  const navigation = useNavigation()
  

  const [showLogoutModal, setShowLogoutModal] = useState(false);



  const handleGoogleLogin = async () => {
    try {
      const result = await googleLoginService.signIn();
  
      if (result === 'cancelled') {
        return;
      }
  
      showToast({
        type: 'success',
        title: 'Login successful',
        message: 'You have been successfully logged in.',
      });
    } catch (error) {
      devLog('Google login failed:', error);
  
      showToast({
        type: 'error',
        title: 'Login failed',
        message: 'Unable to login with Google. Please try again.',
      });
    }
  };
  



  const confirmLogout = () => {
    setShowLogoutModal(true);
  };


  const handleLogout = async () => {
    try {
      await googleLogout();
  
      await authService.clearSession();
  
      showToast({
        type: 'success',
        title: 'Logged out',
        message: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout failed:', error);
  
      showToast({
        type: 'error',
        title: 'Logout failed',
        message: 'Please try again.',
      });
    }
  };
  




  return (
    <SafeAreaView
    edges={['bottom']}
    style={{
      flex: 1,
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#000000',
    }}
  >
    <View style={{ padding: 16 }}>
  
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


   

      {isAuthenticated ? (
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

{/* <TouchableOpacity
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
      </TouchableOpacity> */}
  <ConfirmationModal
  visible={showLogoutModal}
  title="Logout"
  message="Are you sure you want to logout?"
  confirmText="Logout"
  cancelText="Cancel"
  destructive
  onCancel={() => setShowLogoutModal(false)}
  onConfirm={() => {
    setShowLogoutModal(false);
    handleLogout();
  }}
/>
    </View>
  </SafeAreaView>
  );
};

export default Profile;
