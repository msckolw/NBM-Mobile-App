import React,{useEffect, useState} from 'react';





const useGetNetworkStatus = ()=>{
const [isOffline, setIsOffline] = useState(false);



    useEffect(() => {
        const NetInfo = getNetInfo();
        const unsubscribe = NetInfo.addEventListener((state: any) => {
          setIsOffline(!state.isConnected);
        });
    
        return () => unsubscribe();
      }, []);

    const getNetInfo = () => {
        try {
          return require('@react-native-community/netinfo').default;
        } catch (error) {
          console.warn('NetInfo not available');
          return {
            addEventListener: (callback: any) => {
              callback({ isConnected: true });
              return () => {};
            },
            fetch: async () => ({ isConnected: true }),
          };
        }
      };


      return {isOffline}

}


export default useGetNetworkStatus;

