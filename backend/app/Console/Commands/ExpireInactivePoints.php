<?php

namespace App\Console\Commands;

use App\Models\LoyaltyTransaction;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExpireInactivePoints extends Command
{
    protected $signature = 'loyalty:expire-inactive-points
                            {--months=2 : Meses de inactividad para expirar}
                            {--dry-run : Solo mostrar usuarios afectados sin expirar}';

    protected $description = 'Expira los POP Points de usuarios que no han tenido actividad en el periodo configurado.';

    public function handle(): int
    {
        $months = (int) $this->option('months');
        $dryRun = (bool) $this->option('dry-run');
        $cutoff = Carbon::now()->subMonths($months);

        $this->info("Buscando usuarios sin actividad desde {$cutoff->toDateTimeString()}...");

        $candidates = User::query()
            ->where('role', 'cliente')
            ->where('points', '>', 0)
            ->where(function ($q) use ($cutoff) {
                $q->whereNull('last_activity')->where('created_at', '<', $cutoff);
            })
            ->orWhere(function ($q) use ($cutoff) {
                $q->where('role', 'cliente')
                    ->where('points', '>', 0)
                    ->where('last_activity', '<', $cutoff);
            })
            ->get();

        if ($candidates->isEmpty()) {
            $this->info('No hay usuarios con puntos expirables.');
            return self::SUCCESS;
        }

        $this->info("Usuarios con puntos a expirar: {$candidates->count()}");

        if ($dryRun) {
            foreach ($candidates as $user) {
                $this->line("  - User #{$user->id} ({$user->email}): {$user->points} pts, último: " . ($user->last_activity?->toDateTimeString() ?? 'nunca'));
            }
            return self::SUCCESS;
        }

        $expiredCount = 0;
        $totalPointsExpired = 0;

        foreach ($candidates as $user) {
            DB::transaction(function () use ($user, &$expiredCount, &$totalPointsExpired) {
                $locked = User::whereKey($user->id)->lockForUpdate()->firstOrFail();
                $pointsToExpire = (int) $locked->points;

                if ($pointsToExpire <= 0) {
                    return;
                }

                LoyaltyTransaction::create([
                    'user_id' => $locked->id,
                    'points' => -$pointsToExpire,
                    'concept' => "Expiración por inactividad ({$pointsToExpire} pts)",
                ]);

                $locked->points = 0;
                $locked->points_expired_total = (int) $locked->points_expired_total + $pointsToExpire;
                $locked->save();

                $expiredCount++;
                $totalPointsExpired += $pointsToExpire;
            });
        }

        Log::info('POP Points expiration', [
            'expired_users' => $expiredCount,
            'total_points_expired' => $totalPointsExpired,
            'cutoff' => $cutoff->toDateTimeString(),
        ]);

        $this->info("Listo: {$expiredCount} usuario(s) expirado(s), {$totalPointsExpired} pts removidos.");
        return self::SUCCESS;
    }
}
