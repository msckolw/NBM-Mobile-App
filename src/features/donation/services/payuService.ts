export type PayUPaymentRequest = {
    txnid: string;
    amount: string;
    firstname: string;
    email: string;
    phone: string;
  };
  
  export type PayUPaymentResult =
    | {
        status: 'success';
        txnid: string;
      }
    | {
        status: 'failed';
        txnid: string;
        message?: string;
      }
    | {
        status: 'cancelled';
        txnid: string;
      };
  
  export const startPayUPayment = async (
    request: PayUPaymentRequest,
  ): Promise<PayUPaymentResult> => {
    // Native PayU SDK integration will be implemented here.
    throw new Error('PayU payment integration is not configured yet.');
  };