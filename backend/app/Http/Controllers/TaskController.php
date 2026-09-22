<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Project;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request, Workspace $workspace, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $workspace, $project);
        return response()->json($project->tasks()->with(['assignee', 'creator'])->orderBy('position')->latest()->get());
    }

    public function store(Request $request, Workspace $workspace, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $workspace, $project);
        $data = $request->validate(['title' => ['required', 'string', 'max:180'], 'description' => ['nullable', 'string'], 'status' => ['nullable', 'in:backlog,in-progress,review,done'], 'priority' => ['nullable', 'in:low,medium,high'], 'assignee_id' => ['nullable', 'exists:users,id'], 'due_date' => ['nullable', 'date']]);
        $task = $project->tasks()->create([...$data, 'creator_id' => $request->user()->id, 'status' => $data['status'] ?? 'backlog', 'priority' => $data['priority'] ?? 'medium', 'position' => $project->tasks()->max('position') + 1]);
        $this->log($workspace, $request, $task, 'task.created');
        return response()->json($task->load('assignee'), 201);
    }

    public function update(Request $request, Workspace $workspace, Project $project, Task $task): JsonResponse
    {
        $this->authorizeTask($request, $workspace, $project, $task);
        $data = $request->validate(['title' => ['sometimes', 'string', 'max:180'], 'description' => ['nullable', 'string'], 'status' => ['sometimes', 'in:backlog,in-progress,review,done'], 'priority' => ['sometimes', 'in:low,medium,high'], 'assignee_id' => ['nullable', 'exists:users,id'], 'due_date' => ['nullable', 'date'], 'position' => ['sometimes', 'integer', 'min:0']]);
        $oldStatus = $task->status;
        $task->update($data);
        $this->log($workspace, $request, $task, $oldStatus !== $task->status ? 'task.status_changed' : 'task.updated', ['from' => $oldStatus, 'to' => $task->status]);
        return response()->json($task->fresh()->load('assignee'));
    }

    public function destroy(Request $request, Workspace $workspace, Project $project, Task $task): JsonResponse
    {
        $this->authorizeTask($request, $workspace, $project, $task);
        $task->delete();
        $this->log($workspace, $request, null, 'task.deleted', ['task_id' => $task->id]);
        return response()->json(['message' => 'Task dihapus.']);
    }

    private function authorizeProject(Request $request, Workspace $workspace, Project $project): void
    {
        abort_unless($workspace->members()->whereKey($request->user()->id)->exists(), 403);
        abort_unless($project->workspace_id === $workspace->id, 404);
    }

    private function authorizeTask(Request $request, Workspace $workspace, Project $project, Task $task): void
    {
        $this->authorizeProject($request, $workspace, $project);
        abort_unless($task->project_id === $project->id, 404);
    }

    private function log(Workspace $workspace, Request $request, ?Task $task, string $action, array $metadata = []): void
    {
        ActivityLog::create(['workspace_id' => $workspace->id, 'user_id' => $request->user()->id, 'subject_type' => $task ? Task::class : null, 'subject_id' => $task?->id, 'action' => $action, 'metadata' => $metadata]);
    }
}
