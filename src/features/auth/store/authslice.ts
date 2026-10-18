
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthUser = {
  id: string | number;
  name?: string;
  email?: string;
  [key: string]: unknown;
};

type AuthState = {
  isAuthenticated: boolean;
  user: AuthUser | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ user: AuthUser }>,
    ) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },

    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;
