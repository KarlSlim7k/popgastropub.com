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
            'icon' => 'payments',
            'color' => '#D96E30',
            'description' => 'En consumo dentro del restaurante o en tu pedido a domicilio.',
            'conditions' => json_encode(['amount' => 10]),
            'sort_order' => 2,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'checkin')->update([
            'action' => 'Por check-in en restaurante',
            'points' => 25,
            'icon' => 'location_on',
            'color' => '#34D399',
            'description' => 'Cada vez que visitas el local y registras tu entrada.',
            'sort_order' => 3,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'referral')->update([
            'action' => 'Por referir un amigo',
            'points' => 200,
            'icon' => 'group_add',
            'color' => '#2DD4BF',
            'description' => 'Cuando tu amigo hace su primer pedido tras registrarse con tu referido.',
            'sort_order' => 4,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'review')->update([
            'action' => 'Por reseña en Google',
            'points' => 100,
            'icon' => 'star',
            'color' => '#3B82F6',
            'description' => 'Deja una reseña con foto y recibe 100 puntos de bonificación.',
            'sort_order' => 5,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'birthday')->update([
            'action' => 'En tu cumpleaños',
            'points' => 150,
            'icon' => 'cake',
            'color' => '#A78BFA',
            'description' => 'Puntos automáticos cada año en tu fecha de cumpleaños registrada.',
            'sort_order' => 6,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'low_traffic')->update([
            'action' => 'Double Checkpoint',
            'slug' => 'double_checkpoint',
            'points' => 2,
            'points_type' => 'multiplier',
            'icon' => 'bolt',
            'color' => '#EF4444',
            'description' => 'Lunes y jueves son Double Checkpoint: el doble de puntos en ambos días. El jueves además coincide con Jueboneless — boneless al 2x1 Y el doble de puntos, todo en una sola visita.',
            'conditions' => json_encode(['multiplier' => 2, 'days' => ['monday', 'thursday']]),
            'sort_order' => 7,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'social_share')->delete();
    }

    public function down(): void
    {
        DB::table('loyalty_point_actions')->where('slug', 'double_checkpoint')->update([
            'action' => 'Double Check',
            'slug' => 'low_traffic',
            'points' => 2,
            'points_type' => 'multiplier',
            'icon' => 'calendar_today',
            'color' => '#D96725',
            'description' => '2x puntos los lunes y jueves',
            'conditions' => json_encode(['multiplier' => 2]),
            'sort_order' => 6,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'birthday')->update([
            'action' => 'Cumpleaños',
            'points' => 150,
            'icon' => 'cake',
            'color' => '#F2C777',
            'description' => 'Puntos automáticos en cumpleaños',
            'sort_order' => 7,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'review')->update([
            'action' => 'Reseña Google',
            'points' => 100,
            'icon' => 'star',
            'color' => '#F2C777',
            'description' => 'Puntos por dejar reseña con prueba',
            'sort_order' => 4,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'referral')->update([
            'action' => 'Referir amigo',
            'points' => 200,
            'icon' => 'group_add',
            'color' => '#F2C777',
            'description' => 'Cuando el amigo hace su primer pedido',
            'sort_order' => 5,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'checkin')->update([
            'action' => 'Check-in en restaurante',
            'points' => 25,
            'icon' => 'location_on',
            'color' => '#F2C777',
            'description' => 'Puntos por visitar el restaurante',
            'sort_order' => 3,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->where('slug', 'purchase')->update([
            'action' => 'Por cada $10 MXN',
            'points' => 1,
            'points_type' => 'per_amount',
            'icon' => 'shopping_cart',
            'color' => '#F2C777',
            'description' => '1 punto por cada $10 MXN gastados',
            'conditions' => json_encode(['amount' => 10]),
            'sort_order' => 2,
            'updated_at' => now(),
        ]);

        DB::table('loyalty_point_actions')->insert([
            'action' => 'Compartir en redes',
            'slug' => 'social_share',
            'points' => 30,
            'points_type' => 'fixed',
            'icon' => 'share',
            'color' => '#F2C777',
            'is_active' => true,
            'sort_order' => 8,
            'description' => 'Puntos por compartir en redes sociales',
            'conditions' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
};
