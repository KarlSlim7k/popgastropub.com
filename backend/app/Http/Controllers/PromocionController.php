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
            ->map(function (Promocion $promo) {
                $data = $promo->toArray();
                $data['dias_activos'] = $promo->activeDays();
                $data['disponible_hoy'] = $promo->isAvailableOn(today());

                return $data;
            });

        return response()->json(['data' => $promociones]);
    }
}
