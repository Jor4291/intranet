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
            'username' => 'neill',
            'email' => 'neill@demo.com',
            'password' => Hash::make('demo123'),
            'first_name' => 'Neill',
            'last_name' => 'Admin',
            'status' => 'online',
        ]);

        $admin->roles()->attach($adminRole->id);

        $this->command->info('Admin user created:');
        $this->command->info('Username: neill');
        $this->command->info('Password: demo123');
    }
}

