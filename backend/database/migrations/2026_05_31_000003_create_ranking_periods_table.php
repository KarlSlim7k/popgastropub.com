<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ranking_periods', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['weekly', 'monthly']);
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('active')->default(true);
            $table->timestamps();

            $table->index(['type', 'active']);
        });

        Schema::create('ranking_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('period_id')->constrained('ranking_periods')->onDelete('cascade');
            $table->foreignId('mesero_id')->constrained('meseros')->onDelete('cascade');
            $table->unsignedInteger('puntos');
            $table->unsignedSmallInteger('position');
            $table->string('tier', 20);
            $table->timestamps();

            $table->unique(['period_id', 'mesero_id']);
        });

        // Add multiplier support to meseros
        Schema::table('meseros', function (Blueprint $table) {
            $table->decimal('point_multiplier', 3, 1)->default(1.0)->after('avg_rating');
        });
    }

    public function down(): void
    {
        Schema::table('meseros', function (Blueprint $table) {
            $table->dropColumn('point_multiplier');
        });
        Schema::dropIfExists('ranking_snapshots');
        Schema::dropIfExists('ranking_periods');
    }
};
