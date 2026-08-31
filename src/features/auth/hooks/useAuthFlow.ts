import {useState} from 'react';
import {loginWithGoogle} from '../services/authService';
import {PendingAuthAction} from '../types/authTypes';

export const useAuthFlow = () => {
  const [pendingAction, setPendingAction] =
    useState<PendingAuthAction>(null);

  const [authModalVisible, setAuthModalVisible] =
    useState(false);

  const [authLoading, setAuthLoading] =
    useState(false);

  const [authError, setAuthError] =
    useState<string | null>(null);

  const requestAuthentication = (action: PendingAuthAction) => {
    setAuthError(null);
    setPendingAction(action);
    setAuthModalVisible(true);
  };

  const closeAuthModal = () => {
    if (authLoading) {
      return;
    }

    setAuthModalVisible(false);
    setPendingAction(null);
    setAuthError(null);
  };

  const handleGoogleLogin = async () => {
    try {
      setAuthError(null);
      setAuthLoading(true);

      const result = await loginWithGoogle();

      console.log('Authentication successful:', result);

      setAuthModalVisible(false);

      return result;
    } catch (error) {
      console.error('Authentication failed:', error);

      setAuthError('Google Sign-In failed. Please try again.');

      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    pendingAction,
    authModalVisible,
    authLoading,
    authError,

    requestAuthentication,
    closeAuthModal,
    handleGoogleLogin,
  };
};