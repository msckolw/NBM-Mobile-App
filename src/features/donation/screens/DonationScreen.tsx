import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Controller, useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import Input from '../../../components/common/Input';
import {useTheme} from '../../../context/ThemeContext';
import {donationSchema} from '../schemas/donationSchema';
import type {DonationFormValues} from '../schemas/donationSchema';
import type {DonationPaymentMethod} from '../types/donation';
import {createDonation, getDonationCheckout} from '../services/donationApi';
import {savePendingDonationId} from '../services/donationStorage';
import uuid from 'react-native-uuid';
import { DonationPaymentStatus, initializePayUListeners, startPayUPayment } from '../services/payuService';
import { showToast } from '../../../services/ui/toastService';
import {DeviceEventEmitter} from 'react-native';
import {
  PAYMENT_VERIFIED_EVENT,
} from '../services/payuService';
import { RootState } from '../../../store/index';
import { useSelector } from 'react-redux';


const PRESET_AMOUNTS = [50, 100, 200, 500, 1000];

const PAYMENT_METHODS: {
  label: string;
  value: DonationPaymentMethod;
}[] = [
  {value: 'upi', label: 'UPI'},
  {value: 'card', label: 'Card'},
  {value: 'netbanking', label: 'Net Banking'},
];

const Donation = () => {
  const {theme} = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const isDark = theme === 'dark';

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: 50,
      firstname: '',
      email: '',
      phone: '',
      method: 'all',
    },
    mode: 'onSubmit',
  });
  const inFlight = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amount = watch('amount');
  const method = watch('method');
  const selectedMethodLabel = PAYMENT_METHODS.find(item => item.value === method)?.label;


    useEffect(() => {
      console.log("useEffect running")
      return initializePayUListeners();
    }, []);

    useEffect(() => {
      const subscription = DeviceEventEmitter.addListener(
        PAYMENT_VERIFIED_EVENT,
        (status: DonationPaymentStatus) => {
          console.log('Donation payment verified event:', status);

          inFlight.current = false;
    
          if (status === 'success') {
            showToast({
              type: 'success',
              title: 'Donation Successful',
              message: 'Thank you for supporting NoBiasNews.',
            });
            return;
          }
    
          if (status === 'failed') {
            showToast({
              type: 'error',
              title: 'Payment Failed',
              message: 'Your donation could not be completed.',
            });
            return;
          }
    
          if (status === 'pending') {
            showToast({
              type: 'info',
              title: 'Payment Pending',
              message:
                'Your payment is being verified. Please check again shortly.',
            });
          }

          if (status === 'cancelled') {
            showToast({
              type: 'info',
              title: 'Payment Cancelled',
              message: 'The donation payment was cancelled.',
            });
          }
        },
      );
    
      return () => {
        subscription.remove();
      };
    }, []);

    const handleDonate = async (data: DonationFormValues) => {
      if (inFlight.current) {
        console.log('Donation already in progress');
        return;
      }
    
      inFlight.current = true;
    
      console.log('HANDLE DONATE CALLED:', new Date().toISOString());
      try {
        setIsSubmitting(true);
    
        const idempotencyKey = uuid.v4() as string;

        console.log("...data", data, idempotencyKey)

        const requestCreateDonation = {
          ...data,
          method: 'all',
          platform: 'app',
          idempotencyKey,
        }
        console.log("requestCreateDonation", requestCreateDonation)
    
        const response = await createDonation(requestCreateDonation);
    
        await savePendingDonationId(response.id);
    
        const checkoutResponse = await getDonationCheckout(response.id);
        console.log('Donation ID:', response.id);
console.log(
  'PayU txnid:',
  checkoutResponse.checkout.fields.txnid,
);
    
        console.log('PayU SURL:', checkoutResponse.checkout.fields.surl);
console.log('PayU FURL:', checkoutResponse.checkout.fields.furl);
console.log('PayU Fields:', checkoutResponse.checkout.fields);
    
        await startPayUPayment(checkoutResponse.checkout.fields, response.id,);
    
        console.log('Donation created:', response);
      } catch (error) {
        console.error('Donation creation failed:', error);
        showToast({
          type: 'error',
          title: 'Donation Failed',
          message: 'Unable to create the donation. Please try again.'
        })
      } finally {
        setIsSubmitting(false);
      }
    };

  return (
    <SafeAreaView
    edges={['bottom']}
    style={{
      flex: 1,
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#000000',
    }}
  >
          <KeyboardAvoidingView
    style={styles.keyboardAvoidingView}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            backgroundColor: isDark ? '#121212' : '#fff',
          },
        ]}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        {/* <Text
          style={[
            styles.title,
            {
              color: isDark ? '#fff' : '#111',
            },
          ]}>
          Support Unbiased Journalism
        </Text>

        <Text
          style={[
            styles.description,
            {
              color: isDark ? '#bbb' : '#555',
            },
          ]}>
          Every rupee helps us deliver independent, fact-based
          reporting.
        </Text> */}

        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>
  Make a Donation
