<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            OrganizationSeeder::class,
            RoleSeeder::class,
            AdminUserSeeder::class,
            UserSeeder::class,
            TestUserSeeder::class,
            NewsfeedPostSeeder::class,
            TaskSeeder::class,
            DocumentSeeder::class,
            ExternalLinkSeeder::class,
        ]);
    }
}

