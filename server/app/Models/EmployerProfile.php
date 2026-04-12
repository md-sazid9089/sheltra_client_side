<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * EmployerProfile Model
 * 
 * Represents employer company profiles.
 */
class EmployerProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'industry',
        'company_size',
        'location',
        'website',
        'description',
        'ethical_hiring_pledge',
        'verified_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }
}
