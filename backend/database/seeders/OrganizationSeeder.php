<?php

namespace Database\Seeders;

use App\Models\Organization;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        Organization::create([
            'name' => 'Demo Organization',
            'slug' => 'demo',
            'description' => 'Demo organization for MVP',
            'is_active' => true,
        ]);
    }
}

