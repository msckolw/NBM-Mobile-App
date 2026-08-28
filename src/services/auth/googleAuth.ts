import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {ENV} from '../../config/env';

export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
  });
};

export const googleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const userInfo = await GoogleSignin.signIn();

    console.log('Google User:', userInfo);

    const idToken = userInfo.data?.idToken;

    if (!idToken) {
      throw new Error('Google ID token not found');
    }

    console.log('Google ID Token received');

    return {
      user: userInfo.data?.user,
      idToken,
    };
  } catch (error) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
};