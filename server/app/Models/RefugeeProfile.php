<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * RefugeeProfile Model
 * 
 * Represents a refugee's profile with skills, experience, and verification status.
 */
class RefugeeProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'full_name',
        'alias_name',
        'phone',
        'bio',
        'country',
        'location',
        'languages',
        'skills',
        'experience_summary',
        'education',
        'work_experience',
        'availability',
        'verification_status',
    ];

    protected $casts = [
        'languages' => 'array',
        'skills' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
