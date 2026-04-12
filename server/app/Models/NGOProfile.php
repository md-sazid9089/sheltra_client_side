<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * NGOProfile Model
 * 
 * Represents NGO partner organization profiles.
 */
class NGOProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'organization_name',
        'country',
        'contact_email',
        'verification_status',
        'verified_at',
        'plan_type',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cases()
    {
        return $this->hasMany(Verification::class, 'ngo_id');
    }

    public function isVerified()
    {
        return $this->verification_status === 'verified';
    }
}
