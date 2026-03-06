<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PlacementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $refugeeProfile = DB::table('refugee_profiles')->where('full_name', 'Ahmed Hassan')->first();
        $job = DB::table('jobs')->where('title', 'Education Coordinator')->first();

        if ($refugeeProfile && $job) {
            DB::table('placements')->insert([
                'refugee_profile_id' => $refugeeProfile->id,
                'job_id' => $job->id,
                'status' => 'matched',
                'placed_at' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
