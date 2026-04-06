<?php

namespace App\Http\Controllers;

class UbicacionController extends Controller
{
    public function show()
    {
        return response()->json([
            'nombre' => 'POP Perote',
            'direccion' => 'Justo Sierra No. 11, Col. Amado Nervo, Perote, Veracruz',
            'telefono' => '282-825-32-43',
            'horarios' => [
                'lunes' => '14:00 - 21:30',
                'martes' => 'CERRADO',
                'miercoles' => '14:00 - 21:30',
                'jueves' => '14:00 - 21:30',
                'viernes' => '14:00 - 22:00',
                'sabado' => '14:00 - 22:00',
                'domingo' => '14:00 - 21:00',
            ],
            'google_rating' => 4.4,
            'social' => [
                'facebook' => '@pop.perote',
                'instagram' => '@pop_perote',
            ],
        ]);
    }
}
