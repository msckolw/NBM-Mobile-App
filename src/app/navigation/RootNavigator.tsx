import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import useAuthStore from "../../store/AuthStore";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
   import { useAppSelector } from "../../store/hooks";
   import { useRef } from 'react';
import { logEvent } from '../../services/monitoring/analytics';


export const navigationRef = createNavigationContainerRef();

export default function RootNavigator() {
    
    const auth = useAppSelector((state) => state.auth);
    const token = useAppSelector((state) => state.auth.token);
    const routeNameRef = useRef<string | undefined>(undefined);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
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