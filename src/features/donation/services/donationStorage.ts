import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_DONATION_TXN_KEY = '@nbm_pending_donation_txnid';

export const savePendingDonationTxn = async (txnid: string) => {
  await AsyncStorage.setItem(PENDING_DONATION_TXN_KEY, txnid);
};

export const getPendingDonationTxn = async () => {
  return AsyncStorage.getItem(PENDING_DONATION_TXN_KEY);
};

export const clearPendingDonationTxn = async () => {
  await AsyncStorage.removeItem(PENDING_DONATION_TXN_KEY);
};