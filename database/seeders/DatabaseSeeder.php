<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run seeders in order
        $this->call([
            SkillSeeder::class,
            UserSeeder::class,
            RefugeeProfileSeeder::class,
            NGOProfileSeeder::class,
            EmployerProfileSeeder::class,
            RefugeeSkillSeeder::class,
            JobSeeder::class,
            VerificationSeeder::class,
            PlacementSeeder::class,
        ]);
    }
}
