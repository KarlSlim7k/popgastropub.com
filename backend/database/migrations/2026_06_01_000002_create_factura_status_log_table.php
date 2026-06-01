<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('factura_status_log', function (Blueprint $table) {
            $table->id();
            $table->foreignId('factura_id')->constrained('facturas')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('from_status', 30);
            $table->string('to_status', 30);
            $table->string('nota', 255)->nullable();
            $table->timestamps();

            $table->index(['factura_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('factura_status_log');
    }
};
