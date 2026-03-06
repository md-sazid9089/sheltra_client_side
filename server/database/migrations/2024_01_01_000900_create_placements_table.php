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
        Schema::create('placements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('refugee_profile_id')
                ->constrained('refugee_profiles')
                ->onDelete('cascade');
            $table->foreignId('job_id')
                ->constrained('jobs')
                ->onDelete('cascade');
            $table->enum('status', ['matched', 'placed', 'completed', 'closed'])
                ->default('matched');
            $table->timestamp('placed_at')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('refugee_profile_id');
            $table->index('job_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('placements');
    }
};
