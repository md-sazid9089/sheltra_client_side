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
        Schema::create('verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('refugee_profile_id')
                ->constrained('refugee_profiles')
                ->onDelete('cascade');
            $table->foreignId('ngo_profile_id')
                ->nullable()
                ->constrained('ngo_profiles')
                ->onDelete('set null');
            $table->enum('status', ['pending', 'in_review', 'verified', 'rejected'])
                ->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('refugee_profile_id');
            $table->index('ngo_profile_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('verifications');
    }
};
