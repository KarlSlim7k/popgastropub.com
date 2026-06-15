<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('newsletter_subscribed')->default(false)->after('status');
            $table->timestamp('newsletter_subscribed_at')->nullable()->after('newsletter_subscribed');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['newsletter_subscribed', 'newsletter_subscribed_at']);
        });
    }
};
