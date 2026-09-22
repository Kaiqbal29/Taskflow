<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }

    public function workspaces()
    {
        return $this->belongsToMany(Workspace::class, 'workspace_user')->withPivot('role')->withTimestamps();
    }

    public function ownedWorkspaces()
    {
        return $this->hasMany(Workspace::class, 'owner_id');
    }

    public function assignedTasks()
    {
        return $this->hasMany(Task::class, 'assignee_id');
    }
}
