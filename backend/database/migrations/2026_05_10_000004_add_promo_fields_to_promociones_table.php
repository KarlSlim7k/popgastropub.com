<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->string('tipo')->default('descuento')->after('descripcion');
            $table->string('descuento')->nullable()->after('tipo');
            $table->string('dias_activos')->nullable()->after('dia_fin');
            $table->string('estado')->default('activa')->after('activa');
            $table->integer('redenciones')->default(0)->after('estado');
            $table->integer('meta')->default(0)->after('redenciones');
            $table->decimal('ingresos', 12, 2)->default(0)->after('meta');
        });
    }

    public function down(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->dropColumn(['tipo', 'descuento', 'dias_activos', 'estado', 'redenciones', 'meta', 'ingresos']);
        });
    }
};
