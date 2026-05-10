<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('status')->default('activo')->after('points');
            $table->string('rfc')->nullable()->after('status');
            $table->timestamp('last_visit')->nullable()->after('rfc');
            $table->integer('orders_count')->default(0)->after('last_visit');
            $table->decimal('total_spent', 12, 2)->default(0)->after('orders_count');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status', 'rfc', 'last_visit', 'orders_count', 'total_spent']);
        });
    }
};
