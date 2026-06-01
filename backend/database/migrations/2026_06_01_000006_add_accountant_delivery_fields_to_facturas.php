<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facturas', function (Blueprint $table) {
            if (! Schema::hasColumn('facturas', 'email')) {
                $table->string('email')->nullable()->after('uso_cfdi');
            }
            $table->timestamp('contadores_email_enviado_at')->nullable()->after('estado');
            $table->unsignedInteger('contadores_email_intentos')->default(0)->after('contadores_email_enviado_at');
            $table->timestamp('contadores_email_ultimo_intento_at')->nullable()->after('contadores_email_intentos');
            $table->timestamp('contadores_email_siguiente_intento_at')->nullable()->after('contadores_email_ultimo_intento_at');
            $table->timestamp('contadores_email_procesando_at')->nullable()->after('contadores_email_siguiente_intento_at');
            $table->text('contadores_email_error')->nullable()->after('contadores_email_procesando_at');

            $table->index(
                ['contadores_email_enviado_at', 'contadores_email_siguiente_intento_at'],
                'facturas_contadores_email_retry_index'
            );
        });
    }

    public function down(): void
    {
        Schema::table('facturas', function (Blueprint $table) {
            $table->dropIndex('facturas_contadores_email_retry_index');
            $table->dropColumn([
                'contadores_email_enviado_at',
                'contadores_email_intentos',
                'contadores_email_ultimo_intento_at',
                'contadores_email_siguiente_intento_at',
                'contadores_email_procesando_at',
                'contadores_email_error',
            ]);
        });
    }
};
