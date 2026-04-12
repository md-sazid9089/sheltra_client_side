<?php

namespace App\Services;

use App\Models\Verification;
use App\Models\CaseNote;
use App\Models\NGOProfile;
use Illuminate\Support\Facades\Auth;
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
            // Verify NGO ownership
            if (Auth::id() && Auth::user()->role === 'ngo') {
                $userNgo = NGOProfile::where('user_id', Auth::id())->first();
                if (!$userNgo || $userNgo->id !== $ngoId) {
                    throw new Exception('Unauthorized access to NGO cases');
                }
            }

            $query = Verification::where('ngo_id', $ngoId)
                ->with('refugeeProfile.user')
                ->orderBy('created_at', 'desc');

            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            if (!empty($filters['page'])) {
                $perPage = $filters['per_page'] ?? 20;
                return $query->paginate($perPage)->toArray();
            }

            return $query->get()->toArray();
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
            $verification = Verification::with([
                'refugeeProfile.user',
                'notes.ngoUser'
            ])->findOrFail($caseId);

            // Verify NGO ownership
            if (Auth::id() && Auth::user()->role === 'ngo') {
                $userNgo = NGOProfile::where('user_id', Auth::id())->first();
                if (!$userNgo || $userNgo->id !== $verification->ngo_id) {
                    throw new Exception('Unauthorized access to case');
                }
            }

            return [
                'id' => $verification->id,
                'refugee_id' => $verification->refugeeProfile->user_id,
                'refugee_name' => $verification->refugeeProfile->full_name,
                'refugee_country' => $verification->refugeeProfile->country,
                'case_status' => $verification->status,
                'skills_to_verify' => $verification->refugeeProfile->skills ?? [],
                'notes_count' => $verification->notes->count(),
                'notes' => $verification->notes->map(function ($note) {
                    return [
                        'id' => $note->id,
                        'ngo_name' => $note->ngoUser->name,
                        'note' => $note->note,
                        'created_at' => $note->created_at->toIso8601String(),
                    ];
                })->toArray(),
                'created_at' => $verification->created_at->toIso8601String(),
                'updated_at' => $verification->updated_at->toIso8601String(),
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
            $validDecisions = ['approved', 'rejected', 'pending_review'];
            $decision = $verificationData['decision'] ?? 'pending_review';

            if (!in_array($decision, $validDecisions)) {
                throw new Exception('Invalid verification decision.');
            }

            $verification = Verification::findOrFail($caseId);

            // Verify NGO ownership
            if (Auth::id() && Auth::user()->role === 'ngo') {
                $userNgo = NGOProfile::where('user_id', Auth::id())->first();
                if (!$userNgo || $userNgo->id !== $verification->ngo_id) {
                    throw new Exception('Unauthorized to verify this case');
                }
            }

            $verification->update([
                'status' => $decision,
                'verified_date' => now(),
            ]);

            return $verification->toArray();
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
            $verification = Verification::findOrFail($caseId);

            // Verify NGO ownership
            if (Auth::id() && Auth::user()->role === 'ngo') {
                $userNgo = NGOProfile::where('user_id', Auth::id())->first();
                if (!$userNgo || $userNgo->id !== $verification->ngo_id) {
                    throw new Exception('Unauthorized to add notes to this case');
                }
            }

            $caseNote = CaseNote::create([
                'verification_id' => $caseId,
                'ngo_user_id' => Auth::id(),
                'note' => $note,
            ]);

            return $caseNote->toArray();
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
            $notes = CaseNote::where('verification_id', $caseId)
                ->with('ngoUser')
                ->orderBy('created_at', 'desc')
                ->get();

            return $notes->map(function ($note) {
                return [
                    'id' => $note->id,
                    'ngo_name' => $note->ngoUser->name,
                    'note' => $note->note,
                    'created_at' => $note->created_at->toIso8601String(),
                ];
            })->toArray();
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
            $ngo = NGOProfile::findOrFail($ngoId);
            $cases = Verification::where('ngo_id', $ngoId)->get();

            $totalCases = $cases->count();
            $approved = $cases->where('status', 'approved')->count();
            $rejected = $cases->where('status', 'rejected')->count();
            $pending = $cases->where('status', 'pending_review')->count();

            $avgDays = $cases->filter(function ($case) {
                return $case->verified_date && $case->submission_date;
            })->map(function ($case) {
                return $case->verified_date->diffInDays($case->submission_date);
            })->avg() ?? 0;

            $accuracyRate = $totalCases > 0 ? round(($approved / $totalCases) * 100) : 0;

            return [
                'total_cases' => $totalCases,
                'cases_approved' => $approved,
                'cases_rejected' => $rejected,
                'cases_pending' => $pending,
                'average_verification_days' => round($avgDays),
                'accuracy_rate' => $accuracyRate,
                'refugees_helped' => $approved,
                'verification_rate' => $totalCases > 0 ? round((($approved + $rejected) / $totalCases) * 100) : 0,
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve metrics: ' . $e->getMessage());
        }
    }
}
