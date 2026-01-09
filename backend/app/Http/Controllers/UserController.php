<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index()
    {
        $users = User::where('organization_id', auth()->user()->organization_id)
            ->with('roles')
            ->get();

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users',
            'email' => 'required|email|unique:users',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'organization_id' => auth()->user()->organization_id,
            'username' => $request->username,
            'email' => $request->email,
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'password' => Hash::make($request->password),
            'status' => 'offline',
        ]);

        // Assign default role (basic)
        $basicRole = \App\Models\Role::where('name', 'basic')->first();
        if ($basicRole) {
            $user->roles()->attach($basicRole->id);
        }

        return response()->json($user->load('roles'), 201);
    }

    public function show($id)
    {
        $user = User::where('organization_id', auth()->user()->organization_id)
            ->with('roles')
            ->findOrFail($id);

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::where('organization_id', auth()->user()->organization_id)
            ->findOrFail($id);

        $request->validate([
            'username' => ['required', 'string', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'status' => 'nullable|in:online,away,offline',
        ]);

        $user->update($request->only([
            'username', 'email', 'first_name', 'last_name', 'status'
        ]));

        return response()->json($user->load('roles'));
    }

    public function destroy($id)
    {
        $user = User::where('organization_id', auth()->user()->organization_id)
            ->findOrFail($id);

        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete your own account'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
