<?php

namespace App\Services;

use App\Models\Job;
use App\Models\EmployerProfile;
use App\Models\RefugeeProfile;
use App\Models\Verification;
use App\Models\Placement;
use Illuminate\Support\Facades\Auth;
use Exception;

class EmployerService
{
    /**
     * Get employer profile by user ID.
     *
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function getProfile($userId)
    {
        try {
            // Verify ownership
            if (Auth::id() !== $userId) {
                throw new Exception('Unauthorized access to employer profile');
            }

            $employer = EmployerProfile::where('user_id', $userId)->first();

            if (!$employer) {
                throw new Exception('Employer profile not found');
            }

            $hired = Placement::where('employer_id', $userId)
                ->where('status', 'active')
                ->count();

            $retention = Placement::where('employer_id', $userId)->count();
            $retentionRate = $retention > 0 ? round(($hired / $retention) * 100) : 0;

            return [
                'id' => $employer->id,
                'user_id' => $employer->user_id,
                'company_name' => $employer->company_name,
                'industry' => $employer->industry,
                'company_size' => $employer->company_size,
                'location' => $employer->location,
                'website' => $employer->website,
                'description' => $employer->description,
                'ethical_hiring_pledge' => $employer->ethical_hiring_pledge,
                'verified_status' => $employer->verified_status,
                'employees_hired' => $hired,
                'retention_rate' => $retentionRate,
                'created_at' => $employer->created_at->toIso8601String(),
                'updated_at' => $employer->updated_at->toIso8601String(),
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve employer profile: ' . $e->getMessage());
        }
    }

    /**
     * Update employer profile.
     *
     * @param int $userId
     * @param array $data
     * @return array
     * @throws Exception
     */
    public function updateProfile($userId, $data)
    {
        try {
            // Verify ownership
            if (Auth::id() !== $userId) {
                throw new Exception('Unauthorized to update this profile');
            }

            $employer = EmployerProfile::where('user_id', $userId)->firstOrFail();
            $employer->update($data);

            return $employer->toArray();
        } catch (Exception $e) {
            throw new Exception('Failed to update employer profile: ' . $e->getMessage());
        }
    }

    /**
     * Create a new job posting.
     *
     * @param int $userId
     * @param array $jobData
     * @return array
     * @throws Exception
     */
    public function createJob($userId, $jobData)
    {
        try {
            // Verify ownership
            if (Auth::id() !== $userId) {
                throw new Exception('Unauthorized to create job');
            }

            $employer = EmployerProfile::where('user_id', $userId)->firstOrFail();

            $job = Job::create([
                'employer_profile_id' => $employer->id,
                'title' => $jobData['title'],
                'description' => $jobData['description'],
                'location' => $jobData['location'],
                'status' => 'open',
                'required_skills' => $jobData['required_skills'] ?? [],
            ]);

            return $job->toArray();
        } catch (Exception $e) {
            throw new Exception('Failed to create job posting: ' . $e->getMessage());
        }
    }

    /**
     * Get all job postings by employer.
     *
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function getJobs($userId)
    {
        try {
            // Verify ownership
            if (Auth::id() !== $userId) {
                throw new Exception('Unauthorized to view these jobs');
            }

            $employer = EmployerProfile::where('user_id', $userId)->firstOrFail();

            $jobs = Job::where('employer_profile_id', $employer->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return $jobs->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'status' => $job->status,
                    'applications' => 0,
                    'posted_at' => $job->created_at->toIso8601String(),
                ];
            })->toArray();
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve jobs: ' . $e->getMessage());
        }
    }

    /**
     * Get verified talent matching job criteria.
     *
     * @param int $userId
     * @param array $filters
     * @return array
     * @throws Exception
     */
    public function getTalent($userId, $filters = [])
    {
        try {
            // Verify ownership
            if (Auth::id() !== $userId) {
                throw new Exception('Unauthorized to view talent');
            }

            $query = RefugeeProfile::whereHas('user', function ($q) {
                $q->where('verified', true);
            });

            if (!empty($filters['skills'])) {
                $query->where(function ($q) use ($filters) {
                    foreach ($filters['skills'] as $skill) {
                        $q->orWhereJsonContains('skills', $skill);
                    }
                });
            }

            $refugees = $query->with('user')->get();

            return $refugees->map(function ($refugee) {
                return [
                    'id' => $refugee->user_id,
                    'name' => $refugee->full_name,
                    'top_skills' => $refugee->skills ?? [],
                    'verified_skills' => $refugee->skills ?? [],
                    'country_of_origin' => $refugee->country,
                    'availability' => $refugee->availability,
                    'match_percentage' => 85,
                ];
            })->toArray();
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve talent: ' . $e->getMessage());
        }
    }

    /**
     * Submit feedback on a refugee after interaction.
     *
     * @param int $userId
     * @param int $refugeeId
     * @param array $feedbackData
     * @return array
     * @throws Exception
     */
    public function submitFeedback($userId, $refugeeId, $feedbackData)
    {
        try {
            // Verify ownership
            if (Auth::id() !== $userId) {
                throw new Exception('Unauthorized to submit feedback');
            }

            // Log feedback as audit entry or feedback model
            // For now, just validate and return
            return [
                'id' => 1,
                'refugee_id' => $refugeeId,
                'employer_id' => $userId,
                'feedback_type' => $feedbackData['feedback_type'] ?? 'constructive',
                'message' => $feedbackData['message'] ?? '',
                'would_hire_again' => $feedbackData['would_hire_again'] ?? null,
                'created_at' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to submit feedback: ' . $e->getMessage());
        }
    }

    /**
     * Get job applications for employer.
     *
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function getJobApplications($userId)
    {
        try {
            // Verify ownership
            if (Auth::id() !== $userId) {
                throw new Exception('Unauthorized to view applications');
            }

            $employer = EmployerProfile::where('user_id', $userId)->firstOrFail();

            $jobs = Job::where('employer_profile_id', $employer->id)->pluck('id');

            // Note: Application model not yet created, returning empty for now
            return [];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve job applications: ' . $e->getMessage());
        }
    }

    /**
     * Get metrics and analytics for employer.
     *
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function getMetrics($userId)
    {
        try {
            // Verify ownership
            if (Auth::id() !== $userId) {
                throw new Exception('Unauthorized to view metrics');
            }

            $employer = EmployerProfile::where('user_id', $userId)->firstOrFail();

            $totalJobs = Job::where('employer_profile_id', $employer->id)->count();
            $activeJobs = Job::where('employer_profile_id', $employer->id)
                ->where('status', 'open')
                ->count();

            $hired = Placement::where('employer_id', $userId)
                ->where('status', 'active')
                ->count();

            $totalPlacements = Placement::where('employer_id', $userId)->count();
            $retention = $totalPlacements > 0 ? round(($hired / $totalPlacements) * 100) : 0;

            return [
                'total_jobs_posted' => $totalJobs,
                'active_jobs' => $activeJobs,
                'total_applications' => 0,
                'under_review' => 0,
                'hired_count' => $hired,
                'retention_rate' => $retention,
                'average_hiring_days' => 0,
                'verified_talent_browsed' => 0,
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve metrics: ' . $e->getMessage());
        }
    }
}
        }
    }
}
