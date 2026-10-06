import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {ENV} from '../../config/env';
import { devLog } from "../../utils/devLog";


export const configureGoogleSignIn = () => {
  devLog(
    'GOOGLE WEB CLIENT ID:',
    ENV.GOOGLE_WEB_CLIENT_ID,
  );

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

    devLog('Google User:', userInfo);

    const tokens = await GoogleSignin.getTokens();

    if (!tokens?.accessToken) {
      devLog('Google Sign-In succeeded but no access token was returned');
      return null;
    }
    
    devLog('Google OAuth access token received');
    
    return {
      user: userInfo.data?.user,
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