<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@sheltra.test',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Refugee User
        User::create([
            'name' => 'Ahmed Hassan',
            'email' => 'refugee@sheltra.test',
            'password' => Hash::make('password123'),
            'role' => 'refugee',
            'email_verified_at' => now(),
        ]);

        // NGO User
        User::create([
            'name' => 'NGO Coordinator',
            'email' => 'ngo@sheltra.test',
            'password' => Hash::make('password123'),
            'role' => 'ngo',
            'email_verified_at' => now(),
        ]);

        // Employer User
        User::create([
            'name' => 'Employer Manager',
            'email' => 'employer@sheltra.test',
            'password' => Hash::make('password123'),
            'role' => 'employer',
            'email_verified_at' => now(),
        ]);
    }
}
