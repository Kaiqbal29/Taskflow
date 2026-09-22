<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WorkspaceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->workspaces()->withCount('projects')->get());
    }

    public function show(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorizeMember($request, $workspace);
        return response()->json($workspace->load(['members', 'projects'])->loadCount('projects'));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100']]);
        $workspace = Workspace::create(['name' => $data['name'], 'slug' => Str::slug($data['name']) . '-' . Str::lower(Str::random(5)), 'owner_id' => $request->user()->id]);
        $workspace->members()->attach($request->user()->id, ['role' => 'owner']);
        return response()->json($workspace, 201);
    }

    public function addMember(Request $request, Workspace $workspace): JsonResponse
    {
        $this->authorizeMember($request, $workspace);
        abort_unless($workspace->owner_id === $request->user()->id, 403, 'Hanya owner yang dapat menambah anggota.');
        $data = $request->validate(['email' => ['required', 'email', 'exists:users,email'], 'role' => ['nullable', 'in:admin,member']]);
        $member = User::where('email', $data['email'])->firstOrFail();
        $workspace->members()->syncWithoutDetaching([$member->id => ['role' => $data['role'] ?? 'member']]);
        ActivityLog::create(['workspace_id' => $workspace->id, 'user_id' => $request->user()->id, 'action' => 'member.added', 'metadata' => ['member_id' => $member->id]]);
        return response()->json($workspace->load('members'));
    }

    public function removeMember(Request $request, Workspace $workspace, User $member): JsonResponse
    {
        $this->authorizeMember($request, $workspace);
        abort_unless($workspace->owner_id === $request->user()->id, 403, 'Hanya owner yang dapat menghapus anggota.');
        abort_if($member->id === $workspace->owner_id, 422, 'Owner tidak dapat dihapus dari workspace.');
        abort_unless($workspace->members()->whereKey($member->id)->exists(), 404, 'Anggota tidak ditemukan di workspace ini.');
        $workspace->members()->detach($member->id);
        ActivityLog::create(['workspace_id' => $workspace->id, 'user_id' => $request->user()->id, 'action' => 'member.removed', 'metadata' => ['member_id' => $member->id]]);
        return response()->json($workspace->load('members'));
    }

    private function authorizeMember(Request $request, Workspace $workspace): void
    {
        abort_unless($workspace->members()->whereKey($request->user()->id)->exists(), 403, 'Kamu bukan anggota workspace ini.');
    }
}
