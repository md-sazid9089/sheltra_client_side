<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * RefugeeSkill Model
 * 
 * Junction table: associates skills with refugee profiles.
 */
class RefugeeSkill extends Model
{
    use HasFactory;

    protected $fillable = [
        'refugee_profile_id',
        'skill_id',
        'years_experience',
        'verified',
        'verified_at',
    ];

    protected $casts = [
        'verified' => 'boolean',
        'verified_at' => 'datetime',
    ];

    public function refugeeProfile()
    {
        return $this->belongsTo(RefugeeProfile::class);
    }

    public function skill()
    {
        return $this->belongsTo(Skill::class);
    }
}
