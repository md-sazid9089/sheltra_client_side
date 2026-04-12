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
        Schema::table('ngo_profiles', function (Blueprint $table) {
            if (!Schema::hasColumn('ngo_profiles', 'verification_status')) {
                $table->string('verification_status')->default('pending')->after('contact_email');
            }
            if (!Schema::hasColumn('ngo_profiles', 'verified_at')) {
                $table->timestamp('verified_at')->nullable()->after('verification_status');
            }
            if (!Schema::hasColumn('ngo_profiles', 'plan_type')) {
                $table->string('plan_type')->nullable()->after('verified_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ngo_profiles', function (Blueprint $table) {
            $table->dropColumn(['verification_status', 'verified_at', 'plan_type']);
        });
    }
};
