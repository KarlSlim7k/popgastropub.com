<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('promociones', function (Blueprint $table) {
            $table->boolean('indefinida')->default(false)->after('dias_activos');
        });

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement('ALTER TABLE promociones MODIFY dia_inicio VARCHAR(255) NULL DEFAULT NULL');
            DB::statement('ALTER TABLE promociones MODIFY dia_fin VARCHAR(255) NULL DEFAULT NULL');
        }
    }

    public function down(): void
    {
        DB::table('promociones')->whereNull('dia_inicio')->update(['dia_inicio' => '']);
        DB::table('promociones')->whereNull('dia_fin')->update(['dia_fin' => '']);

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE promociones MODIFY dia_inicio VARCHAR(255) NOT NULL DEFAULT ''");
            DB::statement("ALTER TABLE promociones MODIFY dia_fin VARCHAR(255) NOT NULL DEFAULT ''");
        }

        Schema::table('promociones', function (Blueprint $table) {
            $table->dropColumn('indefinida');
        });
    }
};
