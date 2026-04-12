<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Placement Model
 * 
 * Represents successful job placements of refugees.
 */
class Placement extends Model
{
    use HasFactory;

    protected $fillable = [
        'refugee_profile_id',
        'job_id',
        'employer_id',
        'placement_date',
        'status',
        'end_date',
    ];

    protected $casts = [
        'placement_date' => 'datetime',
        'end_date' => 'datetime',
    ];

    public function refugeeProfile()
    {
        return $this->belongsTo(RefugeeProfile::class);
    }

    public function job()
    {
        return $this->belongsTo(Job::class);
    }

    public function employer()
    {
        return $this->belongsTo(User::class, 'employer_id');
    }
}
