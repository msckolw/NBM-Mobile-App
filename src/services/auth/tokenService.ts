
let accessToken: string | null = null;

export const tokenService = {
  setAccessToken(token: string): void {
    if (!token.trim()) {
      throw new Error('Cannot set an empty access token.');
    }

    accessToken = token;
  },

  getAccessToken(): string | null {
    return accessToken;
  },

  clearAccessToken(): void {
    accessToken = null;
  },
};
