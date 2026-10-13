
import React from 'react';
import type {ToastConfig} from 'react-native-toast-message';

import AppToast from '../toast/index';

export const toastConfig: ToastConfig = {
  success: props => <AppToast {...props} variant="success" />,
  error: props => <AppToast {...props} variant="error" />,
  info: props => <AppToast {...props} variant="info" />,
};
