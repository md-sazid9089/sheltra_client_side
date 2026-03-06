<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Throwable;

/**
 * Sheltra Global Exception Handler
 * 
 * Handles exceptions and errors across the Sheltra platform,
 * converting them to JSON responses for the frontend API.
 */
class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     * All responses are JSON for Sheltra API compatibility.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Throwable $exception
     * @return \Illuminate\Http\JsonResponse|\Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $exception)
    {
        // Handle validation exceptions
        if ($exception instanceof ValidationException) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $exception->errors(),
            ], 422);
        }

        // Handle model not found
        if ($exception instanceof ModelNotFoundException) {
            return response()->json([
                'success' => false,
                'message' => 'The requested resource was not found.',
            ], 404);
        }

        // Handle unauthorized access
        if ($exception instanceof \Illuminate\Auth\AuthenticationException) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please log in.',
            ], 401);
        }

        // Handle authorization failures
        if ($exception instanceof \Illuminate\Auth\Access\AuthorizationException) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to perform this action.',
            ], 403);
        }

        // Generic error response
        return response()->json([
            'success' => false,
            'message' => 'An error occurred. Please try again later.',
        ], 500);
    }
}
