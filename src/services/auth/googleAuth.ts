import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import {ENV} from '../../config/env';

export const configureGoogleSignIn = () => {
  console.log(
    'GOOGLE WEB CLIENT ID:',
    ENV.GOOGLE_WEB_CLIENT_ID,
  );

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
      console.error('Google Sign-In succeeded but no ID token was returned.');
      return null;
    }

    console.log('Google ID Token received');

    return {
      user: userInfo.data?.user,
      idToken,
    };
  } catch (error: any) {
    if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log('Google Sign-In cancelled by user');
      return null;
    }

    console.error('Google Sign-In failed:', error);
    throw error;
  }
};