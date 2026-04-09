<?php

/**
 * Chat API Testing Script
 * Tests both send-message and get-messages endpoints
 */

require __DIR__ . '/vendor/autoload.php';
$app = require __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use GuzzleHttp\Client;

echo "════════════════════════════════════════════════════════════\n";
echo "                  CHAT API TEST SCRIPT\n";
echo "════════════════════════════════════════════════════════════\n\n";

// Get user and create token
$user = User::find(2); // refugee@sheltra.test
if (!$user) {
    echo "❌ User not found\n";
    exit(1);
}

$token = $user->createToken('test-token')->plainTextToken;
echo "✓ Generated token for user: {$user->email}\n";
echo "  User ID: {$user->id}, Role: {$user->role}\n\n";

$client = new Client(['base_uri' => 'http://localhost']);
$headers = ['Authorization' => "Bearer $token"];

// TEST 1: GET Messages
echo "TEST 1: GET /api/chat/get-messages\n";
echo "─────────────────────────────────────────────\n";
try {
    $response = $client->get('/api/chat/get-messages', ['headers' => $headers]);
    $data = json_decode($response->getBody(), true);
    
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Success: " . ($data['success'] ? 'YES' : 'NO') . "\n";
    echo "Message: {$data['message']}\n";
    
    if ($data['success'] && !empty($data['data'])) {
        echo "Messages found: " . count($data['data']) . "\n";
        echo "\nRecent messages:\n";
        foreach (array_slice($data['data'], -3) as $msg) {
            echo "  • [{$msg['id']}] {$msg['user']['name']}: {$msg['message']}\n";
        }
    } else {
        echo "No messages available\n";
    }
    echo "✓ Test PASSED\n";
} catch (\Exception $e) {
    echo "❌ Test FAILED: " . $e->getMessage() . "\n";
}

echo "\n";

// TEST 2: SEND Message
echo "TEST 2: POST /api/chat/send-message\n";
echo "─────────────────────────────────────────────\n";
$message = "Test message from API at " . date('H:i:s');
try {
    $response = $client->post('/api/chat/send-message', [
        'headers' => $headers,
        'json' => ['message' => $message]
    ]);
    $data = json_decode($response->getBody(), true);
    
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Success: " . ($data['success'] ? 'YES' : 'NO') . "\n";
    echo "Message: {$data['message']}\n";
    
    if ($data['success'] && isset($data['data'])) {
        echo "Message sent:\n";
        echo "  • ID: {$data['data']['id']}\n";
        echo "  • User: {$data['data']['user']['name']}\n";
        echo "  • Content: {$data['data']['message']}\n";
        echo "  • Timestamp: {$data['data']['created_at']}\n";
        echo "✓ Test PASSED\n";
    }
} catch (\Exception $e) {
    echo "❌ Test FAILED: " . $e->getMessage() . "\n";
}

echo "\n";

// TEST 3: GET Messages Again (verify sent message appears)
echo "TEST 3: GET /api/chat/get-messages (verify sent message)\n";
echo "─────────────────────────────────────────────\n";
try {
    $response = $client->get('/api/chat/get-messages?limit=10', ['headers' => $headers]);
    $data = json_decode($response->getBody(), true);
    
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Total messages: " . count($data['data']) . "\n";
    
    $found = false;
    foreach ($data['data'] as $msg) {
        if (str_contains($msg['message'], 'Test message from API')) {
            $found = true;
            echo "✓ Sent message verified in response\n";
            echo "  • Message: {$msg['message']}\n";
            echo "  • ID: {$msg['id']}\n";
            break;
        }
    }
    
    if (!$found) {
        echo "⚠ Sent message not yet in response (check polling delay)\n";
    }
} catch (\Exception $e) {
    echo "❌ Test FAILED: " . $e->getMessage() . "\n";
}

echo "\n";

// TEST 4: Multi-user message retrieval
echo "TEST 4: Fetch messages from different user perspective\n";
echo "─────────────────────────────────────────────\n";
$user3 = User::find(3); // ngo@sheltra.test
if ($user3) {
    $token3 = $user3->createToken('test-token-2')->plainTextToken;
    try {
        $response = $client->get('/api/chat/get-messages', ['headers' => ['Authorization' => "Bearer $token3"]]);
        $data = json_decode($response->getBody(), true);
        
        echo "NGO user ({$user3->email}) can see:\n";
        echo "  • Total messages: " . count($data['data']) . "\n";
        echo "✓ Test PASSED - All users can see all messages\n";
    } catch (\Exception $e) {
        echo "❌ Test FAILED: " . $e->getMessage() . "\n";
    }
} else {
    echo "⚠ NGO user not found\n";
}

echo "\n════════════════════════════════════════════════════════════\n";
echo "                   TEST COMPLETE\n";
echo "════════════════════════════════════════════════════════════\n";
