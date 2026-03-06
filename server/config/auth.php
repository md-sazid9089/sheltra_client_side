<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults (Sheltra)
    |--------------------------------------------------------------------------
    |
    | Default authentication guard for Sheltra: role-based access control.
    | All roles (refugee, ngo, employer, admin) use the same user table
    | with a 'role' column for differentiation.
    |
    */

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards (Sheltra)
    |--------------------------------------------------------------------------
    |
    | Sheltra uses web session guard for browser/SPA requests
    | and sanctum for stateless API token authentication.
    |
    | Guards:
    | - web: Session-based for SPA frontend
    | - sanctum: Stateless token-based (future enhancement)
    |
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        'sanctum' => [
            'driver' => 'sanctum',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers (Sheltra)
    |--------------------------------------------------------------------------
    |
    | Sheltra uses single User model with role column.
    | Roles: refugee, ngo, employer, admin
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords (Sheltra)
    |--------------------------------------------------------------------------
    |
    | Password reset configuration for all Sheltra roles.
    | Tokens expire after 60 minutes.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_resets',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout (Sheltra)
    |--------------------------------------------------------------------------
    |
    | Specifies the number of seconds before a password confirmation
    | times out if no activity occurs.
    |
    */

    'password_timeout' => 10800,

    /*
    |--------------------------------------------------------------------------
    | Old Comment Reference (Remove)
    |
    |--------------------------------------------------------------------------
    |
    | Here you may define the amount of seconds before a password confirmation
    | times out and the user is prompted to re-enter their password via the
    | confirmation screen. By default, the timeout lasts for three hours.
    |
    */

    'password_timeout' => 10800,

];
