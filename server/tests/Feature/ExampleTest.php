<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    /**
     * Test that unauthenticated users receive 401 response.
     *
     * @return void
     */
    public function test_unauthenticated_user_cannot_access_protected_routes()
    {
        $response = $this->get('/api/refugee/profile');

        $response->assertStatus(401);
    }
}
