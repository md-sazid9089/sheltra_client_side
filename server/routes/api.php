<?php

use App\Http\Controllers\SessionController;
use App\Http\Controllers\RefugeeController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\NGOController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/**
 * Sheltra API Routes
 * 
 * Role-based endpoint structure:
 * - /auth - Authentication (login, register, logout)
 * - /refugee - Refugee-specific endpoints
 * - /ngo - NGO partner endpoints
 * - /employer - Employer endpoints
 * - /admin - Admin dashboard endpoints
 * 
 * All endpoints return JSON responses with { success, message, data } structure.
 */

// Authentication routes (public + guest middleware)
Route::prefix('auth')->group(base_path('routes/auth.php'));

// Session/auth state endpoint (public)
Route::get('/auth/me', [SessionController::class, 'currentUser']);
Route::post('/auth/validate', [SessionController::class, 'validate']);

// Refugee routes (refugee role required)
Route::middleware(['auth', 'role:refugee'])->prefix('refugee')->group(function () {
    Route::get('/profile', [RefugeeController::class, 'getProfile']);
    Route::post('/profile', [RefugeeController::class, 'updateProfile']);
    Route::put('/profile', [RefugeeController::class, 'updateProfile']);
    Route::get('/opportunities', [RefugeeController::class, 'getOpportunities']);
    Route::get('/verification-status', [RefugeeController::class, 'getVerificationStatus']);
    Route::post('/skills', [RefugeeController::class, 'updateSkills']);
    Route::get('/applications', [RefugeeController::class, 'getApplications']);
});

// NGO routes (ngo role required)
Route::middleware(['auth', 'role:ngo'])->prefix('ngo')->group(function () {
    Route::get('/cases', [NGOController::class, 'getCases']);
    Route::get('/cases/{caseId}', [NGOController::class, 'getCaseDetail']);
    Route::post('/cases/{caseId}/verify/{refugeeId}', [NGOController::class, 'submitVerification']);
    Route::post('/cases/{caseId}/notes', [NGOController::class, 'addCaseNote']);
    Route::get('/cases/{caseId}/notes', [NGOController::class, 'getCaseNotes']);
    Route::get('/metrics', [NGOController::class, 'getMetrics']);
});

// Employer routes (employer role required)
Route::middleware(['auth', 'role:employer'])->prefix('employer')->group(function () {
    Route::get('/profile', [EmployerController::class, 'getProfile']);
    Route::post('/profile', [EmployerController::class, 'updateProfile']);
    Route::put('/profile', [EmployerController::class, 'updateProfile']);
    Route::get('/jobs', [EmployerController::class, 'getJobs']);
    Route::post('/jobs', [EmployerController::class, 'createJob']);
    Route::get('/talent', [EmployerController::class, 'getTalent']);
    Route::post('/feedback/{refugeeId}', [EmployerController::class, 'submitFeedback']);
    Route::get('/applications', [EmployerController::class, 'getJobApplications']);
    Route::get('/metrics', [EmployerController::class, 'getMetrics']);
});

// Admin routes (admin role required)
Route::middleware(['auth', 'check.admin'])->prefix('admin')->group(function () {
    Route::get('/impact-metrics', [AdminController::class, 'getImpactMetrics']);
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::get('/ngos', [AdminController::class, 'getNGOs']);
    Route::get('/audit-logs', [AdminController::class, 'getAuditLogs']);
    Route::post('/users/{userId}/suspend', [AdminController::class, 'suspendUser']);
    Route::post('/users/{userId}/reactivate', [AdminController::class, 'reactivateUser']);
    Route::get('/analytics', [AdminController::class, 'getAnalytics']);
});

// Fallback: user endpoint (authenticated, returns current user with role)
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return response()->json([
        'success' => true,
        'message' => 'User details retrieved successfully.',
        'data' => [
            'id' => $request->user()->id,
            'name' => $request->user()->name,
            'email' => $request->user()->email,
            'role' => $request->user()->role ?? 'refugee',
        ],
    ], 200);
});