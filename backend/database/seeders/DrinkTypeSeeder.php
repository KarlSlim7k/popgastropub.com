<?php

namespace Database\Seeders;

use App\Models\DrinkType;
use Illuminate\Database\Seeder;

class DrinkTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            ['slug' => 'cocktail', 'label' => 'Cóctel / Margarita', 'points' => 10, 'icon' => 'local_bar', 'sort_order' => 1],
            ['slug' => 'premium', 'label' => 'Bebida Premium', 'points' => 15, 'icon' => 'wine_bar', 'sort_order' => 2],
            ['slug' => 'pitcher', 'label' => 'Jarra / Compartida', 'points' => 25, 'icon' => 'sports_bar', 'sort_order' => 3],
            ['slug' => 'bottle', 'label' => 'Botella Completa', 'points' => 50, 'icon' => 'local_drink', 'sort_order' => 4],
            ['slug' => 'combo', 'label' => 'Combo Comida + Bebida', 'points' => 20, 'icon' => 'restaurant', 'sort_order' => 5],
            ['slug' => 'upsell', 'label' => 'Upselling (Upgrade)', 'points' => 15, 'icon' => 'trending_up', 'sort_order' => 6],
        ];

        foreach ($types as $type) {
            DrinkType::updateOrCreate(
                ['slug' => $type['slug']],
                $type
            );
        }
    }
}
