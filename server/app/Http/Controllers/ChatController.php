<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

/**
 * ChatController - Polling-Based Chat System
 * 
 * Handles real-time chat operations:
 * - sendMessage: Insert new messages into database
 * - getMessages: Retrieve latest messages with pagination
 * 
 * No WebSocket - uses simple HTTP polling (client polls every 3 seconds)
 * Authentication required: Only authenticated users can send/receive messages
 */
class ChatController extends Controller
{
    /**
     * POST /api/chat/send-message
     * 
     * Insert a new message into the database.
     * Prevents empty messages and validates input.
     * 
     * @param Request $request Contains 'message' field
     * @return JsonResponse { success: bool, message: string, data: Message|null }
     */
    public function sendMessage(Request $request): JsonResponse
    {
        try {
            # Validate input
            $validated = $request->validate([
                'message' => 'required|string|max:1000|min:1',
            ]);

            # Get authenticated user
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            # Create and save message
            $chatMessage = Message::create([
                'user_id' => $user->id,
                'message' => $validated['message'],
            ]);

            # Load user relationship for response
            $chatMessage->load('user:id,name,email,role');

            return response()->json([
                'success' => true,
                'message' => 'Message sent successfully',
                'data' => $chatMessage,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send message: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/chat/get-messages
     * 
     * Fetch latest messages from database.
     * Supports pagination and filtering by timestamp to prevent duplicates.
     * 
     * Query Parameters:
     * - limit: Number of messages to fetch (default: 50, max: 100)
     * - lastMessageId: Get messages after this ID (prevents duplicates during polling)
     * - lastTimestamp: Get messages after this timestamp
     * 
     * @param Request $request Query parameters
     * @return JsonResponse { success: bool, message: string, data: Message[] }
     */
    public function getMessages(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            # Get query parameters with defaults
            $limit = min((int) $request->query('limit', 50), 100); # Cap at 100
            $lastMessageId = $request->query('lastMessageId');
            $lastTimestamp = $request->query('lastTimestamp');

            # Build query
            $query = Message::query();

            # Filter by lastMessageId to prevent duplicates during polling
            if ($lastMessageId) {
                $query->where('id', '>', (int) $lastMessageId);
            } elseif ($lastTimestamp) {
                # Alternative: filter by timestamp (more accurate for clock-skew scenarios)
                $query->where('created_at', '>', $lastTimestamp);
            }

            # Fetch messages with user relationship, ordered by creation time
            $messages = $query
                ->with('user')
                ->orderBy('created_at', 'asc')
                ->limit($limit)
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Messages fetched successfully',
                'data' => $messages,
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Chat getMessages error: ' . $e->getMessage() . ' Stack: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch messages: ' . $e->getMessage(),
            ], 500);
        }
    }
}
