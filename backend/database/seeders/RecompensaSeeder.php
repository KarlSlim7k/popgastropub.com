<?php

namespace Database\Seeders;

use App\Models\Recompensa;
use Illuminate\Database\Seeder;

class RecompensaSeeder extends Seeder
{
    public function run(): void
    {
        $recompensas = [
            ['nombre' => 'Bebida Gratis', 'descripcion' => 'Una bebida de cortesía en tu próxima visita (refresco, agua o limonada)', 'puntos_requeridos' => 100, 'categoria' => 'bebidas', 'tier' => 'fan'],
            ['nombre' => 'Roll POP Clásico', 'descripcion' => 'Un roll clásico gratis de nuestra selección del chef', 'puntos_requeridos' => 300, 'categoria' => 'comida', 'tier' => 'fan'],
            ['nombre' => 'Orden de Wings (6 pzas)', 'descripcion' => '6 wings con la salsa de tu elección totalmente gratis', 'puntos_requeridos' => 250, 'categoria' => 'comida', 'tier' => 'fan'],
            ['nombre' => 'Postre Crepa POP', 'descripcion' => 'Una crepa dulce de la casa con topping a elegir', 'puntos_requeridos' => 200, 'categoria' => 'postres', 'tier' => 'fan'],
            ['nombre' => 'Margarita de Cortesía', 'descripcion' => 'Margarita clásica o de sabor en tu próxima visita', 'puntos_requeridos' => 350, 'categoria' => 'bebidas', 'tier' => 'lover'],
            ['nombre' => 'Combo POP para 2', 'descripcion' => '2 rolls + 1 orden de boneless + 2 bebidas', 'puntos_requeridos' => 800, 'categoria' => 'combos', 'tier' => 'lover'],
            ['nombre' => '20% Descuento en Cuenta', 'descripcion' => '20% de descuento en tu cuenta total (máx $200 MXN)', 'puntos_requeridos' => 500, 'categoria' => 'descuentos', 'tier' => 'lover'],
            ['nombre' => 'Roll Premium Gratis', 'descripcion' => 'Cualquier roll premium de la carta sin costo', 'puntos_requeridos' => 600, 'categoria' => 'comida', 'tier' => 'vip'],
            ['nombre' => 'Botella de Vino', 'descripcion' => 'Botella de vino tinto o blanco de la casa', 'puntos_requeridos' => 1200, 'categoria' => 'bebidas', 'tier' => 'vip'],
            ['nombre' => 'Cena VIP para 2', 'descripcion' => 'Experiencia completa: entrada + 2 rolls premium + postre + 2 bebidas', 'puntos_requeridos' => 2000, 'categoria' => 'experiencias', 'tier' => 'elite'],
            ['nombre' => 'Fiesta POP (10 personas)', 'descripcion' => 'Reservación VIP + buffet de sushi para 10 personas', 'puntos_requeridos' => 5000, 'categoria' => 'experiencias', 'tier' => 'elite'],
            ['nombre' => 'Merchandise POP', 'descripcion' => 'Playera o gorra oficial POP Perote edición limitada', 'puntos_requeridos' => 400, 'categoria' => 'merchandise', 'tier' => 'fan'],
        ];

        foreach ($recompensas as $r) {
            Recompensa::create(array_merge($r, ['disponible' => true]));
        }
    }
}
