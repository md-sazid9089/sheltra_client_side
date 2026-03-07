<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * SessionController - Sheltra Authentication Session Management
 * 
 * Handles current user authentication state and profile retrieval
 * without breaking client session assumptions.
 */
class SessionController extends Controller
{
    /**
     * Get the currently authenticated user.
     * 
     * Used by frontend to retrieve user info after successful auth.
     * Returns user with role and profile completion status.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function currentUser(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Not authenticated.',
            ], 401);
        }

        $user = Auth::user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role ?? 'refugee',
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
            ],
        ], 200);
    }

    /**
     * Validate and refresh the user session.
     * Useful for checking if token/session is still valid.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function validateSession(Request $request)
    {
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Session expired. Please log in again.',
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Session valid.',
        ], 200);
    }
}
