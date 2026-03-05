import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FaGlobe, FaUser, FaEnvelope } from 'react-icons/fa';

const COUNTRIES = [
    'Afghanistan',
    'Armenia',
    'Azerbaijan',
    'Bangladesh',
    'Bhutan',
    'Burundi',
    'Chad',
    'Congo',
    'Egypt',
    'El Salvador',
    'Eritrea',
    'Ethiopia',
    'Georgia',
    'Guatemala',
    'Honduras',
    'Iran',
    'Iraq',
    'Jordan',
    'Kenya',
    'Lebanon',
    'Libya',
    'Mali',
    'Mauritania',
    'Myanmar',
    'Nepal',
    'Niger',
    'Nigeria',
    'Pakistan',
    'Palestine',
    'Rwanda',
    'Somalia',
    'South Sudan',
    'Sudan',
    'Syria',
    'Uganda',
    'Ukraine',
    'Yemen',
    'Zimbabwe',
];

export function NIDGenerationForm({ onSubmit, isLoading }) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: '',
            country: '',
            email: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Field */}
            <div className="relative">
                <label htmlFor="fullName" className="block text-sm font-medium text-text-primary dark:text-text-darkPrimary mb-2">
                    <span className="flex items-center gap-2">
                        <FaUser className="text-cyan-400" size={16} />
                        Full Name
                    </span>
                </label>
                <input
                    {...register('fullName', {
                        required: 'Full name is required',
                        minLength: {
                            value: 3,
                            message: 'Full name must be at least 3 characters',
                        },
                        maxLength: {
                            value: 50,
                            message: 'Full name must not exceed 50 characters',
                        },
                    })}
                    type="text"
                    id="fullName"
                    placeholder="e.g., Ahmad Hassan"
                    className="w-full px-4 py-3 bg-white dark:bg-surface-darkBase border border-border-light dark:border-border-dark rounded-lg text-text-primary dark:text-text-darkPrimary placeholder-text-muted dark:placeholder-text-darkMuted focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                />
                {errors.fullName && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        ✕ {errors.fullName.message}
                    </p>
                )}
            </div>

            {/* Country Field */}
            <div className="relative">
                <label htmlFor="country" className="block text-sm font-medium text-text-primary dark:text-text-darkPrimary mb-2">
                    <span className="flex items-center gap-2">
                        <FaGlobe className="text-cyan-400" size={16} />
                        Country of Origin
                    </span>
                </label>
                <select
                    {...register('country', {
                        required: 'Country is required',
                    })}
                    id="country"
                    className="w-full px-4 py-3 bg-white dark:bg-surface-darkBase border border-border-light dark:border-border-dark rounded-lg text-text-primary dark:text-text-darkPrimary focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all appearance-none cursor-pointer"
                >
                    <option value="">Select your country of origin</option>
                    {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                            {country}
                        </option>
                    ))}
                </select>
                {errors.country && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        ✕ {errors.country.message}
                    </p>
                )}
            </div>

            {/* Email Field (Optional) */}
            <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-text-primary dark:text-text-darkPrimary mb-2">
                    <span className="flex items-center gap-2">
                        <FaEnvelope className="text-cyan-400" size={16} />
                        Email (Optional)
                    </span>
                </label>
                <input
                    {...register('email', {
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Please enter a valid email address',
                        },
                    })}
                    type="email"
                    id="email"
                    placeholder="e.g., ahmad@example.com"
                    className="w-full px-4 py-3 bg-white dark:bg-surface-darkBase border border-border-light dark:border-border-dark rounded-lg text-text-primary dark:text-text-darkPrimary placeholder-text-muted dark:placeholder-text-darkMuted focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                />
                {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                        ✕ {errors.email.message}
                    </p>
                )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" loading={isLoading} disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit for Verification'}
            </Button>

            <p className="text-xs text-text-secondary dark:text-text-darkSecondary text-center">
                Your information will be securely verified by our NGO partners within 24-48 hours.
            </p>
        </form>
    );
}
