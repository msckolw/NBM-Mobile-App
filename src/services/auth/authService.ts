
import { store } from '../../store';
import { setAuth, logout } from '../../features/auth/store/authslice';
import { tokenService } from './tokenService';
import { secureStorage } from './secureStorage';
import { clearBookmarks } from '../../features/bookmarks/store/bookmarkSlice';

type AuthUser = {
  id: string | number;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

type AuthResponse = {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: AuthUser;
};

export const authService = {
  async establishSession(response: AuthResponse): Promise<void> {
    if (!response.success || !response.user) {
      throw new Error('Invalid authentication response.');
    }

    if (!response.token?.trim()) {
      throw new Error('Backend did not return an access token.');
    }

    tokenService.setAccessToken(response.token);

    try {
      if (response.refreshToken?.trim()) {
        await secureStorage.saveRefreshToken(response.refreshToken);
      }

      store.dispatch(
        setAuth({
          user: response.user,
        }),
      );
    } catch (error) {
      tokenService.clearAccessToken();
      await secureStorage.clearRefreshToken();
      store.dispatch(logout());
      throw error;
    }
  },

  async clearSession(): Promise<void> {
    tokenService.clearAccessToken();
    await secureStorage.clearRefreshToken();
  
    store.dispatch(logout());
    store.dispatch(clearBookmarks());
  },
};
