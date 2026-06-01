<?php

namespace App\Console\Commands;

use App\Models\Mesero;
use App\Models\RankingPeriod;
use App\Models\RankingSnapshot;
use App\Models\StaffNotification;
use Illuminate\Console\Command;

class RotateRankingPeriod extends Command
{
    protected $signature = 'ranking:rotate {type=monthly}';
    protected $description = 'Close current ranking period, snapshot scores, and reset points';

    public function handle(): int
    {
        $type = $this->argument('type');
        $now = now();

        // Close current active period
        $current = RankingPeriod::current($type);
        if ($current) {
            $current->update(['active' => false, 'end_date' => $now->toDateString()]);
        }

        // Snapshot all active meseros
        $meseros = Mesero::where('activo', true)->orderByDesc('puntos')->get();
        $periodForSnapshot = $current;

        if (!$periodForSnapshot) {
            // Create a retroactive period if none existed
            $periodForSnapshot = RankingPeriod::create([
                'type' => $type,
                'start_date' => $now->copy()->startOfMonth()->toDateString(),
                'end_date' => $now->toDateString(),
                'active' => false,
            ]);
        }

        foreach ($meseros as $pos => $mesero) {
            $tier = 'Rookie';
            if ($mesero->puntos >= 5000) $tier = 'Legend';
            elseif ($mesero->puntos >= 3000) $tier = 'Master';
            elseif ($mesero->puntos >= 1500) $tier = 'Pro';
            elseif ($mesero->puntos >= 500) $tier = 'Rising';

            RankingSnapshot::create([
                'period_id' => $periodForSnapshot->id,
                'mesero_id' => $mesero->id,
                'puntos' => $mesero->puntos,
                'position' => $pos + 1,
                'tier' => $tier,
            ]);

            StaffNotification::send(
                $mesero->id,
                'period_end',
                '¡Periodo finalizado!',
                "Terminaste en posición #{$pos + 1} con {$mesero->puntos} pts. ¡Nuevo periodo iniciado!",
                ['position' => $pos + 1, 'puntos' => $mesero->puntos, 'tier' => $tier]
            );
        }

        // Reset points for new period
        Mesero::where('activo', true)->update([
            'puntos' => 0,
            'cocktail_points' => 0,
            'premium_points' => 0,
            'pitcher_points' => 0,
            'bottle_points' => 0,
            'combo_points' => 0,
            'upsell_points' => 0,
            'rating_points' => 0,
        ]);

        // Create new period
        $startDate = $now->toDateString();
        $endDate = $type === 'monthly'
            ? $now->copy()->endOfMonth()->toDateString()
            : $now->copy()->addWeek()->toDateString();

        RankingPeriod::create([
            'type' => $type,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'active' => true,
        ]);

        $this->info("Ranking period rotated. {$meseros->count()} meseros snapshotted and reset.");
        return Command::SUCCESS;
    }
}
