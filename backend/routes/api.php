<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\WorkspaceController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::apiResource('workspaces', WorkspaceController::class)->only(['index', 'show', 'store']);
        Route::post('/workspaces/{workspace}/members', [WorkspaceController::class, 'addMember']);
        Route::get('/workspaces/{workspace}/activity', [ActivityLogController::class, 'index']);
        Route::get('/workspaces/{workspace}/projects', [ProjectController::class, 'index']);
        Route::post('/workspaces/{workspace}/projects', [ProjectController::class, 'store']);
        Route::get('/workspaces/{workspace}/projects/{project}', [ProjectController::class, 'show']);
        Route::get('/workspaces/{workspace}/projects/{project}/tasks', [TaskController::class, 'index']);
        Route::post('/workspaces/{workspace}/projects/{project}/tasks', [TaskController::class, 'store']);
        Route::patch('/workspaces/{workspace}/projects/{project}/tasks/{task}', [TaskController::class, 'update']);
        Route::delete('/workspaces/{workspace}/projects/{project}/tasks/{task}', [TaskController::class, 'destroy']);
        Route::get('/workspaces/{workspace}/projects/{project}/tasks/{task}/comments', [CommentController::class, 'index']);
        Route::post('/workspaces/{workspace}/projects/{project}/tasks/{task}/comments', [CommentController::class, 'store']);
    });
});
