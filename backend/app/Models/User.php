<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Spatie\Activitylog\Support\LogOptions;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, LogsActivity, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'birth_date',
        'points',
        'status',
        'rfc',
        'last_visit',
        'orders_count',
        'total_spent',
        'referral_code',
        'newsletter_subscribed',
        'newsletter_subscribed_at',
        'email_verified_at',
        'oauth_provider',
        'oauth_provider_id',
        'avatar_url',
        'two_factor_secret',
        'two_factor_enabled',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'role', 'status', 'points', 'rfc'])
            ->logOnlyDirty()
            ->dontLogEmptyChanges();
    }

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_visit' => 'datetime',
        'last_activity' => 'datetime',
        'password' => 'hashed',
        'points' => 'integer',
        'points_expired_total' => 'integer',
        'orders_count' => 'integer',
        'total_spent' => 'decimal:2',
        'newsletter_subscribed' => 'boolean',
        'newsletter_subscribed_at' => 'datetime',
        'birth_date' => 'date:Y-m-d',
    ];

    protected $appends = [
        'tier',
    ];

    public function getTierAttribute(): string
    {
        $points = (int) ($this->points ?? 0);

        return LoyaltyTier::resolveSlugForPoints($points);
    }

    /**
     * Saldo real de puntos no expirados (FIFO por lote created_at).
     * Un lote positivo (puntos ganados) expira EXPIRATION_DAYS después de su created_at.
     * Los lotes negativos (canjes) consumen de los positivos más antiguos primero.
     */
    public function getNonExpiredPointsAttribute(): int
    {
        $all = $this->loyaltyTransactions()->notExpired()->orderBy('created_at')->get(['points']);
        $balance = 0;
        $positiveLots = [];

        foreach ($all as $tx) {
            if ($tx->points > 0) {
                $balance += $tx->points;
                $positiveLots[] = ['points' => $tx->points, 'consumed' => 0];
            } else {
                $abs = abs((int) $tx->points);
                $remaining = $abs;
                foreach ($positiveLots as $i => $lot) {
                    if ($remaining <= 0) {
                        break;
                    }
                    $available = $lot['points'] - $lot['consumed'];
                    if ($available <= 0) {
                        continue;
                    }
                    $consume = min($available, $remaining);
                    $positiveLots[$i]['consumed'] += $consume;
                    $remaining -= $consume;
                }
            }
        }

        $consumedFromUnExpired = 0;
        foreach ($positiveLots as $lot) {
            $consumedFromUnExpired += $lot['consumed'];
        }

        return $balance;
    }

    public function getPointsBreakdownAttribute(): array
    {
        $all = $this->loyaltyTransactions()->orderBy('created_at')->get();
        $balance = 0;
        $positiveLots = [];
        $expiredTotal = 0;
        $expirationDays = LoyaltyTransaction::EXPIRATION_DAYS;
        $now = now();

        foreach ($all as $tx) {
            if ($tx->points > 0) {
                $isExpired = $tx->created_at->lt($now->copy()->subDays($expirationDays));
                if ($isExpired) {
                    $expiredTotal += $tx->points;

                    continue;
                }
                $balance += $tx->points;
                $positiveLots[] = ['points' => $tx->points, 'consumed' => 0];
            } else {
                $abs = abs((int) $tx->points);
                $remaining = $abs;
                foreach ($positiveLots as $i => $lot) {
                    if ($remaining <= 0) {
                        break;
                    }
                    $available = $lot['points'] - $lot['consumed'];
                    if ($available <= 0) {
                        continue;
                    }
                    $consume = min($available, $remaining);
                    $positiveLots[$i]['consumed'] += $consume;
                    $remaining -= $consume;
                }
            }
        }

        $consumed = 0;
        foreach ($positiveLots as $lot) {
            $consumed += $lot['consumed'];
        }

        $available = $balance - $consumed;

        return [
            'total' => $available,
            'expired_total' => $expiredTotal,
            'expiration_days' => $expirationDays,
        ];
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }

    public function redemptions()
    {
        return $this->hasMany(RewardRedemption::class);
    }

    public function facturas()
    {
        return $this->hasMany(Factura::class);
    }

    public function loyaltyTransactions()
    {
        return $this->hasMany(LoyaltyTransaction::class);
    }

    public function mesero()
    {
        return $this->hasOne(Mesero::class);
    }
}
