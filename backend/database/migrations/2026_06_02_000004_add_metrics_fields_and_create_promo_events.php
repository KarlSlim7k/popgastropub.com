<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->unsignedBigInteger('views_count')->default(0)->after('form_fields');
            $table->unsignedBigInteger('clicks_count')->default(0)->after('views_count');
            $table->unsignedBigInteger('leads_count')->default(0)->after('clicks_count');
        });

        Schema::create('promo_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promocion_id')->constrained('promociones')->onDelete('cascade');
            $table->string('event_type', 50);
            $table->string('ip_hash', 64)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('referrer', 500)->nullable();
            $table->timestamp('created_at');

            $table->index(['promocion_id', 'event_type', 'created_at']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_events');

        Schema::table('promociones', function (Blueprint $table) {
            $table->dropColumn(['views_count', 'clicks_count', 'leads_count']);
        });
    }
};
