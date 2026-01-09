<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ExternalLink;
use App\Models\Organization;

class ExternalLinkSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed if no external links exist
        if (\App\Models\ExternalLink::count() > 0) {
            return;
        }

        $organization = Organization::first();

        if (!$organization) {
            return; // No organization to create links for
        }

        $links = [
            [
                'organization_id' => $organization->id,
                'name' => 'Company Website',
                'url' => 'https://www.company.com',
                'description' => 'Official company website and marketing materials',
                'icon' => '🌐',
                'order' => 1,
                'is_active' => true,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'organization_id' => $organization->id,
                'name' => 'HR Portal',
                'url' => 'https://hr.company.com',
                'description' => 'Human resources portal for benefits and policies',
                'icon' => '👥',
                'order' => 2,
                'is_active' => true,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'organization_id' => $organization->id,
                'name' => 'Project Management',
                'url' => 'https://projects.company.com',
                'description' => 'Jira/Asana project management system',
                'icon' => '📋',
                'order' => 3,
                'is_active' => true,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'organization_id' => $organization->id,
                'name' => 'Git Repository',
                'url' => 'https://git.company.com',
                'description' => 'Source code repository and version control',
                'icon' => '💻',
                'order' => 4,
                'is_active' => true,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'organization_id' => $organization->id,
                'name' => 'Time Tracking',
                'url' => 'https://time.company.com',
                'description' => 'Time tracking and project time management',
                'icon' => '⏰',
                'order' => 5,
                'is_active' => true,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'organization_id' => $organization->id,
                'name' => 'Support Portal',
                'url' => 'https://support.company.com',
                'description' => 'IT support tickets and help desk',
                'icon' => '🆘',
                'order' => 6,
                'is_active' => true,
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
        ];

        foreach ($links as $link) {
            ExternalLink::create($link);
        }
    }
}