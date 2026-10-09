import PayUBizSdk from 'payu-non-seam-less-react';
import { DeviceEventEmitter } from 'react-native';
import { getDonationStatus, getDonationStatusByTxnid, cancelDonation} from './donationApi';
import { showToast } from '../../../services/ui/toastService';
import DeviceInfo from 'react-native-device-info';


let currentDonationId: string | null = null;
let payUListenersInitialized = false;
export const PAYMENT_VERIFIED_EVENT = 'PAYMENT_VERIFIED';
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

export type DonationPaymentStatus =
  | 'success'
  | 'failed'
  | 'pending'
  | 'cancelled';





export const startPayUPayment = async (
  paymentParams: PayUPaymentParams,
  donationId: string,
) => {
  currentDonationId = donationId;
  const uniqueId = await DeviceInfo.getUniqueId();

  // const paymentObject = {
  //   payUPaymentParams: {
  //     ...paymentParams,
  //     android_surl: paymentParams.surl,
  //     android_furl: paymentParams.furl,
  //     // userCredential: `${paymentParams.key}:${uniqueId}`,
  //     userCredential: `${paymentParams.key}:${paymentParams.email}`,
  //   },
  // };

  // console.log(
  //   'PayU payment object:',
  //   JSON.stringify(paymentObject, null, 2),
  // );

  // PayUBizSdk.openCheckoutScreen(paymentObject);

  const paymentObject = {
    payUPaymentParams: {
      key: paymentParams.key,
      transactionId: paymentParams.txnid,
      amount: paymentParams.amount,
      productInfo: paymentParams.productinfo,
      firstName: paymentParams.firstname,
      email: paymentParams.email,
      phone: paymentParams.phone,
      android_surl: paymentParams.surl,
      android_furl: paymentParams.furl,
      ios_surl: paymentParams.surl,
      ios_furl: paymentParams.furl,
      hash: paymentParams.hash,
      userCredential: `${paymentParams.key}:${paymentParams.email}`,
    },
  };
  
  console.log('=== SDK PARAMS ===');
  console.log(
    'transactionId:',
    paymentObject.payUPaymentParams.transactionId,
  );
  console.log(
    'transactionId length:',
    paymentObject.payUPaymentParams.transactionId.length,
  );
  
  console.log('Opening PayU CheckoutPro');
  PayUBizSdk.openCheckoutScreen(paymentObject);
};


const pollDonationStatus = async (donationId: string) => {
  const maxAttempts = 6;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getDonationStatus(donationId);

    console.log(
      `Donation payment status (attempt ${attempt + 1}):`,
      status,
    );

    if (status.status !== 'pending') {
      return status;
    }

    await new Promise<void>(resolve => setTimeout(resolve, 10_000));
  }

  return null;
};


export const initializePayUListeners = ( onPaymentVerified?: (status: DonationPaymentStatus) => void,) => {
  if (payUListenersInitialized) {
    return () => {};
  }
  
  payUListenersInitialized = true;
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

    DeviceEventEmitter.addListener('onPaymentSuccess', async data => {
      console.log('PayU success:', data);

  let payuResponse: any;

  try {
    payuResponse =
      typeof data?.payuResponse === 'string'
        ? JSON.parse(data.payuResponse)
        : data?.payuResponse;
  } catch (error) {
    console.error('Failed to parse PayU response:', error);
    return;
  }

  const txnid = payuResponse?.txnid;

  if (!txnid) {
    console.error('PayU success callback missing txnid', data);
    return;
  }

  console.log('PayU payment success, verifying txnid:', txnid);
    
      try {
        // First, resolve the transaction to our donation.
        const initialStatus = await getDonationStatusByTxnid(txnid);
    
        console.log('Initial verified payment status:', initialStatus);
    
        if (initialStatus.status !== 'pending') {
          console.log(
            'Final donation payment status:',
            initialStatus.status,
          );
          // onPaymentVerified?.(initialStatus.status);
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            initialStatus.status,
          );
          return;
        }
    
        // Payment is still pending — poll using donationId.
        const finalStatus = await pollDonationStatus(
          initialStatus.donationId,
        );
    
        if (!finalStatus) {
          console.log(
            'Donation payment status still pending after polling',
          );
          // onPaymentVerified?.('pending');
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'pending',
          );
          return;
        }
    
        if (finalStatus.status === 'success') {
          console.log('Donation payment verified successfully');
          // onPaymentVerified?.('success');
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'success',
          );
        } else if (finalStatus.status === 'failed') {
          console.log('Donation payment verification failed');
          // onPaymentVerified?.('failed');
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'failed',
          );
        }
      } catch (error) {
        console.error(
          'Donation payment verification failed:',
          error,
        );

  DeviceEventEmitter.emit(
    PAYMENT_VERIFIED_EVENT,
    'pending',
  );
      }
    }),
    DeviceEventEmitter.addListener(
      'onPaymentFailure',
      async data => {
        console.log('PayU failure:', data);
    
        if (!currentDonationId) {
          console.error(
            'Cannot cancel failed donation: current donation ID is missing',
          );
    
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'failed',
          );
    
          return;
        }
    
        try {
          await cancelDonation(currentDonationId);
    
          console.log(
            'Failed donation cancelled successfully:',
            currentDonationId,
          );
    
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'failed',
          );
        } catch (error) {
          console.error(
            'Failed to cancel donation after PayU failure:',
            error,
          );
    
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'failed',
          );
        }
      },
    ),

    DeviceEventEmitter.addListener(
      'onPaymentCancel',
      async data => {
        console.log('PayU cancelled:', data);
    
        if (!currentDonationId) {
          console.error(
            'Cannot cancel donation: current donation ID is missing',
          );
    
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'failed',
          );
    
          return;
        }
    
        try {
          await cancelDonation(currentDonationId);
    
          console.log(
            'Donation cancelled successfully:',
            currentDonationId,
          );
    
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'cancelled',
          );
        } catch (error) {
          console.error(
            'Failed to cancel donation after PayU cancellation:',
            error,
          );
    
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'failed',
          );
        }
      },
    ),

    DeviceEventEmitter.addListener('onError', async data => {
      console.log(
        '🔥 PAYU ON ERROR:',
        JSON.stringify(data, null, 2),
      );
    
      if (data?.errorCode === '5019' && currentDonationId) {
        try {
          const status = await getDonationStatus(currentDonationId);
    
          console.log(
            'Donation status after PayU 5019:',
            status,
          );
    
          if (status.status === 'success') {
            DeviceEventEmitter.emit(
              PAYMENT_VERIFIED_EVENT,
              'success',
            );
            return;
          }
    
          if (status.status === 'failed') {
            DeviceEventEmitter.emit(
              PAYMENT_VERIFIED_EVENT,
              'failed',
            );
            return;
          }
    
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'pending',
          );
          return;
        } catch (error) {
          console.error(
            'Failed to verify donation after PayU 5019:',
            error,
          );
    
          DeviceEventEmitter.emit(
            PAYMENT_VERIFIED_EVENT,
            'pending',
          );
          return;
        }
      }
    
      DeviceEventEmitter.emit(
        PAYMENT_VERIFIED_EVENT,
        'failed',
      );
    }),
  ];

  return () => {
    subscriptions.forEach(subscription => subscription.remove());
    payUListenersInitialized = false;
  };
};

