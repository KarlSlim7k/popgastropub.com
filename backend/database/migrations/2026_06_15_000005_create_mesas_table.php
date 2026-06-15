<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mesas', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('numero')->unique();
            $table->unsignedSmallInteger('capacidad')->default(4);
            $table->boolean('activa')->default(true);
            $table->timestamps();
        });

        for ($numero = 1; $numero <= 12; $numero++) {
            DB::table('mesas')->insert([
                'numero' => $numero,
                'capacidad' => 4,
                'activa' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('mesas');
    }
};
