<?php

namespace Database\Seeders;

use App\Models\Mesero;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MeseroSeeder extends Seeder
{
    public function run(): void
    {
        $meseros = [
            ['name' => 'Ricardo Garcia', 'initials' => 'RG', 'cocktail' => 120, 'premium' => 85, 'pitcher' => 50, 'bottle' => 30, 'combo' => 60, 'upsell' => 45, 'rating' => 90, 'orders' => 142, 'sales' => 28500, 'rating_avg' => 4.9],
            ['name' => 'Sofia Lopez', 'initials' => 'SL', 'cocktail' => 95, 'premium' => 70, 'pitcher' => 40, 'bottle' => 25, 'combo' => 55, 'upsell' => 35, 'rating' => 75, 'orders' => 128, 'sales' => 24200, 'rating_avg' => 4.8],
            ['name' => 'Marco Alvarez', 'initials' => 'MA', 'cocktail' => 80, 'premium' => 60, 'pitcher' => 35, 'bottle' => 20, 'combo' => 45, 'upsell' => 30, 'rating' => 60, 'orders' => 115, 'sales' => 21000, 'rating_avg' => 4.7],
            ['name' => 'Diana Torres', 'initials' => 'DT', 'cocktail' => 65, 'premium' => 50, 'pitcher' => 25, 'bottle' => 15, 'combo' => 35, 'upsell' => 25, 'rating' => 50, 'orders' => 98, 'sales' => 18500, 'rating_avg' => 4.6],
            ['name' => 'Carlos Mendoza', 'initials' => 'CM', 'cocktail' => 50, 'premium' => 40, 'pitcher' => 20, 'bottle' => 10, 'combo' => 30, 'upsell' => 20, 'rating' => 40, 'orders' => 85, 'sales' => 15800, 'rating_avg' => 4.5],
        ];

        foreach ($meseros as $data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => strtolower(str_replace(' ', '.', $data['name'])) . '@popgastropub.com',
                'password' => Hash::make('PopPerote2026!'),
                'role' => 'mesero',
                'phone' => '228' . rand(1000000, 9999999),
                'status' => 'activo',
            ]);

            $names = explode(' ', $data['name']);
            Mesero::create([
                'user_id' => $user->id,
                'nombre' => $data['name'],
                'iniciales' => $data['initials'],
                'puntos' => $data['cocktail'] + $data['premium'] + $data['pitcher'] + $data['bottle'] + $data['combo'] + $data['upsell'] + $data['rating'],
                'cocktail_points' => $data['cocktail'],
                'premium_points' => $data['premium'],
                'pitcher_points' => $data['pitcher'],
                'bottle_points' => $data['bottle'],
                'combo_points' => $data['combo'],
                'upsell_points' => $data['upsell'],
                'rating_points' => $data['rating'],
                'total_sales' => $data['sales'],
                'orders_served' => $data['orders'],
                'avg_rating' => $data['rating_avg'],
                'activo' => true,
                'status' => 'activo',
            ]);
        }
    }
}
