# Stripe Payment Integration Setup Guide

This guide explains how to set up and configure Stripe payment processing for NGO verification in Sheltra.

## Backend Environment Setup

Add these environment variables to your `.env` file:

```env
# Stripe API Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_CURRENCY=usd
```

## Getting Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Sign in or create an account
3. Navigate to **Developers > API Keys**
4. You'll see:
   - **Publishable Key** (starts with `pk_`)
   - **Secret Key** (starts with `sk_`)
5. Copy both keys and add to your `.env` file

## Frontend Environment Setup

The frontend automatically fetches the publishable key from the backend at `/api/payment/stripe-key`.

No additional frontend environment variables needed!

## Database Migrations

Run the migration to create the payments table and add Stripe fields to users:

```bash
php artisan migrate
```

This creates:
- `payments` table - stores all payment transactions
- Adds `stripe_customer_id`, `verification_status`, `verification_date` columns to `users` table

## Backend Payment Endpoints

### Create Payment Intent
- **URL:** `POST /api/payment/create-intent`
- **Auth:** NGO Role required
- **Body:**
```json
{
    "amount": 99.99,
    "plan_type": "professional",
    "organization_id": "org_123",
    "organization_name": "My NGO",
    "email": "contact@myng o.org"
}
```
- **Response:**
```json
{
    "success": true,
    "client_secret": "pi_...",
    "payment_intent_id": "pi_...",
    "amount": 99.99,
    "currency": "usd"
}
```

### Confirm Payment
- **URL:** `POST /api/payment/confirm`
- **Auth:** NGO Role required
- **Body:**
```json
{
    "payment_intent_id": "pi_...",
    "organization_id": "org_123"
}
```
- **Response:**
```json
{
    "success": true,
    "message": "Payment successful. NGO verification upgraded.",
    "payment_intent_id": "pi_...",
    "amount_received": 99.99
}
```

### Get Payment History
- **URL:** `GET /api/payment/history`
- **Auth:** NGO Role required
- **Response:**
```json
{
    "success": true,
    "payments": [
        {
            "id": "pi_...",
            "amount": 99.99,
            "currency": "usd",
            "status": "succeeded",
            "created": 1712702400,
            "description": "NGO Verification - professional Plan"
        }
    ],
    "count": 1
}
```

### Get Stripe Publishable Key
- **URL:** `GET /api/payment/stripe-key`
- **Auth:** Not required (Public)
- **Response:**
```json
{
    "publishable_key": "pk_test_..."
}
```

## Frontend Components

### StripeProvider
Wraps your app to initialize Stripe context:
```jsx
import { StripeProvider } from '@/providers/StripeProvider';

<StripeProvider>
  <YourApp />
</StripeProvider>
```

### NGOPricingPage
Displays NGO pricing plans:
```jsx
import { NGOPricingPage } from '@/components/payment/NGOPricingPage';

<NGOPricingPage onSelectPlan={(plan) => {
  // Handle plan selection
}} />
```

### NGOPaymentCheckout
Complete payment checkout flow:
```jsx
import { NGOPaymentCheckout } from '@/components/payment/NGOPaymentCheckout';

<NGOPaymentCheckout
  planType="professional"
  amount={99.99}
  organizationId="org_123"
  organizationName="My NGO"
  email="contact@myng o.org"
  onSuccess={(data) => console.log('Payment success:', data)}
  onError={(error) => console.error('Payment error:', error)}
/>
```

## Payment Flow

1. **NGO selects plan** → Frontend displays `NGOPricingPage`
2. **NGO enters card details** → Frontend initializes `NGOPaymentCheckout`
3. **Backend creates payment intent** → `POST /api/payment/create-intent`
4. **Stripe processed card** → `stripe.confirmCardPayment()`
5. **Backend confirms payment** → `POST /api/payment/confirm`
6. **NGO gets verified** → User marked as verified, plan upgraded

## Testing

### Using Stripe Test Cards
Use these card numbers in test mode:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Auth Required:** 4000 0025 0000 3155

**Expiry:** Any future date (e.g., 12/25)
**CVC:** Any 3 digits

### Test Payment Flow
1. Use test Stripe keys in `.env`
2. Navigate to NGO payment page
3. Select a plan
4. Use test card number `4242 4242 4242 4242`
5. Complete the payment
6. Check payments table: `SELECT * FROM payments;`

## Troubleshooting

### "Stripe not initialized"
- Check `STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY` in `.env`
- Restart backend server
- Clear frontend cache

### "PaymentIntent error"
- Verify organization_id format
- Check if user is authenticated as NGO role
- Ensure amount is > 0

### "Card declined"
- Use test cards from Stripe documentation
- Check card element styling
- Verify Stripe API keys are correct

## Security Notes

- **Never** commit `.env` file with real keys
- **Always** use HTTPS in production
- **Never** store card details - let Stripe handle it
- **Validate** all payments on the backend
- **Log** all payment transactions

## Production Transition

When ready for production:

1. Get live Stripe API keys from dashboard
2. Update `.env` with live keys
3. Change `STRIPE_CURRENCY` if needed
4. Run migrations on production database
5. Test with real payments (small amounts)
6. Monitor `payments` table for issues

## Support

For issues:
- Check Stripe logs: https://dashboard.stripe.com/logs
- Review backend payment controller
- Check browser console for frontend errors
- Review Laravel logs: `storage/logs/laravel.log`
