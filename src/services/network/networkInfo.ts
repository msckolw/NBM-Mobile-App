
import NetInfo, {
  NetInfoState,
} from '@react-native-community/netinfo';

export type NetworkInfo = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
};

let currentNetworkInfo: NetworkInfo = {
  isConnected: true,
  isInternetReachable: null,
  type: 'unknown',
};

let initializationPromise: Promise<NetworkInfo> | null = null;
let unsubscribe: (() => void) | null = null;
let monitoringStarted = false;


const mapNetworkState = (state: NetInfoState): NetworkInfo => ({
  isConnected: state.isConnected ?? false,
  isInternetReachable: state.isInternetReachable ?? null,
  type: state.type,
});

export const getNetworkInfo = async (): Promise<NetworkInfo> => {
  const state = await NetInfo.fetch();
  currentNetworkInfo = mapNetworkState(state);
  return currentNetworkInfo;
};


export const initializeNetworkMonitoring =
  async (): Promise<NetworkInfo> => {
    if (!monitoringStarted) {
      unsubscribe = NetInfo.addEventListener(state => {
        currentNetworkInfo = mapNetworkState(state);
      });

      monitoringStarted = true;
    }

    return getNetworkInfo();
  };

export const getCurrentNetworkInfo = (): NetworkInfo => currentNetworkInfo;

export const subscribeToNetworkChanges = (
  callback: (network: NetworkInfo) => void,
) => {
  return NetInfo.addEventListener(state => {
    currentNetworkInfo = mapNetworkState(state);
    callback(currentNetworkInfo);
  });
};
