<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employerProfile = DB::table('employer_profiles')->where('company_name', 'TechVision Inc.')->first();

        if ($employerProfile) {
            DB::table('jobs')->insert([
                'employer_profile_id' => $employerProfile->id,
                'title' => 'Education Coordinator',
                'description' => 'We are looking for an experienced educator to lead our training programs. You will work with refugees to develop professional skills and connect them with employment opportunities. Requirements: 5+ years in education, strong communication skills, and passion for community impact.',
                'location' => 'Toronto, ON',
                'status' => 'open',
                'required_skills' => json_encode(['Teaching', 'Customer Service']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
