<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// This is an API-only backend. All requests should go through /api routes.
// No web frontend is served from this backend (frontend is deployed separately on Vercel).
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Endpoint not found. This is an API-only backend.',
        'hint' => 'Use /api routes for all requests.',
    ], 404);
});

require __DIR__ . '/auth.php';
