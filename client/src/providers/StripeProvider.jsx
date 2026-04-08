import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadStripe } from '@stripe/js';
import { api } from '@/lib/api';

const StripeContext = createContext();

export function useStripe() {
    const context = useContext(StripeContext);
    if (!context) {
        throw new Error('useStripe must be used within StripeProvider');
    }
    return context;
}

export function StripeProvider({ children }) {
    const [stripe, setStripe] = useState(null);
    const [publishableKey, setPublishableKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const initializeStripe = async () => {
            try {
                // Fetch Stripe publishable key from backend
                const response = await api.get('/payment/stripe-key');
                
                if (response.data.publishable_key) {
                    setPublishableKey(response.data.publishable_key);
                    
                    // Load Stripe with the publishable key
                    const stripeInstance = await loadStripe(response.data.publishable_key);
                    setStripe(stripeInstance);
                } else {
                    throw new Error('Failed to retrieve Stripe publishable key');
                }
            } catch (err) {
                console.error('Error initializing Stripe:', err);
                setError(err.message || 'Failed to initialize Stripe');
            } finally {
                setLoading(false);
            }
        };

        initializeStripe();
    }, []);

    return (
        <StripeContext.Provider
            value={{
                stripe,
                publishableKey,
                loading,
                error,
            }}
        >
            {children}
        </StripeContext.Provider>
    );
}
