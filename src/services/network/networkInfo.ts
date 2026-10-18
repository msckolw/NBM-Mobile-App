
import NetInfo, {
  NetInfoState,
} from '@react-native-community/netinfo';

export type NetworkInfo = {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string;
};

let currentNetworkInfo: NetworkInfo = {
  isConnected: false,
  isInternetReachable: null,
  type: 'unknown',
};

let initializationPromise: Promise<NetworkInfo> | null = null;
let unsubscribe: (() => void) | null = null;

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
  (): Promise<NetworkInfo> => {
    if (!initializationPromise) {
      initializationPromise = (async () => {
        unsubscribe = NetInfo.addEventListener(state => {
          currentNetworkInfo = mapNetworkState(state);
        });

        try {
          return await getNetworkInfo();
        } catch (error) {
          // Permit a later attempt if initial lookup fails.
          unsubscribe?.();
          unsubscribe = null;
          initializationPromise = null;
          throw error;
        }
      })();
    }

    return initializationPromise;
  };

export const getCurrentNetworkInfo = (): NetworkInfo =>
  currentNetworkInfo;

export const subscribeToNetworkChanges = (
  callback: (network: NetworkInfo) => void,
) => {
  return NetInfo.addEventListener(state => {
    currentNetworkInfo = mapNetworkState(state);
    callback(currentNetworkInfo);
  });
};
