import {z} from 'zod';

export const donationSchema = z.object({
  amount: z
    .number({
      required_error: 'Please select or enter an amount.',
      invalid_type_error: 'Please enter a valid amount.',
    })
    .min(10, 'Minimum donation amount is ₹10.')
    .max(100000, 'Maximum donation amount is ₹100,000.'),

  firstname: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name must be 100 characters or less.')
    .regex(
      /^[\p{L}\p{M}.'-]+(?:\s+[\p{L}\p{M}.'-]+)*$/u,
      'Please enter a valid name.',
    ),

  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.'),

  phone: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      'Please enter a valid 10-digit Indian mobile number.',
    ),

  method: z.enum(['all', 'upi', 'card']),
});

export type DonationFormValues = z.infer<typeof donationSchema>;