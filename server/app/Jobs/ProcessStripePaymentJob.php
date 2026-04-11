<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Stripe\PaymentIntent;
use Stripe\Stripe;
use Illuminate\Support\Facades\Log;

class ProcessStripePaymentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Payment intent data
     */
    private $paymentIntentId;
    private $userId;
    private $amount;
    private $planType;

    /**
     * Number of retries
     */
    public $tries = 3;

    /**
     * Backoff strategy
     */
    public $backoff = [60, 120, 300];

    /**
     * Create a new job instance.
     */
    public function __construct(string $paymentIntentId, int $userId, float $amount, string $planType)
    {
        $this->paymentIntentId = $paymentIntentId;
        $this->userId = $userId;
        $this->amount = $amount;
        $this->planType = planType;
    }

    /**
     * Execute the job - Process Stripe payment confirmation
     */
    public function handle(): void
    {
        try {
            Log::info('ProcessStripePaymentJob started', [
                'payment_intent_id' => $this->paymentIntentId,
                'user_id' => $this->userId,
                'amount' => $this->amount,
                'plan_type' => $this->planType,
            ]);

            // Set Stripe API key
            Stripe::setApiKey(config('services.stripe.secret_key'));

            // Retrieve payment intent status
            $paymentIntent = PaymentIntent::retrieve($this->paymentIntentId);

            if ($paymentIntent->status === 'succeeded') {
                // Payment confirmed - update user verification or subscription status
                $user = User::find($this->userId);
                if ($user) {
                    $user->update([
                        'verification_status' => 'verified',
                        'verified_at' => now(),
                    ]);

                    Log::info('Payment verified and user updated', [
                        'user_id' => $this->userId,
                        'status' => 'verified',
                    ]);

                    // Dispatch event or send notification
                    // event(new PaymentSucceeded($user, $this->amount, $this->planType));
                }
            } elseif ($paymentIntent->status === 'requires_payment_method') {
                Log::warning('Payment requires payment method retry', [
                    'payment_intent_id' => $this->paymentIntentId,
                ]);
                // Could retry or notify user
            } else {
                Log::warning('Payment in unexpected status', [
                    'payment_intent_id' => $this->paymentIntentId,
                    'status' => $paymentIntent->status,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('ProcessStripePaymentJob failed', [
                'user_id' => $this->userId,
                'payment_intent_id' => $this->paymentIntentId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
