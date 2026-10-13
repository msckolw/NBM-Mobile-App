import {
    getAnalytics,
    logEvent as firebaseLogEvent,
    setUserId as firebaseSetUserId,
    setUserProperty as firebaseSetUserProperty,
  } from '@react-native-firebase/analytics';
import { getDeviceInfo } from '../../services/device/deviceInfo';
  
  const analytics = getAnalytics();
  
  export const logEvent = async (
    eventName: string,
    params?: Record<string, any>,
  ) => {
    try {
      await firebaseLogEvent(analytics, eventName, params);
    } catch (error) {
      console.error(`Analytics event failed: ${eventName}`, error);
    }
  };
  
  export const setUserId = async (userId: string | null) => {
    try {
      await firebaseSetUserId(analytics, userId);
    } catch (error) {
      console.error('Analytics setUserId failed:', error);
    }
  };
  
  export const setUserProperty = async (
    name: string,
    value: string | null,
  ) => {
    try {
      await firebaseSetUserProperty(analytics, name, value);
    } catch (error) {
      console.error(`Analytics property failed: ${name}`, error);
    }
  };


  export const initializeAnalyticsDeviceInfo = async () => {
    try {
      const deviceInfo = getDeviceInfo();
  
      await Promise.all([
        setUserProperty('app_version', deviceInfo.appVersion),
        setUserProperty('build_number', deviceInfo.buildNumber),
        setUserProperty('device_model', deviceInfo.deviceModel),
        setUserProperty('os_name', deviceInfo.systemName),
        setUserProperty('os_version', deviceInfo.systemVersion),
        setUserProperty('manufacturer', deviceInfo.manufacturer),
        setUserProperty('is_emulator', String(deviceInfo.isEmulator)),
      ]);
    } catch (error) {
      console.error('Analytics device info initialization failed:', error);
    }
  };