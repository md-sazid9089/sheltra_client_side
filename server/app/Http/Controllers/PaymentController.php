<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Customer;

class PaymentController extends Controller
{
    public function __construct()
    {
        // Set Stripe API key from environment
        Stripe::setApiKey(env('STRIPE_SECRET_KEY'));
    }

    /**
     * Create a payment intent for NGO verification
     * POST /api/payment/create-intent
     */
    public function createPaymentIntent(Request $request)
    {
        try {
            $validated = $request->validate([
                'amount' => 'required|numeric|min:1',
                'plan_type' => 'required|in:basic,professional,enterprise',
                'organization_id' => 'required|string',
                'organization_name' => 'required|string',
                'email' => 'required|email',
            ]);

            $user = auth()->user();

            // Create or retrieve Stripe customer
            $stripeCustomer = null;
            if ($user && $user->stripe_customer_id) {
                $stripeCustomer = Customer::retrieve($user->stripe_customer_id);
            } else {
                $stripeCustomer = Customer::create([
                    'email' => $validated['email'],
                    'name' => $validated['organization_name'],
                    'metadata' => [
                        'organization_id' => $validated['organization_id'],
                        'plan_type' => $validated['plan_type'],
                    ],
                ]);

                // Save Stripe customer ID to user if authenticated
                if ($user) {
                    $user->update(['stripe_customer_id' => $stripeCustomer->id]);
                }
            }

            // Create payment intent
            $paymentIntent = PaymentIntent::create([
                'amount' => (int)($validated['amount'] * 100), // Convert to cents
                'currency' => env('STRIPE_CURRENCY', 'usd'),
                'customer' => $stripeCustomer->id,
                'payment_method_types' => ['card'],
                'metadata' => [
                    'organization_id' => $validated['organization_id'],
                    'plan_type' => $validated['plan_type'],
                    'organization_name' => $validated['organization_name'],
                ],
                'description' => "NGO Verification - {$validated['plan_type']} Plan",
            ]);

            return response()->json([
                'success' => true,
                'client_secret' => $paymentIntent->client_secret,
                'payment_intent_id' => $paymentIntent->id,
                'amount' => $validated['amount'],
                'currency' => env('STRIPE_CURRENCY', 'usd'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Confirm payment and handle NGO verification upgrade
     * POST /api/payment/confirm
     */
    public function confirmPayment(Request $request)
    {
        try {
            $validated = $request->validate([
                'payment_intent_id' => 'required|string',
                'organization_id' => 'required|string',
            ]);

            // Retrieve payment intent from Stripe
            $paymentIntent = PaymentIntent::retrieve($validated['payment_intent_id']);

            // Check if payment was successful
            if ($paymentIntent->status === 'succeeded') {
                $user = auth()->user();

                if (!$user) {
                    return response()->json([
                        'success' => false,
                        'error' => 'User not authenticated',
                    ], 401);
                }

                // Update NGOProfile with verification status
                $ngoProfile = \App\Models\NGOProfile::where('user_id', $user->id)->first();

                if ($ngoProfile) {
                    $ngoProfile->update([
                        'verification_status' => 'verified',
                        'verified_at' => now(),
                        'plan_type' => $paymentIntent->metadata['plan_type'] ?? 'basic',
                    ]);
                }

                // Record payment in database
                \App\Models\Payment::create([
                    'user_id' => $user->id,
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'stripe_customer_id' => $paymentIntent->customer,
                    'plan_type' => $paymentIntent->metadata['plan_type'] ?? 'basic',
                    'amount' => $paymentIntent->amount / 100,
                    'currency' => $paymentIntent->currency,
                    'status' => 'succeeded',
                    'organization_id' => $paymentIntent->metadata['organization_id'] ?? null,
                    'organization_name' => $paymentIntent->metadata['organization_name'] ?? null,
                    'metadata' => $paymentIntent->metadata,
                    'paid_at' => now(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Payment successful. NGO verification upgraded.',
                    'payment_intent_id' => $paymentIntent->id,
                    'amount_received' => $paymentIntent->amount_received / 100,
                    'organization_name' => $ngoProfile->organization_name ?? 'Your Organization',
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Payment not completed. Status: ' . $paymentIntent->status,
            ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get customer payment history
     * GET /api/payment/history
     */
    public function paymentHistory(Request $request)
    {
        try {
            $user = auth()->user();

            if (!$user || !$user->stripe_customer_id) {
                return response()->json([
                    'success' => false,
                    'error' => 'No payment history found',
                ], 404);
            }

            // Retrieve recent payment intents for customer
            $paymentIntents = PaymentIntent::all([
                'customer' => $user->stripe_customer_id,
                'limit' => 10,
            ]);

            $payments = collect($paymentIntents->data)->map(function ($intent) {
                return [
                    'id' => $intent->id,
                    'amount' => $intent->amount / 100,
                    'currency' => $intent->currency,
                    'status' => $intent->status,
                    'created' => $intent->created,
                    'description' => $intent->description,
                ];
            });

            return response()->json([
                'success' => true,
                'payments' => $payments,
                'count' => count($payments),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get Stripe publishable key
     * GET /api/payment/stripe-key
     */
    public function getStripeKey()
    {
        return response()->json([
            'publishable_key' => env('STRIPE_PUBLIC_KEY'),
        ]);
    }
}
