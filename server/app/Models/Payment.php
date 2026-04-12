<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Payment Model
 * 
 * Represents Stripe payment records for NGO verification.
 */
class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'stripe_payment_intent_id',
        'stripe_customer_id',
        'amount',
        'currency',
        'status',
        'plan_type',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
