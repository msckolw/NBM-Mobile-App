export type DonationPaymentMethod = 'all' | 'upi' | 'card';

export type DonationStatus = 'idle' | 'creating' | 'processing' | 'pending' | 'success' | 'failed';

export type DonationFormData = {
  amount: number;
  firstname: string;
  email: string;
  phone: string;
  method: DonationPaymentMethod;
};

export type DonationTransaction = {
  txnid: string;
  amount: string;
  status: 'pending' | 'success' | 'failed';
  method: DonationPaymentMethod;
  mode: string | null;
  productinfo: string;
  createdAt: string;
  updatedAt: string;
};