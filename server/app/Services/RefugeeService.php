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
        $model = config('services.google_ai.model', 'gemini-3-flash-preview');
        $baseUrl = rtrim(config('services.google_ai.base_url', 'https://generativelanguage.googleapis.com/v1beta'), '/');

        $cvText = $payload['cv_text'];
        $targetRole = $payload['target_role'] ?? 'Not specified';
        $targetCountry = $payload['target_country'] ?? 'Not specified';

        if (empty($apiKey)) {
            return $this->fallbackCvAnalysis(
                $cvText,
                'AI provider key is missing. Returned local analysis so users can continue.',
                $targetRole,
                $targetCountry
            );
        }

        $prompt = "You are a CV analysis assistant for refugees and migrants. Analyze the CV and return STRICT JSON only with this schema: "
            . "{\"score\": number 0-100, \"label\": \"Strong|Good|Fair|Needs Work\", \"summary\": string, "
            . "\"suggestions\": string[], \"strengths\": string[], \"gaps\": string[]}. "
            . "Keep suggestions practical and concise.\n\n"
            . "Target role: {$targetRole}\n"
            . "Target country: {$targetCountry}\n\n"
            . "CV text:\n{$cvText}";

        try {
            $response = null;

            for ($attempt = 1; $attempt <= 3; $attempt++) {
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
                    break;
                }

                if (!in_array($response->status(), [429, 500, 502, 503, 504], true) || $attempt === 3) {
                    break;
                }

                usleep(1000000);
            }

            if (!$response->successful()) {
                return $this->fallbackCvAnalysis(
                    $cvText,
                    'Gemini request failed with status ' . $response->status() . '. Returned local analysis.',
                    $targetRole,
                    $targetCountry
                );
            }

            $json = $response->json();
            $rawText = $json['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$rawText) {
                return $this->fallbackCvAnalysis(
                    $cvText,
                    'Gemini response was empty. Returned local analysis.',
                    $targetRole,
                    $targetCountry
                );
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
                return $this->fallbackCvAnalysis(
                    $cvText,
                    'Gemini JSON output could not be parsed. Returned local analysis.',
                    $targetRole,
                    $targetCountry
                );
            }

            $score = max(0, min(100, (int) ($decoded['score'] ?? 0)));
            $label = $decoded['label'] ?? $this->labelFromScore($score);

            return [
                'score' => $score,
                'label' => $label,
                'labelVariant' => $this->labelVariantFromLabel($label),
                'summary' => (string) ($decoded['summary'] ?? ''),
                'suggestions' => array_values(array_filter($decoded['suggestions'] ?? [], 'is_string')),
                'strengths' => array_values(array_filter($decoded['strengths'] ?? [], 'is_string')),
                'gaps' => array_values(array_filter($decoded['gaps'] ?? [], 'is_string')),
                'analysis_source' => 'gemini',
                'fallback_used' => false,
            ];
        } catch (\Throwable $e) {
            return $this->fallbackCvAnalysis(
                $cvText,
                'Gemini is temporarily unavailable (' . $e->getMessage() . '). Returned local analysis.',
                $targetRole,
                $targetCountry
            );
        }
    }

    /**
     * Build deterministic local CV analysis when AI provider is unavailable.
     *
     * @param string $cvText
     * @param string $reason
     * @param string $targetRole
     * @param string $targetCountry
     * @return array
     */
    private function fallbackCvAnalysis($cvText, $reason, $targetRole = 'Not specified', $targetCountry = 'Not specified')
    {
        $wordCount = str_word_count($cvText);
        $hasContact = (bool) preg_match('/email|phone|\+\d|@/i', $cvText);
        $hasExperience = (bool) preg_match('/experience|work|worked|developer|engineer|analyst|manager|lead/i', $cvText);
        $hasSkills = (bool) preg_match('/skills?|proficient|expertise|php|javascript|react|laravel|sql|python|excel|design/i', $cvText);
        $hasEducation = (bool) preg_match('/education|university|college|degree|bachelor|master|diploma|certificate/i', $cvText);
        $hasLanguages = (bool) preg_match('/language|english|arabic|french|swahili|hindi|spanish/i', $cvText);

        $score = 30;
        if ($wordCount >= 80) {
            $score += 10;
        }
        if ($wordCount >= 180) {
            $score += 10;
        }
        if ($hasContact) {
            $score += 15;
        }
        if ($hasExperience) {
            $score += 15;
        }
        if ($hasSkills) {
            $score += 10;
        }
        if ($hasEducation) {
            $score += 5;
        }
        if ($hasLanguages) {
            $score += 5;
        }
        $score = max(0, min(100, $score));

        $strengths = [];
        $gaps = [];
        $suggestions = [];

        if ($hasContact) {
            $strengths[] = 'CV contains contact information.';
        } else {
            $gaps[] = 'Contact information is missing.';
            $suggestions[] = 'Add email address and phone number in the header.';
        }

        if ($hasExperience) {
            $strengths[] = 'CV includes experience details.';
        } else {
            $gaps[] = 'Work experience section is weak or missing.';
            $suggestions[] = 'Add a work experience section with achievements and responsibilities.';
        }

        if ($hasSkills) {
            $strengths[] = 'CV lists relevant skills.';
        } else {
            $gaps[] = 'Skills section is missing or vague.';
            $suggestions[] = 'List technical and soft skills with concrete tools or competencies.';
        }

        if (!$hasEducation) {
            $gaps[] = 'Education or certification details are missing.';
            $suggestions[] = 'Add education, certifications, or training history.';
        }

        if (!$hasLanguages) {
            $gaps[] = 'Language proficiency is not stated.';
            $suggestions[] = 'Include languages and proficiency levels.';
        }

        if ($wordCount < 80) {
            $gaps[] = 'CV is too short for strong evaluation.';
            $suggestions[] = 'Increase detail to at least 300-500 words with measurable results.';
        }

        if (count($suggestions) === 0) {
            $suggestions[] = 'Add measurable outcomes (for example, delivery speed, quality, or impact metrics).';
        }

        $label = $this->labelFromScore($score);

        return [
            'score' => $score,
            'label' => $label,
            'labelVariant' => $this->labelVariantFromLabel($label),
            'summary' => 'AI provider is currently unavailable. This is a local CV analysis focused on structure and completeness.',
            'suggestions' => $suggestions,
            'strengths' => $strengths,
            'gaps' => $gaps,
            'analysis_source' => 'local_fallback',
            'fallback_used' => true,
            'fallback_reason' => $reason,
            'context' => [
                'target_role' => $targetRole,
                'target_country' => $targetCountry,
            ],
        ];
    }

    /**
     * Convert score to label.
     *
     * @param int $score
     * @return string
     */
    private function labelFromScore($score)
    {
        if ($score >= 80) {
            return 'Strong';
        }

        if ($score >= 60) {
            return 'Good';
        }

        if ($score >= 45) {
            return 'Fair';
        }

        return 'Needs Work';
    }

    /**
     * Convert label to UI badge variant.
     *
     * @param string $label
     * @return string
     */
    private function labelVariantFromLabel($label)
    {
        if ($label === 'Strong') {
            return 'success';
        }

        if ($label === 'Good') {
            return 'accent';
        }

        if ($label === 'Fair') {
            return 'warning';
        }

        return 'error';
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
                'location' => $data['location'] ?? '',
                'phone' => $data['phone'] ?? '',
                'bio' => $data['bio'] ?? '',
                'skills' => $data['skills'] ?? [],
                'education' => $data['education'] ?? '',
                'work_experience' => $data['work_experience'] ?? '',
                'availability' => $data['availability'] ?? 'immediate',
                'languages' => $data['languages'] ?? [],
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

    /**
     * Generate Virtual NID for refugee.
     *
     * @param int $userId
     * @param array $data
     * @return array
     * @throws Exception
     */
    public function generateNID($userId, $data)
    {
        try {
            // Generate unique NID number
            $date = now();
            $dateStr = $date->format('Ymd');
            $randomPart = strtoupper(substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'), 0, 7));
            $nidNumber = "NID-{$dateStr}-{$randomPart}";

            // Create NID record (placeholder: in production, would save to database)
            $nidData = [
                'nidNumber' => $nidNumber,
                'fullName' => $data['full_name'],
                'country' => $data['country'],
                'email' => $data['email'],
                'status' => 'Verified',
                'generatedAt' => now()->toIso8601String(),
                'expiryDate' => now()->addYear()->toIso8601String(),
                'qrCode' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            ];

            return $nidData;
        } catch (Exception $e) {
            throw new Exception('Failed to generate NID: ' . $e->getMessage());
        }
    }
}
