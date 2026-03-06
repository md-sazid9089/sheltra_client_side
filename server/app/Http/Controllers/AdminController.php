<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\AdminService;

/**
 * AdminController - Sheltra Platform Administration
 * 
 * Handles platform analytics, user management, and audit logs.
 */
class AdminController extends Controller
{
    protected $adminService;

    public function __construct(AdminService $adminService)
    {
        $this->middleware('auth');
        $this->middleware('check.admin');
        $this->adminService = $adminService;
    }

    /**
     * Get platform-wide impact metrics.
     */
    public function getImpactMetrics(Request $request)
    {
        try {
            $metrics = $this->adminService->getImpactMetrics();

            return response()->json([
                'success' => true,
                'message' => 'Impact metrics fetched successfully.',
                'data' => $metrics,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch impact metrics: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get list of all platform users.
     */
    public function getUsers(Request $request)
    {
        try {
            $filters = $request->query();
            $users = $this->adminService->getUsers($filters);

            return response()->json([
                'success' => true,
                'message' => 'Users fetched successfully.',
                'data' => $users,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get list of all NGO partners.
     */
    public function getNGOs(Request $request)
    {
        try {
            $ngos = $this->adminService->getNGOs();

            return response()->json([
                'success' => true,
                'message' => 'NGOs fetched successfully.',
                'data' => $ngos,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch NGOs: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get audit logs of platform activities.
     */
    public function getAuditLogs(Request $request)
    {
        try {
            $filters = $request->query();
            $logs = $this->adminService->getAuditLogs($filters);

            return response()->json([
                'success' => true,
                'message' => 'Audit logs fetched successfully.',
                'data' => $logs,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch audit logs: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Suspend a user account.
     */
    public function suspendUser($userId, Request $request)
    {
        try {
            $result = $this->adminService->suspendUser($userId);

            return response()->json([
                'success' => true,
                'message' => 'User suspended successfully.',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to suspend user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Reactivate a suspended user account.
     */
    public function reactivateUser($userId, Request $request)
    {
        try {
            $result = $this->adminService->reactivateUser($userId);

            return response()->json([
                'success' => true,
                'message' => 'User reactivated successfully.',
                'data' => $result,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reactivate user: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get detailed analytics and statistics.
     */
    public function getAnalytics(Request $request)
    {
        try {
            $period = $request->query('period', 'month');
            $analytics = $this->adminService->getAnalytics($period);

            return response()->json([
                'success' => true,
                'message' => 'Analytics fetched successfully.',
                'data' => $analytics,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch analytics: ' . $e->getMessage(),
            ], 500);
        }
    }
}
