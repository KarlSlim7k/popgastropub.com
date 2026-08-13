<?php

namespace App\Services;

use App\Models\LoyaltyTransaction;
use App\Models\Referral;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReferralService
{
    public function confirmFirstPurchase(User $referred): bool
    {
        return DB::transaction(function () use ($referred) {
            $referral = Referral::where('referred_id', $referred->id)
                ->where('status', 'pending')
                ->lockForUpdate()
                ->first();

            if (! $referral) {
                return false;
            }

            $referrer = User::whereKey($referral->referrer_id)->lockForUpdate()->first();
            if (! $referrer) {
                return false;
            }

            $bonus = (int) LoyaltyConfig::get('referral_bonus');
            $referrer->increment('points', $bonus);

            LoyaltyTransaction::create([
                'user_id' => $referrer->id,
                'points' => $bonus,
                'concept' => 'Referido convertido: '.$referred->name,
            ]);

            $referral->update(['status' => 'converted', 'converted_at' => now()]);

            return true;
        });
    }
}
