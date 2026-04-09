<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Create Messages Table for Chat Feature
 * 
 * Stores real-time chat messages between users.
 * Uses polling mechanism (no WebSocket).
 * 
 * Fields:
 * - id: Primary key
 * - user_id: Foreign key to users table
 * - message: Chat message content
 * - created_at: Timestamp for ordering and pagination
 * - updated_at: Standard timestamp
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        # Only create if table doesn't exist
        if (!Schema::hasTable('messages')) {
            Schema::create('messages', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->text('message'); // Chat message content
                $table->timestamps(); // created_at, updated_at
                
                # Indexes for efficient querying
                $table->index('user_id');
                $table->index('created_at'); # For sorting and pagination
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
