<?php

namespace App\Http\Controllers;

use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function getContacts(Request $request)
    {
        $user = $request->user();
        $users = User::where('organization_id', $user->organization_id)
            ->where('id', '!=', $user->id)
            ->select('id', 'username', 'first_name', 'last_name', 'avatar', 'status', 'last_seen_at')
            ->get();

        return response()->json($users);
    }

    public function getMessages(Request $request, $userId)
    {
        $currentUserId = $request->user()->id;

        $messages = ChatMessage::where(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                ->where('receiver_id', $userId);
        })->orWhere(function ($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)
                ->where('receiver_id', $currentUserId);
        })
        ->with(['sender', 'receiver'])
        ->orderBy('created_at', 'asc')
        ->get();

        // Mark messages as read
        ChatMessage::where('sender_id', $userId)
            ->where('receiver_id', $currentUserId)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json($messages);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = ChatMessage::create([
            'sender_id' => $request->user()->id,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        // Store message in cache for SSE delivery
        $newMessages = \Illuminate\Support\Facades\Cache::get("user_{$request->receiver_id}_new_messages", []);
        $newMessages[] = $message->load('sender', 'receiver');
        \Illuminate\Support\Facades\Cache::put("user_{$request->receiver_id}_new_messages", $newMessages, 60);

        return response()->json($message->load('sender', 'receiver'), 201);
    }
}

