<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NewsfeedPost;
use App\Models\User;

class NewsfeedPostSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed if no posts exist
        if (NewsfeedPost::count() > 0) {
            return;
        }

        $users = User::all();

        if ($users->isEmpty()) {
            return; // No users to create posts for
        }

        $posts = [
            [
                'title' => 'Welcome to the Company Intranet!',
                'content' => 'Excited to launch our new intranet platform. This will be our central hub for communication, collaboration, and company updates. Feel free to explore all the features!',
                'user_id' => $users->first()->id,
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'title' => 'Q4 Goals Review',
                'content' => 'Just finished our quarterly goals review. Great progress across all teams! Our development team has exceeded targets, and sales are looking strong. Let\'s keep up the momentum into Q1.',
                'user_id' => $users->skip(1)->first()?->id ?? $users->first()->id,
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'title' => 'New Coffee Machine in Break Room',
                'content' => 'Great news! We\'ve installed a new espresso machine in the break room. Premium coffee available 24/7. ☕',
                'user_id' => $users->first()->id,
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'title' => 'Remote Work Policy Update',
                'content' => 'Following feedback from the team, we\'ve updated our remote work policy. Starting next month, we\'ll offer flexible work arrangements for eligible positions. Details will be shared in next week\'s all-hands meeting.',
                'user_id' => $users->skip(2)->first()?->id ?? $users->first()->id,
                'created_at' => now()->subHours(12),
                'updated_at' => now()->subHours(12),
            ],
            [
                'title' => 'Team Building Event Next Month',
                'content' => 'Mark your calendars! We\'re planning a team building event for next month. More details coming soon, but it\'s going to be fun! 🎉',
                'user_id' => $users->first()->id,
                'created_at' => now()->subHours(6),
                'updated_at' => now()->subHours(6),
            ],
            [
                'content' => 'Just wrapped up an amazing client presentation. The new dashboard features really impressed them! Looking forward to feedback.',
                'user_id' => $users->skip(1)->first()?->id ?? $users->first()->id,
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ],
            [
                'content' => 'Anyone up for lunch today? Thinking of trying that new sushi place downtown.',
                'user_id' => $users->skip(3)->first()?->id ?? $users->first()->id,
                'created_at' => now()->subHours(1),
                'updated_at' => now()->subHours(1),
            ],
        ];

        foreach ($posts as $post) {
            NewsfeedPost::create($post);
        }
    }
}