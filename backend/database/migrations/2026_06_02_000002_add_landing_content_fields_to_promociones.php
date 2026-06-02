<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->string('landing_title')->nullable()->after('landing_enabled');
            $table->string('landing_subtitle', 500)->nullable()->after('landing_title');
            $table->text('landing_content')->nullable()->after('landing_subtitle');
            $table->string('landing_template', 50)->default('editorial')->after('landing_content');
            $table->string('cta_primary_text', 100)->nullable()->after('landing_template');
            $table->string('cta_primary_url', 500)->nullable()->after('cta_primary_text');
            $table->string('cta_secondary_text', 100)->nullable()->after('cta_primary_url');
            $table->string('cta_secondary_url', 500)->nullable()->after('cta_secondary_text');
        });
    }

    public function down(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->dropColumn([
                'landing_title',
                'landing_subtitle',
                'landing_content',
                'landing_template',
                'cta_primary_text',
                'cta_primary_url',
                'cta_secondary_text',
                'cta_secondary_url',
            ]);
        });
    }
};
