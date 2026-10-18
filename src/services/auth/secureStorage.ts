
import * as Keychain from 'react-native-keychain';

const REFRESH_TOKEN_SERVICE = 'com.nobiasnews.auth.refresh-token';

export const secureStorage = {
  async saveRefreshToken(token: string): Promise<void> {
    if (!token.trim()) {
      throw new Error('Cannot store an empty refresh token.');
    }

    const saved = await Keychain.setGenericPassword(
      'refresh-token',
      token,
      {
        service: REFRESH_TOKEN_SERVICE,
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      },
    );

    if (!saved) {
      throw new Error('Failed to securely store the refresh token.');
    }
  },

  async getRefreshToken(): Promise<string | null> {
    const credentials = await Keychain.getGenericPassword({
      service: REFRESH_TOKEN_SERVICE,
    });

    return credentials ? credentials.password : null;
  },

  async clearRefreshToken(): Promise<void> {
    await Keychain.resetGenericPassword({
      service: REFRESH_TOKEN_SERVICE,
    });
  },
};
