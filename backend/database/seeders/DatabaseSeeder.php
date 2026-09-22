<?php

namespace Database\Seeders;

use App\Models\ActivityLog;
use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        $kaiqbal = User::updateOrCreate(
            ['email' => 'demo@taskflow.test'],
            ['name' => 'Kaiqbal Faris', 'password' => $password]
        );
        $nadia = User::updateOrCreate(
            ['email' => 'nadia@taskflow.test'],
            ['name' => 'Nadia Putri', 'password' => $password]
        );
        $raka = User::updateOrCreate(
            ['email' => 'raka@taskflow.test'],
            ['name' => 'Raka Aditya', 'password' => $password]
        );
        $aisyah = User::updateOrCreate(
            ['email' => 'aisyah@taskflow.test'],
            ['name' => 'Aisyah Rahma', 'password' => $password]
        );

        $workspace = Workspace::updateOrCreate(
            ['slug' => 'northstar-product-team'],
            ['name' => 'Northstar Product Team', 'owner_id' => $kaiqbal->id]
        );
        $workspace->members()->syncWithoutDetaching([
            $kaiqbal->id => ['role' => 'owner'],
            $nadia->id => ['role' => 'admin'],
            $raka->id => ['role' => 'member'],
            $aisyah->id => ['role' => 'member'],
        ]);

        $projects = [
            'website' => Project::updateOrCreate(
                ['workspace_id' => $workspace->id, 'slug' => 'website-redesign'],
                ['name' => 'Website Redesign', 'description' => 'Refresh the marketing site with a clearer product story and conversion path.', 'color' => '#6366f1', 'status' => 'active', 'start_date' => now()->subDays(14)->toDateString(), 'due_date' => now()->addDays(18)->toDateString()]
            ),
            'mobile' => Project::updateOrCreate(
                ['workspace_id' => $workspace->id, 'slug' => 'mobile-app'],
                ['name' => 'Mobile App', 'description' => 'Bring the core planning workflow to a focused mobile experience.', 'color' => '#8b5cf6', 'status' => 'active', 'start_date' => now()->subDays(7)->toDateString(), 'due_date' => now()->addDays(31)->toDateString()]
            ),
            'system' => Project::updateOrCreate(
                ['workspace_id' => $workspace->id, 'slug' => 'design-system'],
                ['name' => 'Design System', 'description' => 'Build reusable foundations so every surface feels consistent.', 'color' => '#06b6d4', 'status' => 'active', 'start_date' => now()->subDays(21)->toDateString(), 'due_date' => now()->addDays(10)->toDateString()]
            ),
        ];

        $taskRows = [
            [$projects['website'], 'Refine hero messaging', 'done', 'high', $nadia, now()->subDays(3)],
            [$projects['website'], 'Design pricing page states', 'review', 'high', $aisyah, now()->addDays(2)],
            [$projects['website'], 'Add customer proof section', 'in-progress', 'medium', $raka, now()->addDays(5)],
            [$projects['website'], 'Connect newsletter form', 'todo', 'low', $kaiqbal, now()->addDays(8)],
            [$projects['mobile'], 'Map onboarding flow', 'done', 'medium', $kaiqbal, now()->subDays(1)],
            [$projects['mobile'], 'Prototype workspace switcher', 'in-progress', 'high', $aisyah, now()->addDays(4)],
            [$projects['mobile'], 'Prepare empty states', 'todo', 'medium', $nadia, now()->addDays(12)],
            [$projects['system'], 'Document color tokens', 'review', 'medium', $raka, now()->addDays(1)],
            [$projects['system'], 'Build button variants', 'done', 'high', $aisyah, now()->subDays(5)],
            [$projects['system'], 'Audit form accessibility', 'todo', 'low', $kaiqbal, now()->addDays(6)],
        ];

        $tasks = [];
        foreach ($taskRows as [$project, $title, $status, $priority, $assignee, $dueDate]) {
            $tasks[] = Task::updateOrCreate(
                ['project_id' => $project->id, 'title' => $title],
                [
                    'creator_id' => $kaiqbal->id,
                    'assignee_id' => $assignee->id,
                    'description' => 'A focused piece of work for the ' . $project->name . ' project.',
                    'status' => $status,
                    'priority' => $priority,
                    'due_date' => $dueDate->toDateString(),
                    'position' => count($tasks),
                ]
            );
        }

        $commentRows = [
            [$tasks[1], $nadia, 'The first pass is ready for a quick review. I kept the mobile states intentionally simple.'],
            [$tasks[2], $raka, 'I added the proof section structure and will plug in the final customer logos next.'],
            [$tasks[5], $kaiqbal, 'Nice direction. Let’s make the current workspace obvious even on smaller screens.'],
            [$tasks[7], $aisyah, 'Tokens are documented with usage examples so implementation should be straightforward.'],
        ];
        foreach ($commentRows as [$task, $user, $body]) {
            Comment::firstOrCreate(['task_id' => $task->id, 'user_id' => $user->id, 'body' => $body]);
        }

        $activityRows = [
            [$kaiqbal, 'project.created', $projects['website'], ['name' => $projects['website']->name]],
            [$nadia, 'task.completed', $tasks[0], ['title' => $tasks[0]->title]],
            [$aisyah, 'comment.added', $tasks[5], ['title' => $tasks[5]->title]],
            [$raka, 'task.status_changed', $tasks[2], ['title' => $tasks[2]->title, 'status' => 'in-progress']],
            [$aisyah, 'task.completed', $tasks[8], ['title' => $tasks[8]->title]],
        ];
        foreach ($activityRows as [$user, $action, $subject, $metadata]) {
            ActivityLog::firstOrCreate(
                ['workspace_id' => $workspace->id, 'user_id' => $user->id, 'action' => $action, 'subject_id' => $subject->id, 'subject_type' => $subject::class],
                ['metadata' => $metadata]
            );
        }
    }
}
