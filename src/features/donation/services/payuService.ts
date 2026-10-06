import PayUBizSdk from 'payu-non-seam-less-react';
import { DeviceEventEmitter } from 'react-native';

export type PayUPaymentParams = {
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
  [key: string]: string;
};

export const startPayUPayment = (
  paymentParams: PayUPaymentParams,
) => {
  const paymentObject = {
    payUPaymentParams: {
      ...paymentParams,
      android_surl: paymentParams.surl,
      android_furl: paymentParams.furl,
    },
  };

  PayUBizSdk.openCheckoutScreen(paymentObject);
};


export const initializePayUListeners = () => {
  const subscriptions = [
    DeviceEventEmitter.addListener('generateHash', async data => {
      console.log('PayU generateHash:', data);
    
      try {
        // const hashString =
        // data.hashName === 'get_sdk_configuration' ||
        // data.hashName === 'get_all_offer_details' ||
        // data.hashName === 'quickPayEvent'
        //   ? `0BPUp0|${data.hashName}|default|`
        //   : data.hashString;


          const hashRequest = {
            hashName: data.hashName,
            hashString: data.hashString,
          };
          
          console.log('PayU hash request:', hashRequest);
          
          const response = await PayUBizSdk.makeHttpRequest(
            'https://thenbm-329287861933.asia-south1.run.app/api/payments/payu/hash',
            'POST',
            JSON.stringify(hashRequest),
            {
              'Content-Type': 'application/json',
            },
          );
    
        console.log('PayU hash response:', response);
    
        const parsedResponse =
          typeof response === 'string'
            ? JSON.parse(response)
            : response;
    
        const hash = parsedResponse?.[data.hashName];
    
        if (!hash) {
          console.error(
            `PayU hash missing for "${data.hashName}"`,
            parsedResponse,
          );
          return;
        }
    
        PayUBizSdk.hashGenerated({
          [data.hashName]: hash,
        });
      } catch (error) {
        console.error('PayU hash generation failed:', error);
      }
    }),

    DeviceEventEmitter.addListener('onPaymentSuccess', data => {
      console.log('PayU success:', data);
    }),

    DeviceEventEmitter.addListener('onPaymentFailure', data => {
      console.log('PayU failure:', data);
    }),

    DeviceEventEmitter.addListener('onPaymentCancel', data => {
      console.log('PayU cancelled:', data);
    }),

    DeviceEventEmitter.addListener('onError', data => {
      console.log('PayU error:', data);
    }),
  ];

  return () => {
    subscriptions.forEach(subscription => subscription.remove());
  };
};

