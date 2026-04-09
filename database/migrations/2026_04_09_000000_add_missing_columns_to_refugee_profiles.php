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
        Schema::table('refugee_profiles', function (Blueprint $table) {
            $table->string('location')->nullable()->after('country');
            $table->string('phone')->nullable()->after('full_name');
            $table->text('bio')->nullable()->after('alias_name');
            $table->text('education')->nullable()->after('experience_summary');
            $table->text('work_experience')->nullable()->after('education');
            $table->json('skills')->nullable()->after('languages');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('refugee_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'location',
                'phone',
                'bio',
                'education',
                'work_experience',
                'skills',
            ]);
        });
    }
};
