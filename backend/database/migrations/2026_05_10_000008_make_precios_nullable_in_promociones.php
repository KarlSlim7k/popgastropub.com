<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('ALTER TABLE promociones MODIFY precio_original DECIMAL(10,2) NULL DEFAULT NULL');
        DB::statement('ALTER TABLE promociones MODIFY precio_promo DECIMAL(10,2) NULL DEFAULT NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE promociones MODIFY precio_original DECIMAL(10,2) NOT NULL');
        DB::statement('ALTER TABLE promociones MODIFY precio_promo DECIMAL(10,2) NOT NULL');
    }
};
