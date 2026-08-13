<?php

namespace App\Services;

use App\Models\Mesero;
use App\Models\MeseroPointsLog;
use App\Models\StaffNotification;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class MeseroSaleApprovalService
{
    public function approve(MeseroPointsLog $sale, User $reviewer): MeseroPointsLog
    {
        return DB::transaction(function () use ($sale, $reviewer) {
            $lockedSale = MeseroPointsLog::whereKey($sale->id)->lockForUpdate()->firstOrFail();

            abort_unless($lockedSale->status === 'pending', 422, 'Esta venta ya fue revisada.');

            $mesero = Mesero::whereKey($lockedSale->mesero_id)->lockForUpdate()->firstOrFail();
            $previousPoints = (int) $mesero->puntos;
            $categoryField = $lockedSale->category.'_points';

            if (Schema::hasColumn('meseros', $categoryField)) {
                $mesero->increment($categoryField, $lockedSale->points);
            }

            $mesero->increment('puntos', $lockedSale->points);
            $mesero->increment('orders_served', $lockedSale->quantity);

            $lockedSale->update([
                'status' => 'approved',
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ]);

            $this->notifyTierCrossing($mesero->fresh(), $previousPoints);

            return $lockedSale->fresh(['mesero.user', 'reviewer']);
        });
    }

    public function reject(MeseroPointsLog $sale, User $reviewer): MeseroPointsLog
    {
        return DB::transaction(function () use ($sale, $reviewer) {
            $lockedSale = MeseroPointsLog::whereKey($sale->id)->lockForUpdate()->firstOrFail();

            abort_unless($lockedSale->status === 'pending', 422, 'Esta venta ya fue revisada.');

            $lockedSale->update([
                'status' => 'rejected',
                'reviewed_by' => $reviewer->id,
                'reviewed_at' => now(),
            ]);

            return $lockedSale->fresh(['mesero.user', 'reviewer']);
        });
    }

    private function notifyTierCrossing(Mesero $mesero, int $previousPoints): void
    {
        $thresholds = [5000 => 'Legend', 3000 => 'Master', 1500 => 'Pro', 500 => 'Rising'];

        foreach ($thresholds as $threshold => $tier) {
            if ($previousPoints < $threshold && $mesero->puntos >= $threshold) {
                StaffNotification::send(
                    $mesero->id,
                    'tier_up',
                    "¡Subiste a {$tier}!",
                    "Alcanzaste {$mesero->puntos} pts y desbloqueaste el nivel {$tier}. ¡Sigue así!",
                    ['tier' => $tier, 'points' => $mesero->puntos],
                );
                break;
            }
        }
    }
}
