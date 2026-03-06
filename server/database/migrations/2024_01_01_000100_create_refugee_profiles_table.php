<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('refugee_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');
            $table->string('full_name');
            $table->string('alias_name')->nullable();
            $table->string('country')->nullable();
            $table->json('languages')->nullable();
            $table->text('experience_summary')->nullable();
            $table->string('availability')->nullable();
            $table->enum('verification_status', ['pending', 'in_review', 'verified', 'rejected'])
                ->default('pending');
            $table->timestamps();
            
            // Indexes
            $table->index('user_id');
            $table->index('verification_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refugee_profiles');
    }
};
