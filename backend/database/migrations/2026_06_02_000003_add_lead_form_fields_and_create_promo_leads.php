<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->boolean('form_enabled')->default(false)->after('cta_secondary_url');
            $table->json('form_fields')->nullable()->after('form_enabled');
        });

        Schema::create('promo_leads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('promocion_id')->constrained('promociones')->onDelete('cascade');
            $table->string('nombre', 150)->nullable();
            $table->string('telefono', 30)->nullable();
            $table->string('email', 191)->nullable();
            $table->text('mensaje')->nullable();
            $table->string('origen', 100)->nullable();
            $table->timestamps();

            $table->index(['promocion_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('promo_leads');

        Schema::table('promociones', function (Blueprint $table) {
            $table->dropColumn(['form_enabled', 'form_fields']);
        });
    }
};
