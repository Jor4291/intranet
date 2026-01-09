<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Task;
use App\Models\User;

class TaskSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed if no tasks exist
        if (\App\Models\Task::count() > 0) {
            return;
        }

        $users = User::all();

        if ($users->isEmpty()) {
            return; // No users to create tasks for
        }

        $tasks = [
            [
                'user_id' => $users->first()->id,
                'title' => 'Review Q4 performance reports',
                'description' => 'Go through all department performance reports and prepare summary for executive team',
                'completed' => false,
                'priority' => 'high',
                'due_date' => now()->addDays(3)->toDateString(),
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
            [
                'user_id' => $users->first()->id,
                'title' => 'Schedule team meeting for next sprint planning',
                'description' => 'Coordinate with team leads to find a time that works for everyone',
                'completed' => true,
                'priority' => 'medium',
                'due_date' => now()->subDays(1)->toDateString(),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(1),
            ],
            [
                'user_id' => $users->first()->id,
                'title' => 'Update project documentation',
                'description' => 'Make sure all recent changes are documented in the wiki',
                'completed' => false,
                'priority' => 'medium',
                'due_date' => now()->addDays(7)->toDateString(),
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'user_id' => $users->skip(1)->first()?->id ?? $users->first()->id,
                'title' => 'Client presentation preparation',
                'description' => 'Prepare slides and demo for upcoming client meeting',
                'completed' => false,
                'priority' => 'high',
                'due_date' => now()->addDays(2)->toDateString(),
                'created_at' => now()->subHours(6),
                'updated_at' => now()->subHours(6),
            ],
            [
                'user_id' => $users->skip(1)->first()?->id ?? $users->first()->id,
                'title' => 'Code review for feature branch',
                'description' => 'Review the new authentication feature implementation',
                'completed' => true,
                'priority' => 'medium',
                'due_date' => now()->subHours(12)->toDateString(),
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subHours(12),
            ],
            [
                'user_id' => $users->skip(2)->first()?->id ?? $users->first()->id,
                'title' => 'Database backup verification',
                'description' => 'Verify that automated backups are working correctly',
                'completed' => false,
                'priority' => 'low',
                'due_date' => now()->addDays(5)->toDateString(),
                'created_at' => now()->subHours(3),
                'updated_at' => now()->subHours(3),
            ],
        ];

        foreach ($tasks as $task) {
            Task::create($task);
        }
    }
}