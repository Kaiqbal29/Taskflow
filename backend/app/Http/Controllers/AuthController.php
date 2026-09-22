<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'workspace_name' => ['nullable', 'string', 'max:100'],
        ]);

        $user = User::create($data);
        $workspaceName = $data['workspace_name'] ?? $user->name . "'s Workspace";
        $workspace = Workspace::create([
            'name' => $workspaceName,
            'slug' => Str::slug($workspaceName) . '-' . Str::lower(Str::random(5)),
            'owner_id' => $user->id,
        ]);
        $workspace->members()->attach($user->id, ['role' => 'owner']);
        $project = $workspace->projects()->create([
            'name' => 'Getting Started',
            'slug' => 'getting-started-' . Str::lower(Str::random(5)),
            'description' => 'Your first TaskFlow project.',
            'color' => '#6366f1',
        ]);
        $project->tasks()->create([
            'creator_id' => $user->id,
            'title' => 'Invite your first teammate',
            'description' => 'Bring your team into the workspace and start moving work forward.',
            'status' => 'backlog',
            'priority' => 'medium',
            'position' => 0,
        ]);

        return response()->json([
            'user' => $user,
            'workspace' => $workspace,
            'token' => $user->createToken('taskflow-web')->plainTextToken,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Email atau password salah.'], 422);
        }

        return response()->json(['user' => $user, 'token' => $user->createToken('taskflow-web')->plainTextToken]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user()->load('workspaces'));
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();
        return response()->json(['message' => 'Berhasil logout.']);
    }
}
