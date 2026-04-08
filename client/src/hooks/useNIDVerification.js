import { useState, useCallback } from 'react';
import api from '@/lib/api';

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

    const handleFormSubmit = useCallback((data) => {
        setFormData(data);
        setStatus('submitted');
        setError('');
    }, []);

    const simulateVerification = useCallback(async () => {
        setStatus('verifying');
        setError('');

        try {
            // Call backend to generate NID
            const response = await api.post('/refugee/generate-nid', {
                full_name: formData.fullName,
                country: formData.country,
                email: formData.email,
            });

            if (response.data.success) {
                setNidData(response.data.data);
                setStatus('verified');
            } else {
                setStatus('failed');
                setError(response.data.message || 'NID generation failed. Please try again.');
            }
        } catch (err) {
            setStatus('failed');
            setError(err.response?.data?.message || 'Failed to generate NID. Please try again.');
        }
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