</Text>

<Text style={[styles.description, {color: isDark ? '#ccc' : '#444'}]}>
  Every rupee counts towards better journalism.
</Text>

        {/* Amount */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDark ? '#fff' : '#111',
            },
          ]}>
          Select Amount
        </Text>

        <View style={styles.amountContainer}>
          {PRESET_AMOUNTS.map(value => {
            const selected = amount === value;

            return (
                <Pressable
                key={value}
                onPress={() =>
                  setValue('amount', value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                style={[
                  styles.amountButton,
                  {
                    backgroundColor: selected
                    ? '#1D3C75'
                    : isDark
                      ? '#1A1A1A'
                      : '#f2f2f2',
                  },
                ]}>
                <Text
                  style={[
                    styles.amountText,
                    {
                        color: selected
                        ? '#fff'
                        : isDark
                          ? '#fff'
                          : '#111',
                    },
                  ]}>
                  ₹{value}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Controller
          control={control}
          name="amount"
          render={({field: {onChange, value}}) => (
            <Input
              label="Custom Amount"
              value={String(value ?? '')}
              onChangeText={text => {
                const numericValue = text.replace(/\D/g, '');

                onChange(
                  numericValue === '' ? 0 : Number(numericValue),
                );
              }}
              keyboardType="number-pad"
              placeholder="Enter amount"
              error={errors.amount?.message}
            />
          )}
        />

        {/* Payment Method */}
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDark ? '#fff' : '#111',
            },
          ]}>
          Payment Method
        </Text>

        <View style={styles.methodContainer}>
          {PAYMENT_METHODS.map(item => {
            const selected = method === item.value;

            return (
              <Pressable
                key={item.value}
                onPress={() =>
                  setValue('method', item.value, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                style={[
                  styles.methodButton,
                  {
                    backgroundColor: selected
                    ? '#1D3C75'
                    : isDark
                      ? '#1A1A1A'
                      : '#f2f2f2',
                  },
                ]}>
                <Text
                  style={[
                    styles.methodText,
                    {
                        color: selected
                        ? '#fff'
                        : isDark
                          ? '#fff'
                          : '#111',
                    },
                  ]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Full Name */}
        <Controller
          control={control}
          name="firstname"
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label="Full Name *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Enter your full name"
              autoCapitalize="words"
              keyboardType="default"
              autoCorrect={false}
              error={errors.firstname?.message}
            />
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label="Email Address *"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              error={errors.email?.message}
            />
          )}
        />

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          render={({field: {onChange, onBlur, value}}) => (
            <Input
              label="Mobile Number *"
              value={value}
              onChangeText={text => {
                const numericValue = text
                  .replace(/\D/g, '')
                  .slice(0, 10);

                onChange(numericValue);
              }}
              onBlur={onBlur}
              placeholder="10-digit mobile number"
              keyboardType="phone-pad"
              maxLength={10}
              autoComplete="tel"
              error={errors.phone?.message}
            />
          )}
        />

        {/* Summary */}
        <Text style={[styles.summary, {color: isDark ? '#ccc' : '#444'}]}>
        You are donating ₹{amount || 0} via{' '} • {selectedMethodLabel}
</Text>

        {/* Donate */}
        <Pressable
  disabled={isSubmitting}
  onPress={handleSubmit(handleDonate)}
  style={[
    styles.donateButton,
    {
      opacity: isSubmitting ? 0.6 : 1,
    },
  ]}>
  {isSubmitting ? (
    <View style={styles.processingContent}>
      <ActivityIndicator size="small" color="#fff" />
      <Text style={styles.donateButtonText}>Processing...</Text>
    </View>
  ) : (
    <Text style={styles.donateButtonText}>
      {`Donate ₹${amount || 0} →`}
    </Text>
  )}
</Pressable>

        {/* Legal */}
        <Text
          style={[
            styles.legal,
            {
              color: isDark ? '#999' : '#777',
            },
          ]}>
          By donating, you agree to the Terms & Conditions and
          Refund Policy.
        </Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 16,
    // paddingBottom: 40,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  amountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },

  amountButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  
  amountText: {
    fontSize: 15,
    fontWeight: '600',
  },

  methodContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  methodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 999,
    alignItems: 'center',
  },
  
  methodText: {
    fontSize: 14,
    fontWeight: '600',
  },

  summary: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 16,
  },

  donateButton: {
    backgroundColor: '#1D3C75',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  
  donateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  legal: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  processingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});

export default Donation;