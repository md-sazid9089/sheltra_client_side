import { useState, useCallback } from 'react';

// Custom hook for handling NID verification and generation
export const useNIDVerification = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        country: '',
        email: '',
    });

    const [status, setStatus] = useState('idle'); // idle, submitted, verifying, verified, failed
    const [nidData, setNidData] = useState(null);
    const [error, setError] = useState('');

    const generateNIDNumber = () => {
        // Generate a unique NID number (e.g., NID-20260306-XXXXX)
        const date = new Date();
        const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
        const randomPart = Math.random().toString(36).substring(2, 9).toUpperCase();
        return `NID-${dateStr}-${randomPart}`;
    };

    const handleFormSubmit = useCallback((data) => {
        setFormData(data);
        setStatus('submitted');
        setError('');
    }, []);

    const simulateVerification = useCallback(() => {
        setStatus('verifying');

        // Simulate API call with a delay (in real app, this would call backend)
        setTimeout(() => {
            // Mock verification - in real app, this would come from backend
            const isVerified = true; // Simulate successful verification

            if (isVerified) {
                const nidNumber = generateNIDNumber();
                const generatedNID = {
                    nidNumber,
                    fullName: formData.fullName,
                    country: formData.country,
                    email: formData.email,
                    status: 'Verified',
                    generatedAt: new Date().toISOString(),
                    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year validity
                };

                setNidData(generatedNID);
                setStatus('verified');
            } else {
                setStatus('failed');
                setError('NGO verification failed. Please contact support.');
            }
        }, 2000); // 2 second delay to simulate verification
    }, [formData]);

    const resetVerification = useCallback(() => {
        setFormData({
            fullName: '',
            country: '',
            email: '',
        });
        setStatus('idle');
        setNidData(null);
        setError('');
    }, []);

    return {
        formData,
        setFormData,
        status,
        nidData,
        error,
        handleFormSubmit,
        simulateVerification,
        resetVerification,
    };
};
