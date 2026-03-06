<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Stateful Domains (Sheltra)
    |--------------------------------------------------------------------------
    |
    | Defines which domains should receive stateful API authentication cookies.
    | Sheltra frontend communicates from port 3000 (development) or
    | sheltra.app (production).
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s%s',
        'localhost,localhost:3000,localhost:5173,127.0.0.1,127.0.0.1:3000,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : '',
        env('FRONTEND_URL') ? ','.parse_url(env('FRONTEND_URL'), PHP_URL_HOST) : ''
    ))),

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes (Sheltra)
    |--------------------------------------------------------------------------
    |
    | Tokens do not expire by default. Set a value for token expiration
    | if needed (in days). Null = no expiration.
    |
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware (Sheltra)
    |--------------------------------------------------------------------------
    |
    | Middleware used for token authentication and CSRF verification.
    |
    */

    'middleware' => [
        'verify_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
    ],

];
