import {
    getCrashlytics,
    log as crashlyticsLog,
    recordError as crashlyticsRecordError,
    setAttribute as crashlyticsSetAttribute,
    setUserId as crashlyticsSetUserId,
  } from '@react-native-firebase/crashlytics';
  
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