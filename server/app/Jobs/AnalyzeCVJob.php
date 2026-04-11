<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\RefugeeProfile;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AnalyzeCVJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The maximum number of unhandled exceptions to allow before failing.
     *
     * @var int
     */
    public $maxExceptions = 1;

    /**
     * The number of seconds to wait before retrying the job.
     *
     * @var int
     */
    public $backoff = [60, 120, 300]; // Exponential backoff

    private $userId;
    private $cvText;
    private $targetRole;
    private $targetCountry;

    /**
     * Create a new job instance.
     */
    public function __construct(int $userId, string $cvText, string $targetRole = '', string $targetCountry = '')
    {
        $this->userId = $userId;
        $this->cvText = $cvText;
        $this->targetRole = $targetRole;
        $this->targetCountry = $targetCountry;
    }

    /**
     * Execute the job - Analyze CV using Gemini AI
     * This runs asynchronously without blocking the HTTP request
     */
    public function handle(): void
    {
        try {
            Log::info('AnalyzeCVJob started', [
                'user_id' => $this->userId,
                'cv_length' => strlen($this->cvText),
            ]);

            $apiKey = config('services.google_ai.api_key');
            $model = config('services.google_ai.model', 'gemini-3-flash-preview');
            $baseUrl = rtrim(config('services.google_ai.base_url', 'https://generativelanguage.googleapis.com/v1beta'), '/');

            if (empty($apiKey)) {
                Log::warning('Gemini API key not configured');
                return;
            }

            $prompt = "You are a CV analysis assistant for refugees and migrants. Analyze the CV and return STRICT JSON only with this schema: "
                . "{\"score\": number 0-100, \"label\": \"Strong|Good|Fair|Needs Work\", \"summary\": string, "
                . "\"suggestions\": string[], \"strengths\": string[], \"gaps\": string[]}. "
                . "Keep suggestions practical and concise.\n\n"
                . "Target role: {$this->targetRole}\n"
                . "Target country: {$this->targetCountry}\n\n"
                . "CV text:\n{$this->cvText}";

            // Make API call with retries
            $response = $this->makeGeminiRequest($baseUrl, $model, $apiKey, $prompt);

            if (!$response) {
                Log::error('Gemini API failed after retries', ['user_id' => $this->userId]);
                return;
            }

            // Store result in refugee profile or cache
            $this->storeAnalysisResult($response);

            Log::info('AnalyzeCVJob completed successfully', [
                'user_id' => $this->userId,
                'score' => $response['score'] ?? null,
            ]);
        } catch (\Exception $e) {
            Log::error('AnalyzeCVJob failed', [
                'user_id' => $this->userId,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Make Gemini API request with retry logic
     */
    private function makeGeminiRequest(string $baseUrl, string $model, string $apiKey, string $prompt): ?array
    {
        for ($attempt = 1; $attempt <= $this->tries; $attempt++) {
            try {
                $response = Http::timeout(45)
                    ->withHeaders(['Content-Type' => 'application/json'])
                    ->post("{$baseUrl}/models/{$model}:generateContent?key={$apiKey}", [
                        'contents' => [
                            [
                                'parts' => [
                                    ['text' => $prompt],
                                ],
                            ],
                        ],
                    ]);

                if ($response->successful()) {
                    $json = $response->json();
                    $rawText = $json['candidates'][0]['content']['parts'][0]['text'] ?? null;

                    if ($rawText) {
                        $decoded = json_decode($rawText, true);
                        if (!is_array($decoded)) {
                            $start = strpos($rawText, '{');
                            $end = strrpos($rawText, '}');
                            if ($start !== false && $end !== false && $end > $start) {
                                $maybeJson = substr($rawText, $start, $end - $start + 1);
                                $decoded = json_decode($maybeJson, true);
                            }
                        }
                        return is_array($decoded) ? $decoded : null;
                    }
                }

                if (!in_array($response->status(), [429, 500, 502, 503, 504], true)) {
                    break;
                }

                if ($attempt < $this->tries) {
                    sleep($this->backoff[$attempt - 1] ?? 60);
                }
            } catch (\Exception $e) {
                Log::warning("AnalyzeCVJob API call attempt $attempt failed: " . $e->getMessage());
                if ($attempt < $this->tries) {
                    sleep($this->backoff[$attempt - 1] ?? 60);
                }
            }
        }

        return null;
    }

    /**
     * Store CV analysis result for later retrieval
     */
    private function storeAnalysisResult(array $result): void
    {
        // Store in cache for 24 hours
        cache()->put("cv_analysis:{$this->userId}", $result, now()->addDay());
    }
}
