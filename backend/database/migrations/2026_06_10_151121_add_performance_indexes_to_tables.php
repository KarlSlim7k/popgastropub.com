<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_redeems', function (Blueprint $table) {
            // La unicidad de folio_ticket la valida TicketValidator con mensaje
            // amigable; un unique constraint a nivel BD rompería ese flujo.
            $table->dropUnique(['folio_ticket']);
            $table->index('folio_ticket');
        });

        Schema::table('loyalty_transactions', function (Blueprint $table) {
            $table->index(['user_id', 'created_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->index('points');
        });

        Schema::table('meseros', function (Blueprint $table) {
            $table->index('puntos');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_redeems', function (Blueprint $table) {
            $table->dropIndex(['folio_ticket']);
            $table->unique('folio_ticket');
        });

        Schema::table('loyalty_transactions', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'created_at']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['points']);
        });

        Schema::table('meseros', function (Blueprint $table) {
            $table->dropIndex(['puntos']);
        });
    }
};
