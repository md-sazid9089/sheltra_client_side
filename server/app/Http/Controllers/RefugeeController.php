<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\RefugeeService;
use App\Http\Requests\RefugeeProfileRequest;
use App\Http\Requests\CvAnalyzeRequest;

/**
 * RefugeeController - Sheltra Refugee Profile Management
 * 
 * Handles refugee profile creation, updates, skill management,
 * opportunity matching, and verification status.
 */
class RefugeeController extends Controller
{
    protected $refugeeService;

    public function __construct(RefugeeService $refugeeService)
    {
        $this->refugeeService = $refugeeService;
    }

    /**
     * Get current refugee's profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile(Request $request)
    {
        try {
            $refugeeId = Auth::id();
            $profile = $this->refugeeService->getProfile($refugeeId);

            return response()->json([
                'success' => true,
                'message' => 'Refugee profile fetched successfully.',
                'data' => $profile,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch refugee profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create or update refugee profile.
     *
     * @param RefugeeProfileRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(RefugeeProfileRequest $request)
    {
        try {
            $refugeeId = Auth::id();
            $validated = $request->validated();

            $profile = $this->refugeeService->updateProfile($refugeeId, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Refugee profile updated successfully.',
                'data' => $profile,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update refugee profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get AI-matched opportunities for refugee.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOpportunities(Request $request)
    {
        try {
            $refugeeId = Auth::id();
            $opportunities = $this->refugeeService->getMatchedOpportunities($refugeeId);

            return response()->json([
                'success' => true,
                'message' => 'Opportunities fetched successfully.',
                'data' => $opportunities,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch opportunities: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get current refugee's verification status.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getVerificationStatus(Request $request)
    {
        try {
            $refugeeId = Auth::id();
            $status = $this->refugeeService->getVerificationStatus($refugeeId);

            return response()->json([
                'success' => true,
                'message' => 'Verification status fetched successfully.',
                'data' => $status,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch verification status: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add or update skills for refugee.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateSkills(Request $request)
    {
        try {
            $validated = $request->validate([
                'skills' => ['required', 'array', 'min:1'],
                'skills.*' => ['string', 'max:100'],
            ], [
                'skills.required' => 'At least one skill is required.',
                'skills.array' => 'Skills must be an array.',
            ]);

            $refugeeId = Auth::id();
            $result = $this->refugeeService->updateSkills($refugeeId, $validated['skills']);

            return response()->json([
                'success' => true,
                'message' => 'Skills updated successfully.',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update skills: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get refugee's application status to all opportunities.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getApplications(Request $request)
    {
        try {
            $refugeeId = Auth::id();
            $applications = $this->refugeeService->getApplications($refugeeId);

            return response()->json([
                'success' => true,
                'message' => 'Applications fetched successfully.',
                'data' => $applications,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch applications: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Analyze CV text with Gemini AI.
     *
     * @param CvAnalyzeRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function analyzeCv(CvAnalyzeRequest $request)
    {
        try {
            $analysis = $this->refugeeService->analyzeCv($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'CV analyzed successfully.',
                'data' => $analysis,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to analyze CV: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate Virtual NID for refugee.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateNID(Request $request)
    {
        try {
            $validated = $request->validate([
                'full_name' => ['required', 'string', 'max:255'],
                'country' => ['required', 'string', 'max:100'],
                'email' => ['required', 'email'],
            ]);

            $refugeeId = Auth::id();
            $nidData = $this->refugeeService->generateNID($refugeeId, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Virtual NID generated successfully.',
                'data' => $nidData,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate NID: ' . $e->getMessage(),
            ], 500);
        }
    }
}
