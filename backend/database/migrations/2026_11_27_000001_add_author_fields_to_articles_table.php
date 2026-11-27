<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (! Schema::hasColumn('articles', 'author_name')) {
                $table->string('author_name', 120)->nullable()->after('user_id');
            }
            if (! Schema::hasColumn('articles', 'author_role')) {
                $table->string('author_role', 120)->nullable()->after('author_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            if (Schema::hasColumn('articles', 'author_role')) {
                $table->dropColumn('author_role');
            }
            if (Schema::hasColumn('articles', 'author_name')) {
                $table->dropColumn('author_name');
            }
        });
    }
};
