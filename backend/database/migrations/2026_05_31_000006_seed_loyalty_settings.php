<?php

use Illuminate\Database\Migrations\Migration;
use App\Models\Setting;

return new class extends Migration
{
    public function up(): void
    {
        Setting::setGroup('loyalty', [
            'points_per_peso'    => '0.1',   // 1 pt per $10 MXN
            'referral_bonus'     => '200',
            'welcome_bonus'      => '50',
            'checkin_bonus'      => '25',
            'birthday_bonus'     => '150',
            'review_bonus'       => '100',
            'share_bonus'        => '30',
            'tier_lover_min'     => '500',
            'tier_vip_min'       => '1500',
            'tier_elite_min'     => '3000',
        ]);
    }

    public function down(): void
    {
        Setting::where('group', 'loyalty')->delete();
    }
};
