<?php

namespace App\Services;

use App\Models\User;
use App\Models\NGOProfile;
use App\Models\EmployerProfile;
use App\Models\RefugeeProfile;
use App\Models\Verification;
use App\Models\Placement;
use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Exception;

class AdminService
{
    /**
     * Get platform-wide impact metrics.
     *
     * @return array
     * @throws Exception
     */
    public function getImpactMetrics()
    {
        try {
            $totalRefugees = User::where('role', 'refugee')->count();
            $totalEmployers = User::where('role', 'employer')->count();
            $totalNgos = User::where('role', 'ngo')->count();
            $totalJobs = \App\Models\Job::count();
            $verifications = Verification::where('status', 'approved')->count();
            $placements = Placement::where('status', 'active')->count();
            $countries = RefugeeProfile::distinct('country')->count();

            $placementRate = $totalRefugees > 0 ? round(($placements / $totalRefugees) * 100) : 0;

            return [
                'total_refugees_registered' => $totalRefugees,
                'refugees_with_verified_skills' => $verifications,
                'total_employers_registered' => $totalEmployers,
                'total_ngos_registered' => $totalNgos,
                'jobs_posted' => $totalJobs,
                'successful_placements' => $placements,
                'placement_success_rate' => $placementRate,
                'average_time_to_employment' => 0,
                'skills_verified' => $verifications,
                'geographic_coverage' => $countries,
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve impact metrics: ' . $e->getMessage());
        }
    }

    /**
     * Get list of all users with role and status.
     *
     * @param array $filters
     * @return array
     * @throws Exception
     */
    public function getUsers($filters = [])
    {
        try {
            $query = User::select('id', 'name', 'email', 'role', 'verified', 'created_at')
                ->orderBy('created_at', 'desc');

            if (!empty($filters['role'])) {
                $query->where('role', $filters['role']);
            }

            if (!empty($filters['status'])) {
                $query->where('verified', $filters['status'] === 'active');
            }

            return $query->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'status' => $user->verified ? 'active' : 'suspended',
                    'created_at' => $user->created_at->toIso8601String(),
                ];
            })->toArray();
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve users: ' . $e->getMessage());
        }
    }

    /**
     * Get list of all NGOs with details.
     *
     * @return array
     * @throws Exception
     */
    public function getNGOs()
    {
        try {
            $ngos = NGOProfile::with('user')->get();

            return $ngos->map(function ($ngo) {
                $caseCount = Verification::where('ngo_id', $ngo->id)->count();
                $approved = Verification::where('ngo_id', $ngo->id)
                    ->where('status', 'approved')
                    ->count();

                $accuracy = $caseCount > 0 ? round(($approved / $caseCount) * 100) : 0;

                return [
                    'id' => $ngo->id,
                    'name' => $ngo->organization_name,
                    'email' => $ngo->contact_email,
                    'verification_cases_completed' => $caseCount,
                    'accuracy_rate' => $accuracy,
                    'status' => $ngo->user->verified ? 'active' : 'inactive',
                    'created_at' => $ngo->created_at->toIso8601String(),
                ];
            })->toArray();
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve NGOs: ' . $e->getMessage());
        }
    }

    /**
     * Get audit logs of platform activities.
     *
     * @param array $filters
     * @return array
     * @throws Exception
     */
    public function getAuditLogs($filters = [])
    {
        try {
            $query = AuditLog::with('user')
                ->orderBy('created_at', 'desc');

            if (!empty($filters['action'])) {
                $query->where('action', $filters['action']);
            }

            $logs = $query->limit(50)->get();

            return $logs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'user_id' => $log->user_id,
                    'user_role' => $log->user_role,
                    'description' => $log->description,
                    'timestamp' => $log->created_at->toIso8601String(),
                ];
            })->toArray();
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve audit logs: ' . $e->getMessage());
        }
    }

    /**
     * Suspend a user account.
     *
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function suspendUser($userId)
    {
        try {
            // Prevent admin from suspending themselves
            if (Auth::id() === $userId && Auth::user()->role === 'admin') {
                throw new Exception('Admins cannot suspend themselves');
            }

            $user = User::findOrFail($userId);
            $user->update(['verified' => false]);

            AuditLog::create([
                'action' => 'user_suspended',
                'user_id' => Auth::id(),
                'user_role' => Auth::user()->role,
                'description' => "User {$user->name} suspended",
            ]);

            return [
                'success' => true,
                'message' => 'User account suspended successfully.',
                'user_id' => $userId,
                'status' => 'suspended',
                'timestamp' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to suspend user: ' . $e->getMessage());
        }
    }

    /**
     * Reactivate a suspended user account.
     *
     * @param int $userId
     * @return array
     * @throws Exception
     */
    public function reactivateUser($userId)
    {
        try {
            $user = User::findOrFail($userId);
            $user->update(['verified' => true]);

            AuditLog::create([
                'action' => 'user_reactivated',
                'user_id' => Auth::id(),
                'user_role' => Auth::user()->role,
                'description' => "User {$user->name} reactivated",
            ]);

            return [
                'success' => true,
                'message' => 'User account reactivated successfully.',
                'user_id' => $userId,
                'status' => 'active',
                'timestamp' => now()->toIso8601String(),
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to reactivate user: ' . $e->getMessage());
        }
    }

    /**
     * Get detailed analytics and statistics.
     *
     * @param string $period (week, month, year)
     * @return array
     * @throws Exception
     */
    public function getAnalytics($period = 'month')
    {
        try {
            $startDate = match ($period) {
                'week' => now()->subWeek(),
                'month' => now()->subMonth(),
                'year' => now()->subYear(),
                default => now()->subMonth(),
            };

            $newRefugees = User::where('role', 'refugee')
                ->where('created_at', '>=', $startDate)
                ->count();

            $newEmployers = User::where('role', 'employer')
                ->where('created_at', '>=', $startDate)
                ->count();

            $newJobs = \App\Models\Job::where('created_at', '>=', $startDate)->count();

            $newVerifications = Verification::where('created_at', '>=', $startDate)->count();

            $successfulPlacements = Placement::where('created_at', '>=', $startDate)
                ->where('status', 'active')
                ->count();

            $activeUsers = User::where('verified', true)->count();

            return [
                'period' => $period,
                'new_refugees' => $newRefugees,
                'new_employers' => $newEmployers,
                'new_jobs' => $newJobs,
                'new_verifications' => $newVerifications,
                'successful_placements' => $successfulPlacements,
                'active_users' => $activeUsers,
                'refugee_engagement_rate' => 0,
                'employer_engagement_rate' => 0,
                'top_countries' => RefugeeProfile::distinct('country')
                    ->limit(3)
                    ->pluck('country')
                    ->toArray(),
                'top_skills' => [],
            ];
        } catch (Exception $e) {
            throw new Exception('Failed to retrieve analytics: ' . $e->getMessage());
        }
    }
}
