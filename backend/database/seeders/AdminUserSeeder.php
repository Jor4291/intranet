<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('slug', 'demo')->first();
        
        if (!$organization) {
            $this->command->error('Organization not found. Please run OrganizationSeeder first.');
            return;
        }

        $adminRole = Role::where('name', 'administrator')->first();
        
        if (!$adminRole) {
            $this->command->error('Administrator role not found. Please run RoleSeeder first.');
            return;
        }

        $admin = User::create([
            'organization_id' => $organization->id,
            'username' => 'admin',
            'email' => 'admin@demo.com',
            'password' => Hash::make('password123'),
            'first_name' => 'Admin',
            'last_name' => 'User',
            'status' => 'offline',
        ]);

        $admin->roles()->attach($adminRole->id);

        $this->command->info('Admin user created:');
        $this->command->info('Username: admin');
        $this->command->info('Password: password123');
    }
}

