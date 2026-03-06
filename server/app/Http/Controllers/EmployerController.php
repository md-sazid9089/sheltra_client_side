<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\EmployerService;
use App\Http\Requests\EmployerProfileRequest;
use App\Http\Requests\JobPostRequest;
use App\Http\Requests\EmployerFeedbackRequest;

/**
 * EmployerController - Sheltra Employer Management
 * 
 * Handles employer profiles, job postings, talent browsing, and hiring feedback.
 */
class EmployerController extends Controller
{
    protected $employerService;

    public function __construct(EmployerService $employerService)
    {
        $this->middleware('auth');
        $this->middleware('role:employer');
        $this->employerService = $employerService;
    }

    /**
     * Get employer's company profile.
     */
    public function getProfile(Request $request)
    {
        try {
            $employerId = Auth::id();
            $profile = $this->employerService->getProfile($employerId);

            return response()->json([
                'success' => true,
                'message' => 'Employer profile fetched successfully.',
                'data' => $profile,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch employer profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update employer company profile.
     */
    public function updateProfile(EmployerProfileRequest $request)
    {
        try {
            $employerId = Auth::id();
            $profile = $this->employerService->updateProfile($employerId, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Employer profile updated successfully.',
                'data' => $profile,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update employer profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new job posting.
     */
    public function createJob(JobPostRequest $request)
    {
        try {
            $employerId = Auth::id();
            $job = $this->employerService->createJob($employerId, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Job posting created successfully.',
                'data' => $job,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create job posting: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all job postings by employer.
     */
    public function getJobs(Request $request)
    {
        try {
            $employerId = Auth::id();
            $jobs = $this->employerService->getJobs($employerId);

            return response()->json([
                'success' => true,
                'message' => 'Jobs fetched successfully.',
                'data' => $jobs,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch jobs: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Browse verified talents matching employer needs.
     */
    public function getTalent(Request $request)
    {
        try {
            $employerId = Auth::id();
            $filters = $request->query();
            $talent = $this->employerService->getTalent($employerId, $filters);

            return response()->json([
                'success' => true,
                'message' => 'Talent pool fetched successfully.',
                'data' => $talent,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch talent: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit feedback after hiring or interview.
     */
    public function submitFeedback($refugeeId, EmployerFeedbackRequest $request)
    {
        try {
            $employerId = Auth::id();
            $feedback = $this->employerService->submitFeedback($employerId, $refugeeId, $request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Feedback submitted successfully.',
                'data' => $feedback,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit feedback: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all job applications for employer's postings.
     */
    public function getJobApplications(Request $request)
    {
        try {
            $employerId = Auth::id();
            $applications = $this->employerService->getJobApplications($employerId);

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
     * Get employer metrics and analytics.
     */
    public function getMetrics(Request $request)
    {
        try {
            $employerId = Auth::id();
            $metrics = $this->employerService->getMetrics($employerId);

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
