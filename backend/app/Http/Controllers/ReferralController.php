<?php

namespace App\Http\Controllers;

use App\Models\Referral;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReferralController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Generate code if not exists
        if (!$user->referral_code) {
            $user->referral_code = $this->generateCode($user);
            $user->save();
        }

        $referrals = Referral::with('referred:id,name,created_at')
            ->where('referrer_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'referral_code' => $user->referral_code,
            'total_referrals' => $referrals->count(),
            'converted' => $referrals->where('status', 'converted')->count(),
            'points_earned' => $referrals->where('status', 'converted')->count() * 200,
            'referrals' => $referrals->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->referred?->name ?? 'Usuario',
                'status' => $r->status,
                'date' => $r->created_at->diffForHumans(),
                'converted_at' => $r->converted_at?->diffForHumans(),
            ]),
        ]);
    }

    private function generateCode(User $user): string
    {
        $name = Str::upper(Str::slug(explode(' ', $user->name)[0], ''));
        $code = 'POP-' . $name . '-' . date('Y');

        if (User::where('referral_code', $code)->exists()) {
            $code .= '-' . Str::random(3);
        }

        return $code;
    }
}
