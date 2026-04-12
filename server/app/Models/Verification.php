<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Verification Model
 * 
 * Represents NGO case verifications for refugee skills.
 */
class Verification extends Model
{
    use HasFactory;

    protected $fillable = [
        'ngo_id',
        'refugee_profile_id',
        'status',
        'submission_date',
        'verified_date',
    ];

    protected $casts = [
        'submission_date' => 'datetime',
        'verified_date' => 'datetime',
    ];

    public function ngo()
    {
        return $this->belongsTo(NGOProfile::class);
    }

    public function refugeeProfile()
    {
        return $this->belongsTo(RefugeeProfile::class);
    }

    public function notes()
    {
        return $this->hasMany(CaseNote::class, 'verification_id');
    }
}
