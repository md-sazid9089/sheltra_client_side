<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations - Add performance indexes for frequently queried columns
     * 
     * This migration adds composite indexes for:
     * - Messages polling queries (user_id, created_at)
     * - Verification status filters (refugee_profile_id, status)
     * - Job listings (employer_profile_id, status)
     * - Payment history queries (user_id, status) and (user_id, created_at)
     * 
     * Impact: Reduces query time from O(n) to O(log n) for list endpoints
     */
    public function up(): void
    {
        // Messages table: optimize polling queries with (user_id, created_at) composite index
        if (Schema::hasTable('messages')) {
            Schema::table('messages', function (Blueprint $table) {
                // Check if index doesn't already exist
                $indexes = Schema::getConnection()->getDoctrineColumn('messages', 'user_id');
                if (!Schema::hasColumn('messages', 'indexed_at')) {
                    $table->index(['user_id', 'created_at'], 'messages_user_created_idx');
                }
            });
        }

        // Verifications table: optimize status queries with (refugee_profile_id, status) composite index
        if (Schema::hasTable('verifications')) {
            Schema::table('verifications', function (Blueprint $table) {
                $table->index(['refugee_profile_id', 'status'], 'verifications_refugee_status_idx');
                $table->index(['verified_at'], 'verifications_verified_at_idx');
            });
        }

        // Jobs table: optimize job listing queries with (employer_profile_id, status) composite index
        if (Schema::hasTable('jobs')) {
            Schema::table('jobs', function (Blueprint $table) {
                $table->index(['employer_profile_id', 'status'], 'jobs_employer_status_idx');
            });
        }

        // Payments table: optimize payment history with composite indexes
        if (Schema::hasTable('payments')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->index(['user_id', 'status'], 'payments_user_status_idx');
                $table->index(['user_id', 'created_at'], 'payments_user_created_idx');
            });
        }

        // Placements table: optimize placement search by status and date range
        if (Schema::hasTable('placements')) {
            Schema::table('placements', function (Blueprint $table) {
                $table->index(['refugee_id', 'status'], 'placements_refugee_status_idx');
                $table->index(['employer_id', 'status'], 'placements_employer_status_idx');
            });
        }

        // Case notes table: optimize case notes retrieval
        if (Schema::hasTable('case_notes')) {
            Schema::table('case_notes', function (Blueprint $table) {
                $table->index(['case_id', 'created_at'], 'case_notes_case_created_idx');
            });
        }

        // Refugee profiles: add status index for verification queries
        if (Schema::hasTable('refugee_profiles')) {
            Schema::table('refugee_profiles', function (Blueprint $table) {
                $table->index(['verification_status', 'created_at'], 'refugee_verification_idx');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('messages')) {
            Schema::table('messages', function (Blueprint $table) {
                $table->dropIndex('messages_user_created_idx');
            });
        }

        if (Schema::hasTable('verifications')) {
            Schema::table('verifications', function (Blueprint $table) {
                $table->dropIndex('verifications_refugee_status_idx');
                $table->dropIndex('verifications_verified_at_idx');
            });
        }

        if (Schema::hasTable('jobs')) {
            Schema::table('jobs', function (Blueprint $table) {
                $table->dropIndex('jobs_employer_status_idx');
            });
        }

        if (Schema::hasTable('payments')) {
            Schema::table('payments', function (Blueprint $table) {
                $table->dropIndex('payments_user_status_idx');
                $table->dropIndex('payments_user_created_idx');
            });
        }

        if (Schema::hasTable('placements')) {
            Schema::table('placements', function (Blueprint $table) {
                $table->dropIndex('placements_refugee_status_idx');
                $table->dropIndex('placements_employer_status_idx');
            });
        }

        if (Schema::hasTable('case_notes')) {
            Schema::table('case_notes', function (Blueprint $table) {
                $table->dropIndex('case_notes_case_created_idx');
            });
        }

        if (Schema::hasTable('refugee_profiles')) {
            Schema::table('refugee_profiles', function (Blueprint $table) {
                $table->dropIndex('refugee_verification_idx');
            });
        }
    }
};
