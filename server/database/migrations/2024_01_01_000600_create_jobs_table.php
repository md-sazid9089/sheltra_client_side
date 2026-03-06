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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employer_profile_id')
                ->constrained('employer_profiles')
                ->onDelete('cascade');
            $table->string('title');
            $table->longText('description');
            $table->string('location')->nullable();
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->json('required_skills')->nullable();
            $table->timestamps();
            
            // Indexes
            $table->index('employer_profile_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
