import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import AppStack from "./AppStack";
   import { useAppSelector } from "../../store/hooks";
   import { useEffect, useRef } from 'react';
import { logEvent } from '../../services/monitoring/analytics';
import { devLog } from "../../utils/devLog";



export const navigationRef = createNavigationContainerRef();

export default function RootNavigator() {

  devLog(
    `root Render | +${
      Date.now() - globalThis.__APP_START_TIME__
    }ms`,
  );
    
    const token = useAppSelector((state) => state.auth.token);
    const routeNameRef = useRef<string | undefined>(undefined);


    useEffect(() => {
      devLog(
        `Root Mounted | +${
          Date.now() - globalThis.__APP_START_TIME__
        }ms`,
      );
    }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        devLog(
          `⏱️ [NAV] Ready | +${
            Date.now() - globalThis.__APP_START_TIME__
          }ms`,
        );
      
        routeNameRef.current =
          navigationRef.getCurrentRoute()?.name;
      }}
      onStateChange={async () => {
        const currentRouteName =
          navigationRef.getCurrentRoute()?.name;
      
        if (routeNameRef.current !== currentRouteName) {
          await logEvent('screen_view', {
            screen_name: currentRouteName,
          });

          routeNameRef.current = currentRouteName;
        }
      }}
    >
        {/* {token ? <AppStack /> : <AuthStack />} */}
      <AppStack />
    </NavigationContainer>
  );
}