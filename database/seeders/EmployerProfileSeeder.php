<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployerProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the employer user (email: employer@sheltra.test)
        $employerUser = DB::table('users')->where('email', 'employer@sheltra.test')->first();

        if ($employerUser) {
            DB::table('employer_profiles')->insert([
                'user_id' => $employerUser->id,
                'company_name' => 'TechVision Inc.',
                'industry' => 'Technology',
                'website' => 'https://techvision.example.com',
                'ethical_hiring_pledge' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
