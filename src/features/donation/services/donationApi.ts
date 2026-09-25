import paymentClient from './paymentClient';
import type {
  DonationFormData,
  DonationTransaction,
} from '../types/donation';

export type CreateDonationResponse = {
  txnid: string;
  action?: string;
  fields?: Record<string, string>;
};

export const createDonation = async (
  payload: DonationFormData,
): Promise<CreateDonationResponse> => {
  const response = await paymentClient.post('/payments/create', payload);

  return response.data;
};

export const getDonationStatus = async (
  txnid: string,
): Promise<DonationTransaction> => {
  const response = await paymentClient.get(`/payments/${txnid}`);

  return response.data;
};

export const verifyDonation = async (
  txnid: string,
): Promise<DonationTransaction> => {
  const response = await paymentClient.post(`/payments/${txnid}/verify`);

  return response.data;
};