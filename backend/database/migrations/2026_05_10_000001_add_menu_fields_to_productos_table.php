<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->decimal('costo', 10, 2)->default(0)->after('precio');
            $table->integer('stock')->default(100)->after('costo');
            $table->string('status')->default('available')->after('stock');
            $table->integer('pedidos_count')->default(0)->after('status');
            $table->decimal('rating', 3, 1)->default(0)->after('pedidos_count');
            $table->json('alergenos')->nullable()->after('rating');
            $table->boolean('tiene_promo')->default(false)->after('alergenos');
            $table->decimal('precio_promo', 10, 2)->nullable()->after('tiene_promo');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn(['costo', 'stock', 'status', 'pedidos_count', 'rating', 'alergenos', 'tiene_promo', 'precio_promo']);
        });
    }
};
