<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\NGOService;
use App\Http\Requests\NGOCaseNoteRequest;
use App\Http\Requests\VerificationDecisionRequest;

/**
 * NGOController - Sheltra NGO Partner Case Management
 * 
 * Handles refugee verification cases, case notes, and verification decisions.
 */
class NGOController extends Controller
{
    protected $ngoService;

    public function __construct(NGOService $ngoService)
    {
        $this->middleware('auth');
        $this->middleware('role:ngo');
        $this->ngoService = $ngoService;
    }

    /**
     * Get all verification cases assigned to NGO.
     */
    public function getCases(Request $request)
    {
        try {
            $ngoId = Auth::id();
            $filters = $request->query();
            $cases = $this->ngoService->getCases($ngoId, $filters);

            return response()->json([
                'success' => true,
                'message' => 'Cases fetched successfully.',
                'data' => $cases,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch cases: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get detailed information for a specific case.
     */
    public function getCaseDetail($caseId)
    {
        try {
            $caseDetail = $this->ngoService->getCaseDetail($caseId);

            return response()->json([
                'success' => true,
                'message' => 'Case details fetched successfully.',
                'data' => $caseDetail,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch case details: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit skill verification decision for refugee.
     */
    public function submitVerification($caseId, $refugeeId, VerificationDecisionRequest $request)
    {
        try {
            $ngoId = Auth::id();
            $verification = $this->ngoService->submitVerification($ngoId, $caseId, $refugeeId, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Verification decision submitted successfully.',
                'data' => $verification,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit verification: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add case note for documentation.
     */
    public function addCaseNote($caseId, NGOCaseNoteRequest $request)
    {
        try {
            $ngoId = Auth::id();
            $note = $this->ngoService->addCaseNote($caseId, $ngoId, $request->input('note'));

            return response()->json([
                'success' => true,
                'message' => 'Case note added successfully.',
                'data' => $note,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add case note: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all notes for a case.
     */
    public function getCaseNotes($caseId)
    {
        try {
            $notes = $this->ngoService->getCaseNotes($caseId);

            return response()->json([
                'success' => true,
                'message' => 'Case notes fetched successfully.',
                'data' => $notes,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch case notes: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get NGO metrics and analytics.
     */
    public function getMetrics(Request $request)
    {
        try {
            $ngoId = Auth::id();
            $metrics = $this->ngoService->getMetrics($ngoId);

            return response()->json([
                'success' => true,
                'message' => 'Metrics fetched successfully.',
                'data' => $metrics,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch metrics: ' . $e->getMessage(),
            ], 500);
        }
    }
}
