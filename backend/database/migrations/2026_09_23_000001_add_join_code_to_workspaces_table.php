<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('workspaces', function (Blueprint $table) {
            $table->string('join_code', 12)->nullable()->unique()->after('slug');
        });

        foreach (DB::table('workspaces')->whereNull('join_code')->pluck('id') as $workspaceId) {
            do {
                $joinCode = Str::upper(Str::random(8));
            } while (DB::table('workspaces')->where('join_code', $joinCode)->exists());

            DB::table('workspaces')->where('id', $workspaceId)->update(['join_code' => $joinCode]);
        }
    }

    public function down(): void
    {
        Schema::table('workspaces', function (Blueprint $table) {
            $table->dropUnique(['join_code']);
            $table->dropColumn('join_code');
        });
    }
};
