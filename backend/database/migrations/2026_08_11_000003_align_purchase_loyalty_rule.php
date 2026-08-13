<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('loyalty_point_actions')->where('slug', 'purchase')->update([
            'action' => 'Por cada $10 MXN gastados',
            'points' => 1,
            'points_type' => 'per_amount',
            'description' => '1 punto por cada $10 MXN de consumo registrado en tu ticket.',
            'conditions' => json_encode(['amount' => 10]),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('loyalty_point_actions')->where('slug', 'purchase')->update([
            'action' => 'Por cada $5 MXN gastados',
            'conditions' => json_encode(['amount' => 5]),
            'updated_at' => now(),
        ]);
    }
};
