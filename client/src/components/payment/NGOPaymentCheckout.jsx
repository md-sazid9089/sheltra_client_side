import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { NGOPaymentForm } from './NGOPaymentForm';
import { useStripe } from '@/providers/StripeProvider';
import { Card } from '@/components/ui/Card';
import { FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

export function NGOPaymentCheckout({
    planType = 'professional',
    amount = 99.99,
    organizationId = '',
    organizationName = '',
    email = '',
    onSuccess,
    onError,
}) {
    const { stripe, loading, error: stripeError } = useStripe();
    const [paymentComplete, setPaymentComplete] = useState(false);

    const handlePaymentSuccess = (data) => {
        setPaymentComplete(true);
        if (onSuccess) onSuccess(data);
    };

    const handlePaymentError = (error) => {
        if (onError) onError(error);
    };

    if (loading) {
        return (
            <Card className="p-8">
                <div className="text-center space-y-4">
                    <div className="inline-block p-4 rounded-full bg-cyan-500/10 animate-pulse">
                        <FaShieldAlt className="text-cyan-400" size={32} />
                    </div>
                    <p className="text-slate-300">Initializing payment system...</p>
                </div>
            </Card>
        );
    }

    if (stripeError || !stripe) {
        return (
            <Card className="p-8 border-red-500/20 bg-red-500/5">
                <div className="text-center space-y-4">
                    <p className="text-red-300 font-semibold">Payment system unavailable</p>
                    <p className="text-red-200/70 text-sm">{stripeError || 'Failed to initialize Stripe'}</p>
                </div>
            </Card>
        );
    }

    if (paymentComplete) {
        return (
            <Card className="p-8 border-green-500/20 bg-green-500/5">
                <div className="text-center space-y-4">
                    <FaCheckCircle className="text-green-400 text-5xl mx-auto" />
                    <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
                    <p className="text-green-300">Your NGO verification has been upgraded to the {planType} plan.</p>
                    <div className="pt-4 border-t border-green-500/20 mt-6">
                        <p className="text-sm text-slate-300">
                            You'll receive a confirmation email shortly with your receipt and plan details.
                        </p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-8">
            <div className="space-y-6">
                {/* Header */}
                <div className="space-y-2 pb-6 border-b border-cyan-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <FaShieldAlt className="text-cyan-400" size={24} />
                        <h2 className="text-2xl font-bold text-white">Complete Your Payment</h2>
                    </div>
                    <p className="text-slate-300">
                        Upgrade your NGO account to {planType} plan with full verification benefits.
                    </p>
                </div>

                {/* Order Summary */}
                <div className="bg-white/5 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                        <span className="text-slate-300">Plan:</span>
                        <span className="font-semibold text-white capitalize">{planType} Plan</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-300">Organization:</span>
                        <span className="font-semibold text-white">{organizationName}</span>
                    </div>
                    <div className="border-t border-cyan-500/10 pt-3 flex justify-between">
                        <span className="text-cyan-300 font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-cyan-300">${amount.toFixed(2)}</span>
                    </div>
                </div>

                {/* Payment Form */}
                {stripe && (
                    <Elements stripe={stripe}>
                        <NGOPaymentForm
                            planType={planType}
                            amount={amount}
                            organizationId={organizationId}
                            organizationName={organizationName}
                            email={email}
                            onSuccess={handlePaymentSuccess}
                            onError={handlePaymentError}
                        />
                    </Elements>
                )}
            </div>
        </Card>
    );
}
