<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'points',
        'status',
        'rfc',
        'last_visit',
        'orders_count',
        'total_spent',
        'referral_code',
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

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_visit' => 'datetime',
        'last_activity' => 'datetime',
        'password' => 'hashed',
        'points' => 'integer',
        'points_expired_total' => 'integer',
        'orders_count' => 'integer',
        'total_spent' => 'decimal:2',
    ];

    protected $appends = [
        'tier',
    ];

    public function getTierAttribute(): string
    {
        $points = $this->points ?? 0;

        if ($points >= \App\Services\LoyaltyConfig::tierMin('elite')) return 'elite';
        if ($points >= \App\Services\LoyaltyConfig::tierMin('vip'))   return 'vip';
        if ($points >= \App\Services\LoyaltyConfig::tierMin('lover')) return 'lover';
        return 'fan';
    }

    public function reservas()
    {
        return $this->hasMany(Reserva::class);
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
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
