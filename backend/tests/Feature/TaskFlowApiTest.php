<?php

namespace Tests\Feature;

use App\Models\Project;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskFlowApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register_and_login(): void
    {
        $register = $this->postJson('/api/v1/auth/register', [
            'name' => 'Test User',
            'email' => 'register@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role' => 'owner',
        ]);

        $register->assertCreated()
            ->assertJsonPath('user.email', 'register@example.com')
            ->assertJsonPath('workspace.name', "Test User's Workspace")
            ->assertJsonStructure(['token']);

        $this->postJson('/api/v1/auth/login', [
            'email' => 'register@example.com',
            'password' => 'password123',
        ])->assertOk()->assertJsonStructure(['user', 'token']);
    }

    public function test_owner_can_update_and_delete_a_project(): void
    {
        [$owner, $workspace] = $this->workspaceWithOwner();
        $project = Project::create(['workspace_id' => $workspace->id, 'name' => 'Original', 'slug' => 'original-test']);
        $replacement = Project::create(['workspace_id' => $workspace->id, 'name' => 'Replacement', 'slug' => 'replacement-test']);
        $token = $owner->createToken('test')->plainTextToken;

        $this->asApiUser($token)->patchJson("/api/v1/workspaces/{$workspace->id}/projects/{$project->id}", [
            'name' => 'Updated Project',
            'description' => 'Updated description',
        ])->assertOk()->assertJsonPath('name', 'Updated Project');

        $this->asApiUser($token)->deleteJson("/api/v1/workspaces/{$workspace->id}/projects/{$replacement->id}")
            ->assertOk()->assertJsonPath('message', 'Project dihapus.');

        $this->assertDatabaseMissing('projects', ['id' => $replacement->id]);
    }

    public function test_owner_can_remove_member_but_not_owner(): void
    {
        [$owner, $workspace] = $this->workspaceWithOwner();
        $member = User::factory()->create();
        $workspace->members()->attach($member->id, ['role' => 'member']);
        $token = $owner->createToken('test')->plainTextToken;

        $this->asApiUser($token)->deleteJson("/api/v1/workspaces/{$workspace->id}/members/{$member->id}")
            ->assertOk();
        $this->assertDatabaseMissing('workspace_user', ['workspace_id' => $workspace->id, 'user_id' => $member->id]);

        $this->asApiUser($token)->deleteJson("/api/v1/workspaces/{$workspace->id}/members/{$owner->id}")
            ->assertUnprocessable();
    }

    public function test_owner_can_manage_roles_and_workspace(): void
    {
        [$owner, $workspace] = $this->workspaceWithOwner();
        $member = User::factory()->create();
        $workspace->members()->attach($member->id, ['role' => 'member']);
        $token = $owner->createToken('test')->plainTextToken;

        $this->asApiUser($token)->patchJson("/api/v1/workspaces/{$workspace->id}/members/{$member->id}", ['role' => 'admin'])
            ->assertOk();
        $this->assertDatabaseHas('workspace_user', ['workspace_id' => $workspace->id, 'user_id' => $member->id, 'role' => 'admin']);

        $this->asApiUser($token)->patchJson("/api/v1/workspaces/{$workspace->id}", ['name' => 'Updated Workspace'])
            ->assertOk()->assertJsonPath('name', 'Updated Workspace');

        $this->asApiUser($token)->deleteJson("/api/v1/workspaces/{$workspace->id}")
            ->assertOk()->assertJsonPath('message', 'Workspace dihapus.');
        $this->assertDatabaseMissing('workspaces', ['id' => $workspace->id]);
    }

    public function test_owner_can_assign_task_to_workspace_member(): void
    {
        [$owner, $workspace] = $this->workspaceWithOwner();
        $member = User::factory()->create();
        $workspace->members()->attach($member->id, ['role' => 'member']);
        $project = Project::create(['workspace_id' => $workspace->id, 'name' => 'Assigned Project', 'slug' => 'assigned-project']);
        $token = $owner->createToken('test')->plainTextToken;

        $this->asApiUser($token)->postJson("/api/v1/workspaces/{$workspace->id}/projects/{$project->id}/tasks", [
            'title' => 'Assigned task', 'assignee_id' => $member->id,
        ])->assertCreated()->assertJsonPath('assignee.id', $member->id);
        $this->assertDatabaseHas('tasks', ['project_id' => $project->id, 'assignee_id' => $member->id]);
    }

    private function workspaceWithOwner(): array
    {
        $owner = User::factory()->create();
        $workspace = Workspace::create([
            'name' => 'Test Workspace',
            'slug' => 'test-workspace-' . fake()->unique()->randomNumber(5),
            'owner_id' => $owner->id,
        ]);
        $workspace->members()->attach($owner->id, ['role' => 'owner']);
        return [$owner, $workspace];
    }

    private function asApiUser(string $token): self
    {
        return $this->withHeader('Authorization', "Bearer {$token}");
    }
}
