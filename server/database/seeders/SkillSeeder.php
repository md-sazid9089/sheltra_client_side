<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $skills = [
            ['name' => 'Teaching', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Carpentry', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Welding', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Plumbing', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Nursing', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Customer Service', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('skills')->insert($skills);
    }
}
