<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('facturas')) {
            Schema::create('facturas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('ticket_path');
                $table->string('rfc');
                $table->string('razon_social');
                $table->string('regimen_fiscal');
                $table->string('codigo_postal');
                $table->string('uso_cfdi');
                $table->string('estado')->default('recibida');
                $table->string('email')->nullable();
                $table->timestamp('contadores_email_enviado_at')->nullable();
                $table->unsignedInteger('contadores_email_intentos')->default(0);
                $table->timestamp('contadores_email_ultimo_intento_at')->nullable();
                $table->timestamp('contadores_email_siguiente_intento_at')->nullable();
                $table->timestamp('contadores_email_procesando_at')->nullable();
                $table->text('contadores_email_error')->nullable();
                $table->timestamps();

                $table->index(
                    ['contadores_email_enviado_at', 'contadores_email_siguiente_intento_at'],
                    'facturas_contadores_email_retry_index'
                );
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('facturas');
    }
};
