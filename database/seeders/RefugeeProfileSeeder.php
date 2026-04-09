<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RefugeeProfileSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the refugee user (email: refugee@sheltra.test)
        $refugeeUser = DB::table('users')->where('email', 'refugee@sheltra.test')->first();

        if ($refugeeUser) {
            DB::table('refugee_profiles')->insert([
                'user_id' => $refugeeUser->id,
                'full_name' => 'Ahmed Hassan',
                'alias_name' => 'Ahmed',
                'country' => 'Syria',
                'languages' => json_encode(['Arabic', 'English']),
                'experience_summary' => 'Experienced teacher with 10 years in secondary education. Strong background in mathematics and sciences.',
                'availability' => 'full_time',
                'verification_status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
