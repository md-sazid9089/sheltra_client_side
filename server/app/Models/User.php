<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * User Model - Sheltra Platform
 * 
 * Represents a user in the Sheltra skill verification platform.
 * Supports role-based access control (refugee, ngo, employer, admin).
 * 
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $role (refugee, ngo, employer, admin)
 * @property string $password
 * @property \Carbon\Carbon|null $email_verified_at
 * @property string|null $remember_token
 * @property \Carbon\Carbon $created_at
 * @property \Carbon\Carbon $updated_at
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the user's role.
     * Defaults to 'refugee' if not set.
     *
     * @return string
     */
    public function getRole(): string
    {
        return $this->role ?? 'refugee';
    }

    /**
     * Check if user is a refugee.
     *
     * @return bool
     */
    public function isRefugee(): bool
    {
        return $this->getRole() === 'refugee';
    }

    /**
     * Check if user is an NGO.
     *
     * @return bool
     */
    public function isNGO(): bool
    {
        return $this->getRole() === 'ngo';
    }

    /**
     * Check if user is an employer.
     *
     * @return bool
     */
    public function isEmployer(): bool
    {
        return $this->getRole() === 'employer';
    }

    /**
     * Check if user is an admin.
     *
     * @return bool
     */
    public function isAdmin(): bool
    {
        return $this->getRole() === 'admin';
    }
}
