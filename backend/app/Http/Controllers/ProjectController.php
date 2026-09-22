<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorizeMember($request, $workspace);
        return response()->json($workspace->projects()->withCount(['tasks', 'tasks as completed_tasks_count' => fn ($query) => $query->where('status', 'done')])->latest()->get());
    }

    public function store(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorizeMember($request, $workspace);
        $data = $request->validate(['name' => ['required', 'string', 'max:100'], 'description' => ['nullable', 'string'], 'color' => ['nullable', 'string', 'max:20'], 'due_date' => ['nullable', 'date']]);
        $project = $workspace->projects()->create([...$data, 'slug' => Str::slug($data['name']) . '-' . Str::lower(Str::random(5))]);
        return response()->json($project, 201);
    }

    public function show(Request $request, Workspace $workspace, Project $project): JsonResponse
    {
        $this->authorizeProject($request, $workspace, $project);
        return response()->json($project->load(['tasks.assignee', 'tasks.comments.user']));
    }

    private function authorizeMember(Request $request, Workspace $workspace): void
    {
        abort_unless($workspace->members()->whereKey($request->user()->id)->exists(), 403);
    }

    private function authorizeProject(Request $request, Workspace $workspace, Project $project): void
    {
        $this->authorizeMember($request, $workspace);
        abort_unless($project->workspace_id === $workspace->id, 404);
    }
}
