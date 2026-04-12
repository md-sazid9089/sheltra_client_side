<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * CaseNote Model
 * 
 * Represents notes on verification cases.
 */
class CaseNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'verification_id',
        'ngo_user_id',
        'note',
    ];

    public function verification()
    {
        return $this->belongsTo(Verification::class);
    }

    public function ngoUser()
    {
        return $this->belongsTo(User::class, 'ngo_user_id');
    }
}
