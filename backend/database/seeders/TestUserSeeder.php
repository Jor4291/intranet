<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Organization;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the demo organization
        $organization = Organization::where('slug', 'demo')->first();

        if (!$organization) {
            // Create organization if it doesn't exist
            $organization = Organization::create([
                'name' => 'Demo Organization',
                'slug' => 'demo',
                'description' => 'Demo organization for MVP',
                'is_active' => true,
            ]);
        }

        // Create the test user
        $user = User::create([
            'organization_id' => $organization->id,
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => Hash::make('test123'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'status' => 'online',
        ]);

        // Assign administrator role
        $adminRole = Role::where('organization_id', $organization->id)
            ->where('name', 'administrator')
            ->first();

        if (!$adminRole) {
            // Create the role if it doesn't exist
            $adminRole = Role::create([
                'organization_id' => $organization->id,
                'name' => 'administrator',
                'display_name' => 'Administrator',
                'description' => 'Full system access',
            ]);
        }

        $user->roles()->attach($adminRole->id);
    }
}
