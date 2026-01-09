<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Organization;
use App\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::first();
        $employeeRole = Role::where('name', 'employee')->first();

        if (!$organization || !$employeeRole) {
            return; // Missing required data
        }

        // Only seed if we have fewer than 6 users (admin + 5 demo users)
        if (User::count() >= 6) {
            return;
        }

        $users = [
            [
                'organization_id' => $organization->id,
                'username' => 'john.doe',
                'email' => 'john.doe@company.com',
                'first_name' => 'John',
                'last_name' => 'Doe',
                'password' => Hash::make('password'),
                'status' => 'online',
                'last_seen_at' => now()->subMinutes(5),
                'email_verified_at' => now(),
            ],
            [
                'organization_id' => $organization->id,
                'username' => 'jane.smith',
                'email' => 'jane.smith@company.com',
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'password' => Hash::make('password'),
                'status' => 'away',
                'last_seen_at' => now()->subMinutes(30),
                'email_verified_at' => now(),
            ],
            [
                'organization_id' => $organization->id,
                'username' => 'mike.johnson',
                'email' => 'mike.johnson@company.com',
                'first_name' => 'Mike',
                'last_name' => 'Johnson',
                'password' => Hash::make('password'),
                'status' => 'online',
                'last_seen_at' => now()->subMinutes(2),
                'email_verified_at' => now(),
            ],
            [
                'organization_id' => $organization->id,
                'username' => 'sarah.wilson',
                'email' => 'sarah.wilson@company.com',
                'first_name' => 'Sarah',
                'last_name' => 'Wilson',
                'password' => Hash::make('password'),
                'status' => 'offline',
                'last_seen_at' => now()->subHours(2),
                'email_verified_at' => now(),
            ],
            [
                'organization_id' => $organization->id,
                'username' => 'david.brown',
                'email' => 'david.brown@company.com',
                'first_name' => 'David',
                'last_name' => 'Brown',
                'password' => Hash::make('password'),
                'status' => 'online',
                'last_seen_at' => now()->subMinutes(15),
                'email_verified_at' => now(),
            ],
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);
            $user->roles()->attach($employeeRole->id);
        }
    }
}