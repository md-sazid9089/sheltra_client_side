<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RefugeeSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $refugeeProfile = DB::table('refugee_profiles')->where('full_name', 'Ahmed Hassan')->first();
        $teachingSkill = DB::table('skills')->where('name', 'Teaching')->first();
        $customerServiceSkill = DB::table('skills')->where('name', 'Customer Service')->first();

        if ($refugeeProfile && $teachingSkill) {
            DB::table('refugee_skills')->insert([
                'refugee_profile_id' => $refugeeProfile->id,
                'skill_id' => $teachingSkill->id,
                'level' => 'advanced',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if ($refugeeProfile && $customerServiceSkill) {
            DB::table('refugee_skills')->insert([
                'refugee_profile_id' => $refugeeProfile->id,
                'skill_id' => $customerServiceSkill->id,
                'level' => 'intermediate',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
