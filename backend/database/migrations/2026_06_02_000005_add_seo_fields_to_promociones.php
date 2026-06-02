<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->string('seo_title')->nullable()->after('landing_template');
            $table->string('seo_description', 500)->nullable()->after('seo_title');
            $table->string('og_image', 500)->nullable()->after('seo_description');
        });
    }

    public function down(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->dropColumn(['seo_title', 'seo_description', 'og_image']);
        });
    }
};
