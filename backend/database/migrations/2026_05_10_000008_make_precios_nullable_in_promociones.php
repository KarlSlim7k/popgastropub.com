<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            // SQLite doesn't support MODIFY; columns are already nullable by default in recreated tables
            return;
        }
        DB::statement('ALTER TABLE promociones MODIFY precio_original DECIMAL(10,2) NULL DEFAULT NULL');
        DB::statement('ALTER TABLE promociones MODIFY precio_promo DECIMAL(10,2) NULL DEFAULT NULL');
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }
        DB::statement('ALTER TABLE promociones MODIFY precio_original DECIMAL(10,2) NOT NULL');
        DB::statement('ALTER TABLE promociones MODIFY precio_promo DECIMAL(10,2) NOT NULL');
    }
};
