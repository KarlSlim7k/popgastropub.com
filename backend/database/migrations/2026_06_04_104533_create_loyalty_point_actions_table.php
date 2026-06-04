<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_point_actions', function (Blueprint $table) {
            $table->id();
            $table->string('action');
            $table->string('slug')->unique();
            $table->integer('points')->default(0);
            $table->string('points_type')->default('fixed');
            $table->string('icon')->default('token');
            $table->string('color')->default('#F2C777');
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->text('description')->nullable();
            $table->json('conditions')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_point_actions');
    }
};