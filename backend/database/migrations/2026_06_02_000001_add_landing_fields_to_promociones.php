<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->string('slug', 250)->nullable()->after('titulo');
            $table->boolean('landing_enabled')->default(false)->after('imagen');
            $table->timestamp('published_at')->nullable()->after('landing_enabled');

            $table->unique('slug', 'promociones_slug_unique');
            $table->index(
                ['landing_enabled', 'activa', 'estado', 'published_at'],
                'promociones_public_landing_index'
            );
            $table->index('published_at', 'promociones_published_at_index');
        });
    }

    public function down(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->dropUnique('promociones_slug_unique');
            $table->dropIndex('promociones_public_landing_index');
            $table->dropIndex('promociones_published_at_index');
            $table->dropColumn(['slug', 'landing_enabled', 'published_at']);
        });
    }
};
