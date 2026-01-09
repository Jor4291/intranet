<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Document;
use App\Models\User;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        // Only seed if no documents exist
        if (\App\Models\Document::count() > 0) {
            return;
        }

        $users = User::all();

        if ($users->isEmpty()) {
            return; // No users to create documents for
        }

        $documents = [
            [
                'user_id' => $users->first()->id,
                'original_filename' => 'Company_Policies_2024.pdf',
                'filename' => 'company_policies_2024_' . time() . '.pdf',
                'path' => 'documents/',
                'mime_type' => 'application/pdf',
                'size' => 2457600, // ~2.4MB
                'description' => 'Updated company policies and procedures for 2024',
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ],
            [
                'user_id' => $users->first()->id,
                'original_filename' => 'Employee_Handbook.pdf',
                'filename' => 'employee_handbook_' . time() . '.pdf',
                'path' => 'documents/',
                'mime_type' => 'application/pdf',
                'size' => 1843200, // ~1.8MB
                'description' => 'Complete employee handbook with benefits and guidelines',
                'created_at' => now()->subDays(30),
                'updated_at' => now()->subDays(30),
            ],
            [
                'user_id' => $users->skip(1)->first()?->id ?? $users->first()->id,
                'original_filename' => 'Q4_Quarterly_Report.xlsx',
                'filename' => 'q4_quarterly_report_' . time() . '.xlsx',
                'path' => 'documents/',
                'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'size' => 512000, // ~500KB
                'description' => 'Quarterly performance report for Q4 2024',
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ],
            [
                'user_id' => $users->skip(1)->first()?->id ?? $users->first()->id,
                'original_filename' => 'Project_Planning_Document.docx',
                'filename' => 'project_planning_' . time() . '.docx',
                'path' => 'documents/',
                'mime_type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'size' => 768000, // ~750KB
                'description' => 'Detailed planning document for the new intranet project',
                'created_at' => now()->subDays(14),
                'updated_at' => now()->subDays(14),
            ],
            [
                'user_id' => $users->skip(2)->first()?->id ?? $users->first()->id,
                'original_filename' => 'Meeting_Minutes_Jan_2024.pdf',
                'filename' => 'meeting_minutes_jan_' . time() . '.pdf',
                'path' => 'documents/',
                'mime_type' => 'application/pdf',
                'size' => 307200, // ~300KB
                'description' => 'Minutes from the January 2024 executive meeting',
                'created_at' => now()->subDays(20),
                'updated_at' => now()->subDays(20),
            ],
        ];

        foreach ($documents as $document) {
            Document::create($document);
        }
    }
}