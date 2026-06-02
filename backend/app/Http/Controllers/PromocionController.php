<?php

namespace App\Http\Controllers;

use App\Models\Promocion;

class PromocionController extends Controller
{
    public function index()
    {
        $promociones = Promocion::where('activa', true)
            ->orderBy('dia_inicio')
            ->get()
            ->filter(fn(Promocion $promo) => $promo->isWithinDateWindow(today()))
            ->values()
            ->map(fn(Promocion $promo) => $this->toPublic($promo));

        return response()->json(['data' => $promociones]);
    }

    public function show(string $slug)
    {
        $promo = Promocion::where('slug', $slug)
            ->where('landing_enabled', true)
            ->whereNotNull('published_at')
            ->where('activa', true)
            ->where('estado', 'activa')
            ->firstOrFail();

        abort_unless($promo->hasPublicLanding(today()), 404);

        return response()->json(['data' => $this->toPublic($promo)]);
    }

    private function toPublic(Promocion $promo): array
    {
        $data = $promo->toArray();
        $data['dias_activos'] = $promo->activeDays();
        $data['disponible_hoy'] = $promo->isAvailableOn(today());
        $data['landing_url'] = $promo->hasPublicLanding(today())
            ? rtrim((string) config('app.frontend_url'), '/') . '/promo/' . $promo->slug
            : null;

        return $data;
    }
}
