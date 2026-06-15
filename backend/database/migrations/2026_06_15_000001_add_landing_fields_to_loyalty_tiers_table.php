<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loyalty_tiers', function (Blueprint $table) {
            $table->text('investment_text')->nullable()->after('benefits');
            $table->boolean('is_featured')->default(false)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('loyalty_tiers', function (Blueprint $table) {
            $table->dropColumn(['investment_text', 'is_featured']);
        });
    }
};
