<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Mesero;
use App\Models\Producto;
use App\Models\Promocion;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin user
        User::create([
            'name' => 'Admin POP',
            'email' => 'admin@pop-perote.com',
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
            'email' => 'carlos@pop-perote.com',
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
    }
}
