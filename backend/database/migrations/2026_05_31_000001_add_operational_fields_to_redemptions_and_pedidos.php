<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reward_redemptions', function (Blueprint $table) {
            $table->unsignedBigInteger('recompensa_id')->nullable()->change();
            $table->string('descripcion')->nullable()->after('estado');
        });

        Schema::table('pedidos', function (Blueprint $table) {
            $table->timestamp('puntos_acreditados_at')->nullable()->after('puntos_ganados');
        });

        Schema::table('meseros', function (Blueprint $table) {
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('pedidos', function (Blueprint $table) {
            $table->dropColumn('puntos_acreditados_at');
        });

        Schema::table('meseros', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
        });

        Schema::table('reward_redemptions', function (Blueprint $table) {
            $table->dropColumn('descripcion');
            $table->unsignedBigInteger('recompensa_id')->nullable(false)->change();
        });
    }
};
