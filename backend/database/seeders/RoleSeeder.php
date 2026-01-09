<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $organization = \App\Models\Organization::where('slug', 'demo')->first();
        
        if (!$organization) {
            $this->command->error('Organization not found. Please run OrganizationSeeder first.');
            return;
        }

        $roles = [
            [
                'organization_id' => $organization->id,
                'name' => 'basic',
                'display_name' => 'Basic User',
                'description' => 'Standard user with view permissions',
                'permissions' => ['view'],
                'is_system' => true,
            ],
            [
                'organization_id' => $organization->id,
                'name' => 'moderator',
                'display_name' => 'Moderator',
                'description' => 'User with view and edit-create permissions',
                'permissions' => ['view', 'edit-create'],
                'is_system' => true,
            ],
            [
                'organization_id' => $organization->id,
                'name' => 'administrator',
                'display_name' => 'Administrator',
                'description' => 'Full access with admin permissions',
                'permissions' => ['view', 'edit-create', 'admin'],
                'is_system' => true,
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}

