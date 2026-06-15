<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservas', function (Blueprint $table) {
            $table->string('email')->nullable()->after('telefono');
        });

        DB::statement('ALTER TABLE reservas MODIFY telefono VARCHAR(50) NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE reservas MODIFY telefono VARCHAR(50) NOT NULL');

        Schema::table('reservas', function (Blueprint $table) {
            $table->dropColumn('email');
        });
    }
};
