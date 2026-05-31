<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticket_redeems', function (Blueprint $table) {
            $table->id();
            $table->string('ref', 100)->unique();
            $table->integer('total');
            $table->integer('puntos');
            $table->foreignId('mesero_id')->nullable()->constrained('meseros')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->integer('ts_emision');
            $table->timestamp('canjeado_at')->nullable();
            $table->string('ip_canje', 45)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_redeems');
    }
};
