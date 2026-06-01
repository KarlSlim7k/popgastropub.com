<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Setting;

return new class extends Migration
{
    public function up(): void
    {
        Setting::setGroup('restaurant', ['total_mesas' => '12']);
    }

    public function down(): void
    {
        Setting::where('group', 'restaurant')->where('key', 'total_mesas')->delete();
    }
};
