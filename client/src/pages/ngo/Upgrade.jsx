import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

/**
 * NGO Upgrade/Payment Page
 * 
 * Displays pricing plans and allows NGOs to upgrade their verification status
 * by purchasing a plan via Stripe
 */
export default function NGOUpgrade() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29,
      description: 'Perfect for small NGOs',
      features: [
        'Verify up to 50 refugee profiles',
        'Access to dashboard',
        'Monthly reports',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      price: 99,
      description: 'For growing organizations',
      features: [
        'Verify up to 500 refugee profiles',
        'Advanced analytics',
        'Custom branding',
        'Priority support',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 299,
      description: 'For large-scale operations',
      features: [
        'Unlimited profile verifications',
        'Custom integrations',
        'Dedicated account manager',
        'Custom SLA',
      ],
    },
  ];

  const handleSelectPlan = async (plan) => {
    if (!user) {
      toast('Please log in first', 'error');
      navigate('/login');
      return;
    }

    setSelectedPlan(plan.id);
    setIsProcessing(true);

    try {
      // Step 1: Create payment intent on backend
      const intentResponse = await api.post('/payment/create-intent', {
        amount: plan.price,
        plan_type: plan.id,
        organization_id: user.id,
        organization_name: user.name || 'NGO Organization',
        email: user.email,
      });

      if (intentResponse.data.success) {
        const { client_secret, payment_intent_id } = intentResponse.data;

        // Step 2: Redirect to secure payment modal/form
        // In a real app, this would open Stripe Elements form
        // For now, we'll show a simplified payment success handler
        localStorage.setItem(
          'pending_payment',
          JSON.stringify({
            client_secret,
            payment_intent_id,
            plan_type: plan.id,
            amount: plan.price,
          })
        );

        toast(`Payment initiated for ${plan.name} plan`, 'success');

        // Simulate payment confirmation (in production, use Stripe.js Elements)
        setTimeout(async () => {
          try {
            const confirmResponse = await api.post('/payment/confirm', {
              payment_intent_id,
              organization_id: user.id,
            });

            if (confirmResponse.data.success) {
              toast('Payment successful! Your organization is now verified.', 'success');
              localStorage.removeItem('pending_payment');
              setTimeout(() => navigate('/ngo/dashboard'), 2000);
            }
          } catch (err) {
            toast('Payment confirmation failed. Please try again.', 'error');
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast(error.response?.data?.error || 'Failed to initiate payment', 'error');
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="space-y-12 motion-safe-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-text-primary dark:text-text-darkPrimary mb-4">
          Verify Your Organization
        </h1>
        <p className="text-lg text-text-secondary dark:text-text-darkSecondary max-w-2xl mx-auto">
          Choose a plan that fits your organization size and scale your refugee skill verification impact.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative flex flex-col transition-all duration-300 ${
              plan.popular
                ? 'border-2 border-cyan-500 shadow-lg scale-105'
                : 'border border-slate-200 dark:border-slate-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge variant="primary">Most Popular</Badge>
              </div>
            )}

            <Card.Header>
              <h2 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary">
                {plan.name}
              </h2>
              <p className="text-sm text-text-secondary dark:text-text-darkSecondary mt-1">
                {plan.description}
              </p>
            </Card.Header>

            <Card.Body className="flex-1 space-y-6">
              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-text-primary dark:text-text-darkPrimary">
                    ${plan.price}
                  </span>
                  <span className="text-text-secondary dark:text-text-darkSecondary">/month</span>
                </div>
                <p className="text-sm text-text-secondary dark:text-text-darkSecondary">
                  Billed annually (save 20%)
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-text-secondary dark:text-text-darkSecondary">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={isProcessing && selectedPlan === plan.id}
                variant={plan.popular ? 'primary' : 'secondary'}
                className="w-full mt-auto"
              >
                {isProcessing && selectedPlan === plan.id ? 'Processing...' : 'Upgrade Now'}
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto space-y-6">
        <h2 className="text-2xl font-semibold text-text-primary dark:text-text-darkPrimary text-center">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          <Card>
            <Card.Header>
              <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary">
                Is payment secure?
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-text-secondary dark:text-text-darkSecondary">
                Yes, all payments are processed through Stripe with bank-level encryption. Your card details are never stored on our servers.
              </p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary">
                Can I upgrade or downgrade anytime?
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-text-secondary dark:text-text-darkSecondary">
                Yes, you can change your plan at any time. Changes take effect immediately.
              </p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="font-semibold text-text-primary dark:text-text-darkPrimary">
                What if my organization doesn't verify within a month?
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-text-secondary dark:text-text-darkSecondary">
                There's no penalty. Your subscription renews monthly, and you can cancel anytime with no cancellation fees.
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-8 text-center">
        <h3 className="text-lg font-semibold text-text-primary dark:text-text-darkPrimary mb-2">
          Need help choosing a plan?
        </h3>
        <p className="text-text-secondary dark:text-text-darkSecondary mb-4">
          Contact our support team for personalized recommendations.
        </p>
        <Button variant="secondary" size="sm">
          Contact Support
        </Button>
      </div>
    </div>
  );
}
