<?php

namespace Tests\Feature;

use App\Models\Producto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicMenuTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_menu_only_exposes_beverages_and_bar_products(): void
    {
        Producto::create([
            'nombre' => 'Margarita POP',
            'descripcion' => 'Bebida de prueba',
            'precio' => 95,
            'categoria' => 'MIXOLOGIA',
            'disponible' => true,
        ]);
        Producto::create([
            'nombre' => 'Botella de vino',
            'descripcion' => 'Botella de prueba',
            'precio' => 350,
            'categoria' => 'MENÚ DEL BAR',
            'disponible' => true,
        ]);
        Producto::create([
            'nombre' => 'Rollo legado',
            'descripcion' => 'No pertenece al catálogo POP de bebidas',
            'precio' => 100,
            'categoria' => 'Sushi clásico',
            'disponible' => true,
        ]);

        $this->getJson('/api/menu')
            ->assertOk()
            ->assertJsonCount(2)
            ->assertJsonFragment(['nombre' => 'Margarita POP'])
            ->assertJsonFragment(['nombre' => 'Botella de vino'])
            ->assertJsonMissing(['nombre' => 'Rollo legado']);
    }
}
