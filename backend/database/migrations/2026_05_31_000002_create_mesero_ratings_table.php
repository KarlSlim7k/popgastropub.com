<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mesero_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('mesero_id')->constrained('meseros')->onDelete('cascade');
            $table->unsignedTinyInteger('rating'); // 1-5
            $table->string('comentario', 255)->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'mesero_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mesero_ratings');
    }
};
