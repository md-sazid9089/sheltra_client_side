<?php

namespace App\Services;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Exception;

class RefugeeService
{
    /**
     * Analyze CV text with Gemini and return a structured result.
     *
     * @param array $payload
     * @return array
     * @throws Exception
     */
    public function analyzeCv(array $payload)
    {
        $apiKey = config('services.google_ai.api_key');
        $model = config('services.google_ai.model', 'gemini-2.0-flash');
        $baseUrl = rtrim(config('services.google_ai.base_url', 'https://generativelanguage.googleapis.com/v1beta'), '/');

        if (empty($apiKey)) {
            throw new Exception('Gemini API key is not configured. Set GEMINI_API_KEY in the backend environment.');
        }

        $cvText = $payload['cv_text'];
        $targetRole = $payload['target_role'] ?? 'Not specified';
        $targetCountry = $payload['target_country'] ?? 'Not specified';

        $prompt = "You are a CV analysis assistant for refugees and migrants. Analyze the CV and return STRICT JSON only with this schema: "
            . "{\"score\": number 0-100, \"label\": \"Strong|Good|Fair|Needs Work\", \"summary\": string, "
            . "\"suggestions\": string[], \"strengths\": string[], \"gaps\": string[]}. "
            . "Keep suggestions practical and concise.\n\n"
            . "Target role: {$targetRole}\n"
            . "Target country: {$targetCountry}\n\n"
            . "CV text:\n{$cvText}";

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

        if (!$response->successful()) {
            throw new Exception('Gemini request failed with status ' . $response->status());
        }

        $json = $response->json();
        $rawText = $json['candidates'][0]['content']['parts'][0]['text'] ?? null;

        if (!$rawText) {
            throw new Exception('Gemini response did not contain analysis text.');
        }

        $decoded = json_decode($rawText, true);
        if (!is_array($decoded)) {
            $start = strpos($rawText, '{');
            $end = strrpos($rawText, '}');
            if ($start !== false && $end !== false && $end > $start) {
                $maybeJson = substr($rawText, $start, $end - $start + 1);
                $decoded = json_decode($maybeJson, true);
            }
        }

        if (!is_array($decoded)) {
            throw new Exception('Could not parse structured Gemini JSON output.');
        }

        $score = (int) ($decoded['score'] ?? 0);
        $score = max(0, min(100, $score));
        $label = $decoded['label'] ?? ($score >= 80 ? 'Strong' : ($score >= 60 ? 'Good' : ($score >= 45 ? 'Fair' : 'Needs Work')));
        $labelVariant = $label === 'Strong' ? 'success' : ($label === 'Good' ? 'accent' : ($label === 'Fair' ? 'warning' : 'error'));

        return [
            'score' => $score,
            'label' => $label,
            'labelVariant' => $labelVariant,
            'summary' => (string) ($decoded['summary'] ?? ''),
            'suggestions' => array_values(array_filter($decoded['suggestions'] ?? [], 'is_string')),
            'strengths' => array_values(array_filter($decoded['strengths'] ?? [], 'is_string')),
            'gaps' => array_values(array_filter($decoded['gaps'] ?? [], 'is_string')),
        ];
    }

    /**
     * Get refugee profile by user ID.
     *
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function getProfile($userId)
    {
        try {
            // Placeholder: In production, query Refugee model
            return [
                'id' => $userId,
                'full_name' => 'Refugee Name',
                'country_of_origin' => 'Syria',
                'legal_status' => 'refugee',
                'availability' => 'full_time',
                'languages' => ['Arabic', 'English'],
                'skills' => ['Teaching', 'Carpentry'],
                'experience_summary' => 'Summary of professional experience...',
                'verified_skills' => ['Teaching'],
                'profile_completion' => 75,
                'created_at' => now()->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve refugee profile: ' . $e->getMessage());
        }
    }

    /**
     * Update refugee profile.
     *
     * @param int $userId
     * @param array $data
     * @return array
     * @throws Exception
     */
    public function updateProfile($userId, $data)
    {
        try {
            // Placeholder: In production, update Refugee model
            // Validate data passed from RefugeeProfileRequest
            $updated = array_merge([
                'id' => $userId,
                'full_name' => 'Updated Name',
                'country_of_origin' => $data['country_of_origin'] ?? 'Syria',
                'legal_status' => $data['legal_status'] ?? 'refugee',
                'availability' => $data['availability'] ?? 'full_time',
                'languages' => $data['languages'] ?? [],
                'experience_summary' => $data['experience_summary'] ?? '',
            ], $data);

            return $updated;
        } catch (Exception $e) {
            throw new Exception('Failed to update refugee profile: ' . $e->getMessage());
        }
    }

    /**
     * Get opportunities matched for refugee.
     *
     * @param int $userId
     * @param array $filters
     * @return array
     * @throws Exception
     */
    public function getMatchedOpportunities($userId, $filters = [])
    {
        try {
            // Placeholder: In production, query Job model with skill matching
            return [
                [
                    'id' => 1,
                    'title' => 'Teaching Assistant',
                    'company' => 'Local School',
                    'location' => 'Berlin, Germany',
                    'match_percentage' => 85,
                    'required_skills' => ['Teaching'],
                    'role_type' => 'full_time',
                ],
                [
                    'id' => 2,
                    'title' => 'Carpenter',
                    'company' => 'Build & Construct',
                    'location' => 'Berlin, Germany',
                    'match_percentage' => 70,
                    'required_skills' => ['Carpentry'],
                    'role_type' => 'contract',
                ],
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve opportunities: ' . $e->getMessage());
        }
    }

    /**
     * Get verification status of refugee skills.
     *
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function getVerificationStatus($userId)
    {
        try {
            // Placeholder: In production, query Verification model
            return [
                'overall_status' => 'partially_verified',
                'verified_skills' => ['Teaching'],
                'pending_skills' => ['Carpentry'],
                'rejected_skills' => [],
                'skills' => [
                    [
                        'skill' => 'Teaching',
                        'status' => 'verified',
                        'verified_by' => 'NGO Name',
                        'verified_at' => now()->subDays(10)->toIso8601String(),
                    ],
                    [
                        'skill' => 'Carpentry',
                        'status' => 'pending',
                        'submitted_at' => now()->subDays(5)->toIso8601String(),
                    ],
                ],
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve verification status: ' . $e->getMessage());
        }
    }

    /**
     * Update skills for refugee.
     *
     * @param int $userId
     * @param array $skills
     * @return array
     * @throws Exception
     */
    public function updateSkills($userId, $skills)
    {
        try {
            // Placeholder: In production, update Refugee skills relationship
            return [
                'id' => $userId,
                'skills' => $skills,
                'message' => 'Skills updated successfully.',
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to update skills: ' . $e->getMessage());
        }
    }

    /**
     * Get applications submitted by refugee.
     *
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function getApplications($userId)
    {
        try {
            // Placeholder: In production, query Application model
            return [
                [
                    'id' => 1,
                    'job_title' => 'Teaching Assistant',
                    'company' => 'Local School',
                    'status' => 'under_review',
                    'applied_at' => now()->subDays(3)->toIso8601String(),
                ],
                [
                    'id' => 2,
                    'job_title' => 'Carpenter',
                    'company' => 'Build & Construct',
                    'status' => 'rejected',
                    'applied_at' => now()->subDays(15)->toIso8601String(),
                ],
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve applications: ' . $e->getMessage());
        }
    }
}
