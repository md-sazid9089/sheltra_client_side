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
        Schema::create('refugee_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('refugee_profile_id')
                ->constrained('refugee_profiles')
                ->onDelete('cascade');
            $table->foreignId('skill_id')
                ->constrained('skills')
                ->onDelete('cascade');
            $table->string('level')->nullable();
            $table->timestamps();
            
            // Unique constraint on refugee_profile_id + skill_id
            $table->unique(['refugee_profile_id', 'skill_id']);
            
            // Indexes
            $table->index('refugee_profile_id');
            $table->index('skill_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refugee_skills');
    }
};
