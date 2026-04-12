<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * AuditLog Model
 * 
 * Represents audit trail of significant platform events.
 */
class AuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'user_id',
        'user_role',
        'description',
        'ip_address',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
