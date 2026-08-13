<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->string('email')->nullable()->after('telefono');
        });

        Schema::table('reservas', function (Blueprint $table) {
            $table->string('telefono', 50)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->string('telefono', 50)->nullable(false)->change();
        });

        Schema::table('reservas', function (Blueprint $table) {
            $table->dropColumn('email');
        });
    }
};
