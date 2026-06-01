<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mesero_points_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mesero_id')->constrained('meseros')->onDelete('cascade');
            $table->string('category', 30);
            $table->integer('points');
            $table->decimal('multiplier', 3, 1)->default(1.0);
            $table->timestamps();

            $table->index(['mesero_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mesero_points_log');
    }
};
