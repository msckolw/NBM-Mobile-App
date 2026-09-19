import NetInfo, {
    NetInfoState,
  } from '@react-native-community/netinfo';
  
  export type NetworkInfo = {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    type: string;
  };
  
  export const getNetworkInfo = async (): Promise<NetworkInfo> => {
    const state = await NetInfo.fetch();
  
    return {
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable ?? null,
      type: state.type,
    };
  };
  
  export const subscribeToNetworkChanges = (
    callback: (network: NetworkInfo) => void,
  ) => {
    return NetInfo.addEventListener((state: NetInfoState) => {
      callback({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable ?? null,
        type: state.type,
      });
    });
  };