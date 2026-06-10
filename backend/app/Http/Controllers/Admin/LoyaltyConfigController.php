<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class LoyaltyConfigController extends Controller
{
    public function index()
    {
        return response()->json(Setting::getGroup('loyalty'));
    }

    public function update(Request $request)
    {
        $request->validate([
            'data' => 'required|array',
            'data.points_per_peso' => 'sometimes|numeric|min:0',
            'data.referral_bonus' => 'sometimes|integer|min:0',
            'data.welcome_bonus' => 'sometimes|integer|min:0',
            'data.checkin_bonus' => 'sometimes|integer|min:0',
            'data.tier_lover_min' => 'sometimes|integer|min:1',
            'data.tier_vip_min' => 'sometimes|integer|min:1',
            'data.tier_elite_min' => 'sometimes|integer|min:1',
        ]);

        Setting::setGroup('loyalty', $request->input('data'));
        Cache::forget('loyalty_settings');

        return response()->json(['message' => 'Configuración de lealtad actualizada']);
    }
}
