import AsyncStorage from '@react-native-async-storage/async-storage';

const PENDING_DONATION_ID_KEY = '@nbm_pending_donation_id';

export const savePendingDonationId = async (donationId: string) => {
  await AsyncStorage.setItem(PENDING_DONATION_ID_KEY, donationId);
};

export const getPendingDonationId = async () => {
  return AsyncStorage.getItem(PENDING_DONATION_ID_KEY);
};

export const clearPendingDonationId = async () => {
  await AsyncStorage.removeItem(PENDING_DONATION_ID_KEY);
};