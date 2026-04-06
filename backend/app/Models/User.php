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
        'tier',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'points' => 'integer',
    ];

    public function getTierAttribute(): string
    {
        $points = $this->points ?? 0;

        if ($points >= 3000) return 'elite';
        if ($points >= 1500) return 'vip';
        if ($points >= 500) return 'lover';
        return 'fan';
    }

    public function facturas()
    {
        return $this->hasMany(Factura::class);
    }

    public function mesero()
    {
        return $this->hasOne(Mesero::class);
    }
}
