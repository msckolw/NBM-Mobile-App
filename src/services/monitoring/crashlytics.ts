import {
    getCrashlytics,
    log as crashlyticsLog,
    recordError as crashlyticsRecordError,
    setAttribute as crashlyticsSetAttribute,
    setUserId as crashlyticsSetUserId,
  } from '@react-native-firebase/crashlytics';
import { subscribeToNetworkChanges } from '../../services/network/networkInfo';
  
  const crashlytics = getCrashlytics();
  
  export const log = (message: string) => {
    crashlyticsLog(crashlytics, message);
  };
  
  export const recordError = (error: Error, context?: string) => {
    if (context) {
      crashlyticsLog(crashlytics, context);
    }
  
    crashlyticsRecordError(crashlytics, error);
  };
  
  export const setUserId = (userId: string) => {
    crashlyticsSetUserId(crashlytics, userId);
  };
  
  export const setAttribute = (key: string, value: string) => {
    crashlyticsSetAttribute(crashlytics, key, value);
  };

  export const initializeNetworkMonitoring = () => {
    const unsubscribe = subscribeToNetworkChanges(network => {
      setAttribute('network_type', network.type);
      setAttribute(
        'network_connected',
        String(network.isConnected),
      );
      setAttribute(
        'internet_reachable',
        String(network.isInternetReachable),
      );
    });
  
    return unsubscribe;
  };