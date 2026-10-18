import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {ENV} from '../../config/env';
import { devLog } from "../../utils/devLog";


export const configureGoogleSignIn = () => {
  GoogleSignin.configure({
    webClientId: ENV.GOOGLE_WEB_CLIENT_ID,
  });
};


export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const userInfo = await GoogleSignin.signIn();

    // Google account chooser was dismissed or sign-in was cancelled.
    if (userInfo.type !== 'success') {
      devLog('Google Sign-In cancelled by user');
      return null;
    }

    const user = userInfo.data.user;

    if (!user?.email) {
      throw new Error('Google Sign-In did not return a user email.');
    }

    const tokens = await GoogleSignin.getTokens();

    if (!tokens?.accessToken) {
      throw new Error('Google access token was not returned.');
    }

    return {
      user,
      accessToken: tokens.accessToken,
    };
  } catch (error: any) {
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      devLog('Google Sign-In cancelled by user');
      return null;
    }

    console.error('Google Sign-In failed:', error);
    throw error;
  }
};



export const googleLogout = async () => {
  try {
    await GoogleSignin.signOut();
  } catch (error) {
    console.error('Google Sign-Out failed:', error);
  }
};