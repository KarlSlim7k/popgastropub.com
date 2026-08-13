<?php

namespace App\Console\Commands;

use App\Models\LoyaltyTransaction;
use App\Models\User;
use App\Services\LoyaltyConfig;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AwardBirthdayPoints extends Command
{
    protected $signature = 'loyalty:award-birthday-points {--date= : Fecha YYYY-MM-DD para pruebas}';

    protected $description = 'Otorga una sola vez por año el bono de cumpleaños a clientes elegibles.';

    public function handle(): int
    {
        $date = $this->option('date') ? Carbon::parse($this->option('date')) : today();
        $concept = 'Bono de cumpleaños '.$date->year;
        $bonus = (int) LoyaltyConfig::get('birthday_bonus');
        $awarded = 0;

        User::query()
            ->where('role', 'cliente')
            ->where(fn ($query) => $query->whereNull('status')->orWhere('status', '!=', 'inactivo'))
            ->whereNotNull('birth_date')
            ->whereMonth('birth_date', $date->month)
            ->whereDay('birth_date', $date->day)
            ->eachById(function (User $candidate) use ($concept, $bonus, &$awarded) {
                DB::transaction(function () use ($candidate, $concept, $bonus, &$awarded) {
                    $user = User::whereKey($candidate->id)->lockForUpdate()->firstOrFail();
                    $alreadyAwarded = LoyaltyTransaction::where('user_id', $user->id)
                        ->where('concept', $concept)
                        ->exists();

                    if ($alreadyAwarded) {
                        return;
                    }

                    $user->increment('points', $bonus);
                    LoyaltyTransaction::create([
                        'user_id' => $user->id,
                        'points' => $bonus,
                        'concept' => $concept,
                    ]);
                    $awarded++;
                });
            });

        $this->info("Bonos de cumpleaños otorgados: {$awarded}");

        return self::SUCCESS;
    }
}
