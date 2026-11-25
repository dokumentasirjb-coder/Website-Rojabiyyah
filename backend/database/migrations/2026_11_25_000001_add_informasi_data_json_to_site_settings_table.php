<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('site_settings') && !Schema::hasColumn('site_settings', 'informasi_data_json')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->longText('informasi_data_json')->nullable()->after('gallery_items_json');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('site_settings') && Schema::hasColumn('site_settings', 'informasi_data_json')) {
            Schema::table('site_settings', function (Blueprint $table) {
                $table->dropColumn('informasi_data_json');
            });
        }
    }
};
