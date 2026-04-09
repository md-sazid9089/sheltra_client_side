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
        Schema::create('case_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('refugee_profile_id')
                ->constrained('refugee_profiles')
                ->onDelete('cascade');
            $table->foreignId('ngo_profile_id')
                ->constrained('ngo_profiles')
                ->onDelete('cascade');
            $table->text('note');
            $table->timestamps();
            
            // Indexes
            $table->index('refugee_profile_id');
            $table->index('ngo_profile_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('case_notes');
    }
};
