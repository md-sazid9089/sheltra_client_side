<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * CheckRole - Sheltra Flexible Role-Based Access Control
 * 
 * Validates user has one of the allowed roles.
 * Usage: middleware('role:refugee,ngo')
 * Protects routes that require specific roles.
 */
class CheckRole
{
    /**
     * Handle an incoming request - verify user role.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $roles  Comma-separated allowed roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Authentication required.',
                ], 401);
            }

            return redirect()->route('login');
        }

        // Check if user role is in allowed roles
        $userRole = Auth::user()->role;
        if (!in_array($userRole, $roles)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Required role: ' . implode(' or ', $roles) . '. Your role: ' . $userRole,
                ], 403);
            }

            return redirect('/unauthorized');
        }

        return $next($request);
    }
}
