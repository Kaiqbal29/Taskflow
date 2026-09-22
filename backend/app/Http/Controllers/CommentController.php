<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Project;
use App\Models\Task;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request, Workspace $workspace, Project $project, Task $task): JsonResponse
    {
        $this->authorizeTask($request, $workspace, $project, $task);
        return response()->json($task->comments()->with('user')->latest()->get());
    }

    public function store(Request $request, Workspace $workspace, Project $project, Task $task): JsonResponse
    {
        $this->authorizeTask($request, $workspace, $project, $task);
        $data = $request->validate(['body' => ['required', 'string', 'max:5000']]);
        $comment = Comment::create(['task_id' => $task->id, 'user_id' => $request->user()->id, 'body' => $data['body']]);
        return response()->json($comment->load('user'), 201);
    }

    private function authorizeTask(Request $request, Workspace $workspace, Project $project, Task $task): void
    {
        abort_unless($workspace->members()->whereKey($request->user()->id)->exists(), 403);
        abort_unless($task->project_id === $project->id && $project->workspace_id === $workspace->id, 404);
    }
}
