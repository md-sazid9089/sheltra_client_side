<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class RefugeeDataTest extends TestCase
{
    /**
     * Test refugee profile data structure.
     *
     * @return void
     */
    public function test_refugee_profile_is_valid()
    {
        $profile = [
            'full_name' => 'Ahmed Hassan',
            'country_of_origin' => 'Syria',
            'legal_status' => 'refugee',
            'availability' => 'full_time',
        ];

        $this->assertArrayHasKey('full_name', $profile);
        $this->assertArrayHasKey('country_of_origin', $profile);
    }
}
