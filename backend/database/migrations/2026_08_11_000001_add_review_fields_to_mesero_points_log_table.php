<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('mesero_points_log', function (Blueprint $table) {
            $table->unsignedInteger('quantity')->default(1)->after('category');
            $table->string('status', 20)->default('approved')->after('multiplier')->index();
            $table->foreignId('submitted_by')->nullable()->after('status')->constrained('users')->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->after('submitted_by')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->string('description')->nullable()->after('reviewed_at');
        });
    }

    public function down(): void
    {
        Schema::table('mesero_points_log', function (Blueprint $table) {
            $table->dropForeign(['submitted_by']);
            $table->dropForeign(['reviewed_by']);
            $table->dropColumn([
                'quantity',
                'status',
                'submitted_by',
                'reviewed_by',
                'reviewed_at',
                'description',
            ]);
        });
    }
};
