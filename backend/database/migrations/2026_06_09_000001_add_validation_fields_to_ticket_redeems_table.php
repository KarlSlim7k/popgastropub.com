<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('ticket_redeems', function (Blueprint $table) {
            $table->string('folio_ticket', 10)->nullable()->after('ref')->unique();
            $table->decimal('subtotal', 10, 2)->nullable()->after('total');
            $table->decimal('iva', 10, 2)->nullable()->after('subtotal');
            $table->string('hash_verificacion', 64)->nullable()->after('puntos');
            $table->string('foto_ticket_path')->nullable()->after('hash_verificacion');
            $table->timestamp('fecha_emision_ticket')->nullable()->after('foto_ticket_path');
            $table->timestamp('fecha_expiracion')->nullable()->after('ts_emision');
            $table->string('ip_generacion', 45)->nullable()->after('ip_canje');
            $table->string('user_agent', 255)->nullable()->after('ip_generacion');
            $table->enum('estado_validacion', ['valido', 'rechazado', 'pendiente'])->default('valido')->after('user_agent');

            $table->index(['mesero_id', 'estado_validacion']);
            $table->index('fecha_expiracion');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_redeems', function (Blueprint $table) {
            $table->dropUnique(['folio_ticket']);
            $table->dropIndex(['mesero_id', 'estado_validacion']);
            $table->dropIndex(['fecha_expiracion']);
            $table->dropColumn([
                'folio_ticket',
                'subtotal',
                'iva',
                'hash_verificacion',
                'foto_ticket_path',
                'fecha_emision_ticket',
                'fecha_expiracion',
                'ip_generacion',
                'user_agent',
                'estado_validacion',
            ]);
        });
    }
};
