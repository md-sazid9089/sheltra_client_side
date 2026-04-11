<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VerificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $refugeeProfile = DB::table('refugee_profiles')->where('full_name', 'Ahmed Hassan')->first();
        $ngoProfile = DB::table('ngo_profiles')->where('organization_name', 'Refugee Integration Services')->first();

        if ($refugeeProfile && $ngoProfile) {
            DB::table('verifications')->insert([
                'refugee_profile_id' => $refugeeProfile->id,
                'ngo_profile_id' => $ngoProfile->id,
                'status' => 'in_review',
                'notes' => 'Currently reviewing teaching credentials and certification.',
                'verified_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
