<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\TicketRedeem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketGeneratorController extends Controller
{
    public function generate(Request $request)
    {
        $validated = $request->validate([
            'total' => 'required|integer|min:1|max:99999',
        ]);

        $total = $validated['total'];
        $ref = 'TKT-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        $ts = now()->timestamp;
        $sig = hash_hmac('sha256', $total . $ref . $ts, config('app.qr_secret'));
        $puntos = intdiv($total, 10);

        $mesero = $request->user()->mesero;

        TicketRedeem::create([
            'ref' => $ref,
            'total' => $total,
            'puntos' => $puntos,
            'mesero_id' => $mesero?->id,
            'ts_emision' => $ts,
        ]);

        $url = config('app.frontend_url', 'https://popgastropub.com')
            . "/puntos/canjear?total={$total}&ref={$ref}&ts={$ts}&sig={$sig}";

        return response()->json([
            'url' => $url,
            'puntos' => $puntos,
            'ref' => $ref,
        ]);
    }
}
