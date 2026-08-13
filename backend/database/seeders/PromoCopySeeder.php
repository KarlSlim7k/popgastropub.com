<?php

namespace Database\Seeders;

use App\Models\Promocion;
use Illuminate\Database\Seeder;

class PromoCopySeeder extends Seeder
{
    public function run(): void
    {
        $promos = [
            [
                'titulo' => 'Tu cumple, nuestra fiesta',
                'slug' => 'cumpleanos-pop',
                'descripcion' => 'Postre de cortesía + puntos dobles POP en tu mes de cumpleaños.',
                'tipo' => 'regalo',
                'descuento' => 'PUNTOS X2',
                'indefinida' => true,
                'landing_enabled' => false,
                'landing_title' => 'SE FESTEJA EN POP',
                'landing_subtitle' => 'Postre de cortesía y puntos dobles con tu tarjeta POP durante tu mes de cumpleaños.',
                'landing_content' => "No hay pretexto pa' no venir. Regístrate al club de cumpleaños, muestra tu identificación en mesa y llévate un postre de cortesía + el doble de puntos POP en toda tu cuenta.",
                'landing_template' => 'editorial',
                'seo_title' => 'Club de Cumpleaños POP Perote | Postre gratis + puntos dobles',
                'cta_primary_text' => 'Unirme al club',
                'cta_primary_url' => '/perfil',
                'cta_secondary_text' => 'Conocer POP Points',
                'cta_secondary_url' => '/pop-points',
                'activa' => false,
                'estado' => 'pausada',
            ],
            [
                'titulo' => 'Domingo en Familia',
                'slug' => 'domingo-en-familia',
                'descripcion' => 'Menú infantil gratis por cada 2 platillos de adulto. Solo domingos.',
                'tipo' => 'combo',
                'descuento' => 'NIÑOS GRATIS',
                'dias_activos' => 'domingo',
                'landing_enabled' => false,
                'landing_title' => 'DOMINGO SE COME EN FAMILIA',
                'landing_subtitle' => 'Menú infantil gratis por cada 2 platillos de adulto, todos los domingos.',
                'landing_content' => 'Trae a los peques. Por cada 2 platillos fuertes de adulto que ordenes, el menú infantil va por nuestra cuenta. Ambiente relajado, terraza abierta, POP en modo familia.',
                'landing_template' => 'editorial',
                'cta_primary_text' => 'Ver menú familiar',
                'cta_primary_url' => '/menu',
                'cta_secondary_text' => 'Reservar mesa',
                'cta_secondary_url' => '/reservas',
                'activa' => false,
                'estado' => 'pausada',
            ],
            [
                'titulo' => 'Nuevo en la carta',
                'slug' => 'nuevo-en-la-carta',
                'descripcion' => 'Prueba primero el platillo que todos van a pedir.',
                'tipo' => 'especial',
                'landing_enabled' => false,
                'landing_title' => 'LO NUEVO YA LLEGÓ',
                'landing_subtitle' => 'Antes de que se corra la voz, pruébalo tú primero.',
                'landing_content' => 'Cada temporada metemos algo nuevo a la carta. Esta vez [nombre platillo] — [ingrediente/técnica destacada]. Disponible por tiempo limitado en sucursal.',
                'landing_template' => 'editorial',
                'cta_primary_text' => 'Ordenar ahora',
                'cta_primary_url' => '/menu',
                'cta_secondary_text' => 'Ver ubicación',
                'cta_secondary_url' => '/ubicacion',
                'activa' => false,
                'estado' => 'pausada',
            ],
        ];

        foreach ($promos as $promo) {
            Promocion::firstOrCreate(['slug' => $promo['slug']], $promo);
        }
    }
}
