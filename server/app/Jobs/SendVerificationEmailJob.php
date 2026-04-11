<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendVerificationEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     *
     * @var int
     */
    public $maxExceptions = 1;

    /**
     * Number of retries
     */
    public $tries = 3;

    /**
     * User ID and event data
     */
    private $userId;
    private $recipientEmail;
    private $subject;
    private $body;
    private $eventType; // verification_success, payment_confirmed, etc.

    /**
     * Create a new job instance.
     */
    public function __construct(int $userId, string $recipientEmail, string $subject, string $body, string $eventType = 'general')
    {
        $this->userId = $userId;
        $this->recipientEmail = $recipientEmail;
        $this->subject = $subject;
        $this->body = $body;
        $this->eventType = $eventType;
    }

    /**
     * Execute the job - Send email notification
     */
    public function handle(): void
    {
        try {
            Log::info('SendVerificationEmailJob started', [
                'user_id' => $this->userId,
                'recipient' => $this->recipientEmail,
                'event_type' => $this->eventType,
            ]);

            // Send email (implement actual mailing logic based on your setup)
            // Example: Mail::raw($this->body, function ($msg) { ... });

            Log::info('SendVerificationEmailJob completed', [
                'user_id' => $this->userId,
                'event_type' => $this->eventType,
            ]);
        } catch (\Exception $e) {
            Log::error('SendVerificationEmailJob failed', [
                'user_id' => $this->userId,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
