<?php

namespace App\Http\Controllers;

use App\Models\UserGroup;
use Illuminate\Http\Request;

class UserGroupController extends Controller
{
    public function index(Request $request)
    {
        $groups = UserGroup::with(['creator', 'members'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($groups);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $group = UserGroup::create([
            'name' => $request->name,
            'description' => $request->description,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($group->load('creator'), 201);
    }

    public function addMember(Request $request, $groupId)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $group = UserGroup::findOrFail($groupId);
        $group->members()->syncWithoutDetaching([$request->user_id]);

        return response()->json(['message' => 'Member added']);
    }

    public function removeMember(Request $request, $groupId, $userId)
    {
        $group = UserGroup::findOrFail($groupId);
        $group->members()->detach($userId);

        return response()->json(['message' => 'Member removed']);
    }
}

