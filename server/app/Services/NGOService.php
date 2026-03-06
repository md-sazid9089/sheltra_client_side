<?php

namespace App\Services;

use Exception;

class NGOService
{
    /**
     * Get all cases assigned to NGO.
     *
     * @param int $ngoId
     * @param array $filters
     * @return array
     * @throws Exception
     */
    public function getCases($ngoId, $filters = [])
    {
        try {
            // Placeholder: In production, query Case model
            return [
                [
                    'id' => 1,
                    'refugee_name' => 'Ahmed Hassan',
                    'refugee_id' => 1,
                    'skills_to_verify' => ['Teaching', 'English'],
                    'status' => 'under_review',
                    'submitted_at' => now()->subDays(5)->toIso8601String(),
                ],
                [
                    'id' => 2,
                    'refugee_name' => 'Fatima Al-rashid',
                    'refugee_id' => 2,
                    'skills_to_verify' => ['Nursing'],
                    'status' => 'pending_decision',
                    'submitted_at' => now()->subDays(10)->toIso8601String(),
                ],
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve cases: ' . $e->getMessage());
        }
    }

    /**
     * Get detailed case information.
     *
     * @param int $caseId
     * @return array
     * @throws Exception
     */
    public function getCaseDetail($caseId)
    {
        try {
            // Placeholder: In production, query Case model with relationships
            return [
                'id' => $caseId,
                'refugee_id' => 1,
                'refugee_name' => 'Ahmed Hassan',
                'refugee_country' => 'Syria',
                'case_status' => 'under_review',
                'skills_to_verify' => ['Teaching', 'English'],
                'documents_submitted' => [
                    [
                        'id' => 1,
                        'name' => 'Certificate_Teaching.pdf',
                        'type' => 'education_certificate',
                        'verified' => false,
                    ],
                    [
                        'id' => 2,
                        'name' => 'Work_Reference.pdf',
                        'type' => 'reference_letter',
                        'verified' => false,
                    ],
                ],
                'notes_count' => 3,
                'created_at' => now()->subDays(5)->toIso8601String(),
                'updated_at' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve case detail: ' . $e->getMessage());
        }
    }

    /**
     * Submit verification decision for refugee skill.
     *
     * @param int $ngoId
     * @param int $caseId
     * @param int $refugeeId
     * @param array $verificationData
     * @return array
     * @throws Exception
     */
    public function submitVerification($ngoId, $caseId, $refugeeId, $verificationData)
    {
        try {
            // Placeholder: In production, create Verification model
            $validDecisions = ['approved', 'rejected', 'pending_review'];
            $decision = $verificationData['decision'] ?? 'pending_review';

            if (!in_array($decision, $validDecisions)) {
                throw new Exception('Invalid verification decision.');
            }

            return [
                'id' => 1,
                'case_id' => $caseId,
                'refugee_id' => $refugeeId,
                'decision' => $decision,
                'feedback' => $verificationData['feedback'] ?? '',
                'verified_by_ngo' => $ngoId,
                'verified_at' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to submit verification: ' . $e->getMessage());
        }
    }

    /**
     * Add case note/comment.
     *
     * @param int $caseId
     * @param int $ngoId
     * @param string $note
     * @return array
     * @throws Exception
     */
    public function addCaseNote($caseId, $ngoId, $note)
    {
        try {
            // Placeholder: In production, create CaseNote model
            return [
                'id' => 1,
                'case_id' => $caseId,
                'ngo_id' => $ngoId,
                'note' => $note,
                'created_at' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to add case note: ' . $e->getMessage());
        }
    }

    /**
     * Get all notes for a case.
     *
     * @param int $caseId
     * @return array
     * @throws Exception
     */
    public function getCaseNotes($caseId)
    {
        try {
            // Placeholder: In production, query CaseNote model
            return [
                [
                    'id' => 1,
                    'ngo_name' => 'Refugee Support NGO',
                    'note' => 'Reviewed teaching certificates. Authentic and verified from Ministry of Education.',
                    'created_at' => now()->subDays(3)->toIso8601String(),
                ],
                [
                    'id' => 2,
                    'ngo_name' => 'Refugee Support NGO',
                    'note' => 'Contacted previous employer for reference. Confirmed 5 years teaching experience.',
                    'created_at' => now()->subDays(1)->toIso8601String(),
                ],
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve case notes: ' . $e->getMessage());
        }
    }

    /**
     * Get NGO metrics and analytics.
     *
     * @param int $ngoId
     * @return array
     * @throws Exception
     */
    public function getMetrics($ngoId)
    {
        try {
            // Placeholder: In production, calculate from models
            return [
                'total_cases' => 25,
                'cases_approved' => 18,
                'cases_rejected' => 3,
                'cases_pending' => 4,
                'average_verification_days' => 15,
                'accuracy_rate' => 96,
                'refugees_helped' => 18,
                'verification_rate' => 92,
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve metrics: ' . $e->getMessage());
        }
    }
}
