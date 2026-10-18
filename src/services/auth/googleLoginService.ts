
import {signInToBackendWithGoogle} from '../../api/auth';
import {authService} from './authService';
import {signInWithGoogle} from './googleAuth';
import {devLog} from '../../utils/devLog';

type GoogleLoginResult = 'success' | 'cancelled';

export const googleLoginService = {
  async signIn(): Promise<GoogleLoginResult> {
    const result = await signInWithGoogle();

    // Cancellation is a normal user action, not an authentication failure.
    if (!result) {
      return 'cancelled';
    }

    if (!result.user?.email || !result.accessToken) {
      throw new Error(
        'Google sign-in did not return the required credentials.',
      );
    }

    const response = await signInToBackendWithGoogle({
      accessToken: result.accessToken,
    });

    await authService.establishSession(response);

    devLog('Google authentication successful');

    return 'success';
  },
};
