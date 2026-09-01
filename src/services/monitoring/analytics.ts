import {
    getAnalytics,
    logEvent as firebaseLogEvent,
    setUserId as firebaseSetUserId,
    setUserProperty as firebaseSetUserProperty,
  } from '@react-native-firebase/analytics';
  
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