declare module 'payu-non-seam-less-react' {
    type PayUPaymentParams = {
      key: string;
      txnid: string;
      amount: string;
      productinfo: string;
      firstname: string;
      email: string;
      phone: string;
      surl: string;
      furl: string;
      hash: string;
      [key: string]: unknown;
    };
  
    type PayUCheckoutProConfig = Record<string, unknown>;
  
    type PayUPaymentObject = {
      payUPaymentParams: PayUPaymentParams;
      payUCheckoutProConfig?: PayUCheckoutProConfig;
    };
  
    const PayUBizSdk: {
      openCheckoutScreen: (
        paymentObject: PayUPaymentObject,
      ) => void;
  
      makeHttpRequest: (
        url: string,
        method: string,
        body: string,
        headers: Record<string, string>,
      ) => Promise<string>;

      hashGenerated: (
        hashResponse: Record<string, string>,
      ) => void;
    };

    
  
    export default PayUBizSdk;
  }