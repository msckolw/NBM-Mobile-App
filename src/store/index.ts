import {configureStore,} from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authslice';
import bookmarkReducer from '../features/bookmarks/store/bookmarkSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistReducer} from 'redux-persist';
import {persistStore} from 'redux-persist';

const bookmarkPersistConfig = {
  key: 'bookmark-storage',
  storage: AsyncStorage,
};

const authPersistConfig = {
  key: 'auth-storage',
  storage: AsyncStorage,
};

const persistedAuthReducer = persistReducer(
  authPersistConfig,
  authReducer,
);

const persistedBookmarkReducer = persistReducer(
  bookmarkPersistConfig,
  bookmarkReducer,
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    bookmarks: persistedBookmarkReducer,
  },
middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        'persist/PERSIST',
        'persist/REHYDRATE',
        'persist/REGISTER',
        'persist/FLUSH',
        'persist/PAUSE',
        'persist/PURGE',
      ],
      ignoredActionPaths: ['register', 'rehydrate'],
    },
  }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;