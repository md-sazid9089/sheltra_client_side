<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Job Model
 * 
 * Represents job postings created by employers.
 */
class Job extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_profile_id',
        'title',
        'description',
        'location',
        'status',
        'required_skills',
    ];

    protected $casts = [
        'required_skills' => 'array',
    ];

    public function employerProfile()
    {
        return $this->belongsTo(EmployerProfile::class);
    }

    public function employer()
    {
        return $this->employerProfile->user();
    }
}
