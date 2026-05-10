<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('meseros', function (Blueprint $table) {
            $table->string('iniciales', 5)->nullable()->after('nombre');
            $table->string('status')->default('activo')->after('activo');
            $table->integer('cocktail_points')->default(0)->after('puntos');
            $table->integer('premium_points')->default(0)->after('cocktail_points');
            $table->integer('pitcher_points')->default(0)->after('premium_points');
            $table->integer('bottle_points')->default(0)->after('pitcher_points');
            $table->integer('combo_points')->default(0)->after('bottle_points');
            $table->integer('upsell_points')->default(0)->after('combo_points');
            $table->integer('rating_points')->default(0)->after('upsell_points');
            $table->decimal('total_sales', 12, 2)->default(0)->after('rating_points');
            $table->integer('orders_served')->default(0)->after('total_sales');
            $table->decimal('avg_rating', 3, 1)->default(5.0)->after('orders_served');
        });
    }

    public function down(): void
    {
        Schema::table('meseros', function (Blueprint $table) {
            $table->dropColumn(['iniciales', 'status', 'cocktail_points', 'premium_points', 'pitcher_points', 'bottle_points', 'combo_points', 'upsell_points', 'rating_points', 'total_sales', 'orders_served', 'avg_rating']);
        });
    }
};
