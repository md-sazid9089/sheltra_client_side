<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Message Model - Chat Feature
 * 
 * Represents a chat message in the Sheltra platform.
 * Stores user messages with timestamps for polling-based retrieval.
 * 
 * @property int $id
 * @property int $user_id Foreign key to users table
 * @property string $message Chat message content
 * @property \Carbon\Carbon $created_at Timestamp when message was created
 * @property \Carbon\Carbon $updated_at Timestamp when message was last updated
 */
class Message extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'message',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the message.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
