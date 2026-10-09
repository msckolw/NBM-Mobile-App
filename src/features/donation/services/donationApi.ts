import paymentClient from './paymentClient';
import type {DonationFormData} from '../types/donation';

export type CreateDonationResponse = {
  id: string;
};

export type DonationCheckoutResponse = {
  checkout: {
    fields: Record<string, string>;
  };
};

export type DonationStatusResponse = {
  status: 'success' | 'pending' | 'failed';
};

export const createDonation = async (
  payload: DonationFormData & {
    platform: 'app';
    idempotencyKey: string;
  },
): Promise<CreateDonationResponse> => {
  const response = await paymentClient.post('/donations', payload);
  return response.data;
};

export const getDonationCheckout = async (
  donationId: string,
): Promise<DonationCheckoutResponse> => {
  const response = await paymentClient.post(
    `/donations/${donationId}/checkout`,
  );

  return response.data;
};

export const getDonationStatus = async (
  donationId: string,
): Promise<DonationStatusResponse> => {
  const response = await paymentClient.get(
    `/donations/${donationId}/status`,
  );

  return response.data;
};


export const getDonationStatusByTxnid = async (txnid: string) => {
  const response = await paymentClient.get(
    `/donations/by-txnid/${txnid}`,
  );
  return response.data;
};

export const cancelDonation = async (donationId: string) => {
  const response = await paymentClient.post(
    `/donations/${donationId}/cancel`,
  );

  return response.data;
};


