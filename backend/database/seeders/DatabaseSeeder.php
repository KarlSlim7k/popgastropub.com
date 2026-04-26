<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Mesero;
use App\Models\Producto;
use App\Models\Promocion;
use App\Models\Recompensa;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin POP',
            'email' => 'admin@popgastropub.com',
            'password' => Hash::make('admin123456'),
            'role' => 'admin',
            'phone' => '282-825-32-43',
        ]);

        // Client user
        $client = User::create([
            'name' => 'Cliente Demo',
            'email' => 'cliente@demo.com',
            'password' => Hash::make('cliente123'),
            'role' => 'cliente',
            'points' => 750,
        ]);

        // Mesero user
        $meseroUser = User::create([
            'name' => 'Carlos Mesero',
            'email' => 'carlos@popgastropub.com',
            'password' => Hash::make('mesero123'),
            'role' => 'mesero',
        ]);

        Mesero::create([
            'user_id' => $meseroUser->id,
            'nombre' => 'Carlos',
            'puntos' => 350,
        ]);

        // Sample products
        $productos = [
            ['nombre' => 'Roll POP', 'descripcion' => 'Roll especial de la casa con camarín tempura y aguacate', 'precio' => 185.00, 'categoria' => 'rolls', 'destacado' => true],
            ['nombre' => 'California Roll', 'descripcion' => 'Cangrejo, aguacate y pepino', 'precio' => 120.00, 'categoria' => 'rolls'],
            ['nombre' => 'Dragon Roll', 'descripcion' => 'Anguila, aguacate y salsa unagi', 'precio' => 195.00, 'categoria' => 'rolls', 'destacado' => true],
            ['nombre' => 'Wings Clásicos', 'descripcion' => 'Alitas de pollo con salsa a elegir', 'precio' => 145.00, 'categoria' => 'wings'],
            ['nombre' => 'Wings BBQ', 'descripcion' => 'Alitas bañadas en salsa BBQ ahumada', 'precio' => 155.00, 'categoria' => 'wings'],
            ['nombre' => 'Boneless', 'descripcion' => 'Pechuga de pollo empanizada con salsa', 'precio' => 165.00, 'categoria' => 'boneless'],
            ['nombre' => 'Crepes Nutella', 'descripcion' => 'Crepes dulces con Nutella y frutas', 'precio' => 95.00, 'categoria' => 'crepes'],
            ['nombre' => 'Margarita Clásica', 'descripcion' => 'Tequila, triple sec y limón', 'precio' => 110.00, 'categoria' => 'bebidas'],
        ];

        foreach ($productos as $prod) {
            Producto::create($prod);
        }

        // Sample promotions
        Promocion::create([
            'titulo' => '2x1 en Rolls Seleccionados',
            'descripcion' => 'Todos los martes 2x1 en rolls seleccionados',
            'precio_original' => 185.00,
            'precio_promo' => 92.50,
            'dia_inicio' => 'martes',
            'dia_fin' => 'martes',
            'activa' => true,
        ]);

        Promocion::create([
            'titulo' => 'Combo Wings + Refresco',
            'descripcion' => 'Wings clásicos + refresco de 600ml',
            'precio_original' => 180.00,
            'precio_promo' => 149.00,
            'dia_inicio' => 'lunes',
            'dia_fin' => 'jueves',
            'activa' => true,
        ]);

        $recompensas = [
            ['nombre' => 'Refresco o Agua del Día', 'descripcion' => 'Bebida de tu elección', 'puntos_requeridos' => 150, 'disponible' => true],
            ['nombre' => 'Orden de Papas Gajo', 'descripcion' => 'Papas gajo sazonadas', 'puntos_requeridos' => 350, 'disponible' => true],
            ['nombre' => 'Roll California (10 pzas)', 'descripcion' => 'Sushi clásico', 'puntos_requeridos' => 500, 'disponible' => true],
            ['nombre' => '10 Alitas (Cualquier Salsa)', 'descripcion' => 'Alitas POP', 'puntos_requeridos' => 750, 'disponible' => true],
            ['nombre' => 'Jarra de Clericot (1.5L)', 'descripcion' => 'Clericot de la casa', 'puntos_requeridos' => 1200, 'disponible' => true],
            ['nombre' => 'Cena Completa (2 Personas)', 'descripcion' => 'Experiencia gastronómica', 'puntos_requeridos' => 2500, 'disponible' => true],
        ];
        foreach ($recompensas as $r) {
            Recompensa::create($r);
        }

        $this->call([
            ProductoSeeder::class,
        ]);
    }
}
