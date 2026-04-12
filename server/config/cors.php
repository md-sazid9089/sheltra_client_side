<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) - Sheltra Configuration
    |--------------------------------------------------------------------------
    |
    | Configure CORS for Sheltra SPA frontend integration.
    | Allows the React frontend to communicate with the Laravel API.
    |
    | Frontend URLs:
    | - Development: http://localhost:3000
    | - Production: https://sheltra.app
    |
    */

    'paths' => ['api/*', 'auth/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'https://sheltra-client-side.vercel.app',
        'https://www.sheltra.social',
        'https://sheltra.social',
    ],

    'allowed_origins_patterns' => [
        '/^https:\/\/.*\.vercel\.app$/',  // Allow ALL Vercel preview/production URLs (e.g., sheltra-client-side-hrtbmffz-*.vercel.app)
        '/^https:\/\/.*\.netlify\.app$/', // Allow Netlify if needed
        env('APP_URL') ? parse_url(env('APP_URL'), PHP_URL_HOST) : null,
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['X-Total-Count', 'X-Page-Number'],

    'max_age' => 0,

    'supports_credentials' => true,

];
