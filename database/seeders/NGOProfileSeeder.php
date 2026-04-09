<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NGOProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the NGO user (email: ngo@sheltra.test)
        $ngoUser = DB::table('users')->where('email', 'ngo@sheltra.test')->first();

        if ($ngoUser) {
            DB::table('ngo_profiles')->insert([
                'user_id' => $ngoUser->id,
                'organization_name' => 'Refugee Integration Services',
                'country' => 'Canada',
                'contact_email' => 'contact@risservices.org',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
