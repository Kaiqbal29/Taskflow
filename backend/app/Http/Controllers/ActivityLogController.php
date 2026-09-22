<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Workspace;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index(Request $request, Workspace $workspace): JsonResponse
    {
        abort_unless($workspace->members()->whereKey($request->user()->id)->exists(), 403);
        return response()->json($workspace->activityLogs()->with('user')->latest()->limit(30)->get());
    }
}
