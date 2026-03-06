<?php

use App\Http\Controllers\SessionController;
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
 */

// Authentication routes (public + guest middleware)
Route::prefix('auth')->group(base_path('routes/auth.php'));

// Session/auth state endpoint (public)
Route::get('/auth/me', [SessionController::class, 'currentUser']);
Route::post('/auth/validate', [SessionController::class, 'validate']);

// Refugee routes (refugee role required)
Route::middleware(['auth', 'role:refugee'])->prefix('refugee')->group(function () {
    // Profile endpoints (to be implemented)
    Route::get('/profile', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Refugee profile endpoint not yet implemented.',
        ], 501);
    });

    Route::post('/profile', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Refugee profile creation endpoint not yet implemented.',
        ], 501);
    });

    Route::put('/profile', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Refugee profile update endpoint not yet implemented.',
        ], 501);
    });

    // Opportunities and verification (to be implemented)
    Route::get('/opportunities', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Opportunities endpoint not yet implemented.',
        ], 501);
    });

    Route::get('/verification-status', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Verification status endpoint not yet implemented.',
        ], 501);
    });
});

// NGO routes (ngo role required)
Route::middleware(['auth', 'role:ngo'])->prefix('ngo')->group(function () {
    Route::get('/cases', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'NGO cases endpoint not yet implemented.',
        ], 501);
    });

    Route::get('/cases/{id}', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'NGO case detail endpoint not yet implemented.',
        ], 501);
    });

    Route::post('/verify/{refugee_id}', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'NGO verification endpoint not yet implemented.',
        ], 501);
    });

    Route::post('/cases/{refugee_id}/notes', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'NGO notes endpoint not yet implemented.',
        ], 501);
    });
});

// Employer routes (employer role required)
Route::middleware(['auth', 'role:employer'])->prefix('employer')->group(function () {
    Route::get('/profile', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Employer profile endpoint not yet implemented.',
        ], 501);
    });

    Route::post('/profile', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Employer profile creation endpoint not yet implemented.',
        ], 501);
    });

    Route::get('/jobs', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Employer jobs endpoint not yet implemented.',
        ], 501);
    });

    Route::post('/jobs', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Employer job creation endpoint not yet implemented.',
        ], 501);
    });

    Route::get('/talent', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Employer talent endpoint not yet implemented.',
        ], 501);
    });

    Route::post('/feedback/{refugee_id}', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Employer feedback endpoint not yet implemented.',
        ], 501);
    });
});

// Admin routes (admin role required)
Route::middleware(['auth', 'check.admin'])->prefix('admin')->group(function () {
    Route::get('/users', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Admin users endpoint not yet implemented.',
        ], 501);
    });

    Route::get('/ngos', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Admin NGOs endpoint not yet implemented.',
        ], 501);
    });

    Route::get('/audit-logs', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Admin audit logs endpoint not yet implemented.',
        ], 501);
    });

    Route::get('/impact-metrics', function (Request $request) {
        return response()->json([
            'success' => false,
            'message' => 'Admin impact metrics endpoint not yet implemented.',
        ], 501);
    });
});

// Fallback: user endpoint (authenticated, returns current user)
Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return response()->json([
        'id' => $request->user()->id,
        'name' => $request->user()->name,
        'email' => $request->user()->email,
        'role' => $request->user()->role ?? 'refugee',
    ]);
});