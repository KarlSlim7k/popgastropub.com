<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_redeems', function (Blueprint $table) {
            $table->dropIndex(['folio_ticket']);
            // Red de seguridad contra registro concurrente del mismo folio;
            // TicketValidator da el mensaje amigable en el caso secuencial y
            // el catch de QueryException cubre la carrera.
            $table->unique('folio_ticket');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_redeems', function (Blueprint $table) {
            $table->dropUnique(['folio_ticket']);
            $table->index('folio_ticket');
        });
    }
};
