<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SSEController extends Controller
{
    public function stream(Request $request)
    {
        return response()->stream(function () use ($request) {
            $userId = $request->user()->id;
            
            // Set headers for SSE
            header('Content-Type: text/event-stream');
            header('Cache-Control: no-cache');
            header('Connection: keep-alive');
            header('X-Accel-Buffering: no'); // Disable buffering in Nginx

            while (true) {
                // Send heartbeat every 30 seconds
                echo "data: " . json_encode(['type' => 'heartbeat', 'timestamp' => now()]) . "\n\n";
                ob_flush();
                flush();

                // Check for online status updates
                $onlineUsers = User::where('status', 'online')
                    ->where('last_seen_at', '>', now()->subMinutes(5))
                    ->select('id', 'username', 'first_name', 'last_name', 'status', 'last_seen_at')
                    ->get();

                echo "data: " . json_encode([
                    'type' => 'online_users',
                    'users' => $onlineUsers
                ]) . "\n\n";
                ob_flush();
                flush();

                // Check for new messages (simplified - in production, use Redis/pub-sub)
                $newMessages = Cache::get("user_{$userId}_new_messages", []);
                if (!empty($newMessages)) {
                    echo "data: " . json_encode([
                        'type' => 'new_message',
                        'messages' => $newMessages
                    ]) . "\n\n";
                    ob_flush();
                    flush();
                    Cache::forget("user_{$userId}_new_messages");
                }

                // Sleep for 5 seconds before next check
                sleep(5);

                // Check if client disconnected
                if (connection_aborted()) {
                    break;
                }
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    public function updateStatus(Request $request)
    {
        $request->validate([
            'status' => 'required|in:online,away,offline',
        ]);

        $request->user()->update([
            'status' => $request->status,
            'last_seen_at' => now(),
        ]);

        return response()->json(['message' => 'Status updated']);
    }
}

