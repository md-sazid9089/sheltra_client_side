import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '@/lib/api';
import ActionButton from '@/components/ui/ActionButton';
import { FaCreditCard, FaLock } from 'react-icons/fa';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#ffffff',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            '::placeholder': {
                color: '#64748b',
            },
        },
        invalid: {
            color: '#ef4444',
        },
    },
    hidePostalCode: true,
};

export function NGOPaymentForm({ planType, amount, organizationId, organizationName, email, onSuccess, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            if (!stripe || !elements) {
                throw new Error('Stripe or Elements not initialized');
            }

            // Step 1: Create payment intent on backend
            const intentResponse = await api.post('/payment/create-intent', {
                amount,
                plan_type: planType,
                organization_id: organizationId,
                organization_name: organizationName,
                email,
            });

            if (!intentResponse.data.success) {
                throw new Error(intentResponse.data.error || 'Failed to create payment intent');
            }

            const { client_secret, payment_intent_id } = intentResponse.data;

            // Step 2: Confirm payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        email,
                        name: organizationName,
                    },
                },
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }

            if (paymentIntent.status === 'succeeded') {
                // Step 3: Confirm payment on backend
                const confirmResponse = await api.post('/payment/confirm', {
                    payment_intent_id: payment_intent_id,
                    organization_id: organizationId,
                });

                if (confirmResponse.data.success) {
                    setSuccess(true);
                    // Clear form
                    elements.getElement(CardElement).clear();
                    if (onSuccess) onSuccess(confirmResponse.data);
                } else {
                    throw new Error(confirmResponse.data.error || 'Payment confirmation failed');
                }
            } else {
                throw new Error(`Payment failed with status: ${paymentIntent.status}`);
            }
        } catch (err) {
            const errorMessage = err.message || 'An error occurred during payment processing';
            setError(errorMessage);
            if (onError) onError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Element */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-cyan-300 flex items-center gap-2">
                    <FaCreditCard size={16} />
                    Card Details
                </label>
                <div className="p-4 rounded-lg border border-cyan-500/30 bg-white/5 backdrop-blur-sm">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <FaLock className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                <div className="text-sm text-green-300">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p className="text-xs opacity-90">Your payment is encrypted and processed securely by Stripe. We never store your card details.</p>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-300 text-sm">{error}</p>
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-green-300 text-sm font-semibold">✓ Payment successful! Your NGO has been verified.</p>
                </div>
            )}

            {/* Amount Summary */}
            <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                <div className="flex justify-between items-center">
                    <span className="text-slate-300">Amount to Charge:</span>
                    <span className="text-2xl font-bold text-cyan-300">${amount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-2">{planType.charAt(0).toUpperCase() + planType.slice(1)} Plan</p>
            </div>

            {/* Submit Button */}
            <ActionButton
                type="submit"
                disabled={!stripe || loading || success}
                className="w-full"
                variant={success ? 'success' : 'primary'}
            >
                {loading ? 'Processing...' : success ? 'Payment Complete' : `Pay $${amount.toFixed(2)}`}
            </ActionButton>

            {/* Terms */}
            <p className="text-xs text-slate-400 text-center">
                By confirming this payment, you agree to Sheltra's{' '}
                <a href="#" className="text-cyan-400 hover:text-cyan-300 underline">
                    Terms of Service
                </a>
            </p>
        </form>
    );
}
