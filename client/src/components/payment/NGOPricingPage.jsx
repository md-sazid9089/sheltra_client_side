import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ActionButton } from '@/components/ui/ActionButton';
import { FaCheck, FaCreditCard } from 'react-icons/fa';

const PRICING_PLANS = [
    {
        type: 'basic',
        name: 'Basic',
        price: 29.99,
        description: 'Perfect for small NGOs starting out',
        features: [
            'Up to 10 verified refugee profiles',
            'Basic certification process',
            'Email support',
            'Quarterly reporting',
            'Standard verification badge',
        ],
        cta: 'Get Started',
        highlighted: false,
    },
    {
        type: 'professional',
        name: 'Professional',
        price: 99.99,
        description: 'Most popular for growing NGOs',
        features: [
            'Up to 100 verified refugee profiles',
            'Advanced verification process',
            'Priority email & chat support',
            'Monthly detailed reports',
            'Premium verification badge',
            'API access',
            'Custom branding',
        ],
        cta: 'Get Started',
        highlighted: true,
    },
    {
        type: 'enterprise',
        name: 'Enterprise',
        price: 299.99,
        description: 'For large organizations',
        features: [
            'Unlimited verified profiles',
            'Full verification suite',
            '24/7 dedicated support',
            'Real-time analytics dashboard',
            'Enterprise verification badge',
            'Full API access',
            'White-label options',
            'Custom integration support',
        ],
        cta: 'Contact Sales',
        highlighted: false,
    },
];

export function NGOPricingPage({ onSelectPlan }) {
    const [selectedPlan, setSelectedPlan] = useState(null);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan.type);
        if (onSelectPlan) {
            onSelectPlan(plan);
        }
    };

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                    NGO Verification Plans
                </h1>
                <p className="text-xl text-slate-300">
                    Choose the right plan for your organization to verify and support refugees on Sheltra
                </p>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
                {PRICING_PLANS.map((plan) => (
                    <Card
                        key={plan.type}
                        className={`relative flex flex-col h-full transition-all ${
                            plan.highlighted
                                ? 'ring-2 ring-cyan-400 scale-105 shadow-2xl'
                                : 'hover:shadow-lg'
                        }`}
                    >
                        {/* Popular Badge */}
                        {plan.highlighted && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                    Most Popular
                                </div>
                            </div>
                        )}

                        {/* Content */}
                        <div className={`p-8 flex flex-col h-full ${plan.highlighted ? 'pt-10' : ''}`}>
                            {/* Plan Name & Description */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-300 text-sm">{plan.description}</p>
                            </div>

                            {/* Pricing */}
                            <div className="mb-8">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-bold text-cyan-300">${plan.price}</span>
                                    <span className="text-slate-400 text-lg">/month</span>
                                </div>
                                <p className="text-xs text-slate-500">Billed monthly, cancel anytime</p>
                            </div>

                            {/* Features List */}
                            <div className="space-y-3 mb-8 flex-grow">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <FaCheck className="text-green-400 flex-shrink-0 mt-0.5" size={16} />
                                        <span className="text-slate-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <ActionButton
                                onClick={() => handleSelectPlan(plan)}
                                variant={plan.highlighted ? 'primary' : 'secondary'}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <FaCreditCard size={16} />
                                {plan.cta}
                            </ActionButton>
                        </div>
                    </Card>
                ))}
            </div>

            {/* FAQ Section */}
            <div className="max-w-2xl mx-auto pt-12 border-t border-slate-700">
                <h2 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h2>
                <div className="space-y-6">
                    {[
                        {
                            q: 'Can I change my plan later?',
                            a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the next billing cycle.',
                        },
                        {
                            q: 'Is there a trial period?',
                            a: 'We offer a 14-day free trial for all plans. No credit card required to start.',
                        },
                        {
                            q: 'What payment methods do you accept?',
                            a: 'We accept all major credit cards (Visa, Mastercard, American Express) through Stripe.',
                        },
                        {
                            q: 'Do you offer discounts for non-profits?',
                            a: 'Yes! Non-profit organizations receive a 30% discount on all plans. Contact our sales team for details.',
                        },
                    ].map((item, idx) => (
                        <div key={idx} className="space-y-2">
                            <h4 className="font-semibold text-white">{item.q}</h4>
                            <p className="text-slate-300 text-sm">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
