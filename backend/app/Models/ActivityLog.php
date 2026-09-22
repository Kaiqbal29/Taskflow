<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = ['workspace_id', 'user_id', 'subject_type', 'subject_id', 'action', 'metadata'];
    protected $casts = ['metadata' => 'array'];

    public function workspace() { return $this->belongsTo(Workspace::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function subject() { return $this->morphTo(); }
}
