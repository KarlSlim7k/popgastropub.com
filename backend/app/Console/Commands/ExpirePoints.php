<?php

namespace App\Console\Commands;

use App\Models\LoyaltyTransaction;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpirePoints extends Command
{
    protected $signature = 'loyalty:expire-points
                            {--days=60 : Días después de obtenidos que un lote de puntos expira}
                            {--dry-run : Solo mostrar lotes a expirar sin registrar canjes}';

    protected $description = 'Expira lotes individuales de puntos positivos que tengan más de N días desde su created_at (FIFO).';

    public function handle(): int
    {
        $days = (int) $this->option('days');
        $dryRun = (bool) $this->option('dry-run');
        $cutoff = now()->subDays($days);

        $this->info("Buscando lotes positivos con created_at < {$cutoff->toDateTimeString()} (>{$days} días)...");

        $expiredLots = LoyaltyTransaction::query()
            ->where('points', '>', 0)
            ->where('created_at', '<', $cutoff)
            ->orderBy('user_id')
            ->orderBy('created_at')
            ->get();

        if ($expiredLots->isEmpty()) {
            $this->info('No hay lotes de puntos expirables.');
            return self::SUCCESS;
        }

        $this->info("Lotes positivos a expirar: {$expiredLots->count()}");

        $byUser = $expiredLots->groupBy('user_id');
        $totalUsers = $byUser->count();
        $totalPoints = (int) $expiredLots->sum('points');

        $this->info("Usuarios afectados: {$totalUsers} | Puntos a expirar: {$totalPoints}");

        if ($dryRun) {
            foreach ($byUser as $userId => $lots) {
                $user = User::find($userId);
                $email = $user?->email ?? "user#{$userId}";
                $sum = (int) $lots->sum('points');
                $this->line("  - {$email} (id={$userId}): {$sum} pts en {$lots->count()} lote(s)");
            }
            return self::SUCCESS;
        }

        $expiredUsers = 0;

        DB::transaction(function () use ($byUser, &$expiredUsers) {
            foreach ($byUser as $userId => $lots) {
                $user = User::whereKey($userId)->lockForUpdate()->first();
                if (! $user) continue;

                $sum = (int) $lots->sum('points');
                if ($sum <= 0) continue;

                $available = $this->calculateAvailableFromLots($user, $lots->pluck('id')->all());
                if ($available <= 0) continue;

                $deduct = min($available, $sum);
                $user->decrement('points', $deduct);
                $user->increment('points_expired_total', $deduct);

                LoyaltyTransaction::create([
                    'user_id' => $user->id,
                    'points' => -$deduct,
                    'concept' => "Expiración por antigüedad ({$deduct} pts · {$days} días)",
                ]);

                $expiredUsers++;
            }
        });

        Log::info('POP Points expiration (FIFO por lote)', [
            'days' => $days,
            'expired_users' => $expiredUsers,
            'total_lots' => $expiredLots->count(),
            'total_points' => $totalPoints,
        ]);

        $this->info("Listo: {$expiredUsers} usuario(s) afectado(s).");
        return self::SUCCESS;
    }

    /**
     * Calcula cuántos puntos de los lotes dados siguen disponibles
     * (no consumidos por canjes posteriores que no estén también expirados).
     */
    private function calculateAvailableFromLots(User $user, array $lotIds): int
    {
        $all = $user->loyaltyTransactions()->orderBy('created_at')->get(['id', 'points']);
        $positiveLots = [];
        $consumed = [];

        foreach ($all as $tx) {
            if ($tx->points > 0) {
                $positiveLots[$tx->id] = ['points' => $tx->points, 'consumed' => 0];
            } else {
                $abs = abs((int) $tx->points);
                $remaining = $abs;
                foreach ($positiveLots as $id => $lot) {
                    if ($remaining <= 0) break;
                    $available = $lot['points'] - $lot['consumed'];
                    if ($available <= 0) continue;
                    $consume = min($available, $remaining);
                    $positiveLots[$id]['consumed'] += $consume;
                    $remaining -= $consume;
                }
            }
        }

        $available = 0;
        foreach ($lotIds as $id) {
            if (! isset($positiveLots[$id])) continue;
            $available += $positiveLots[$id]['points'] - $positiveLots[$id]['consumed'];
        }
        return max(0, $available);
    }
}
