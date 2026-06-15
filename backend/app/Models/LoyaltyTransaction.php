<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyTransaction extends Model
{
    use HasFactory;

    public const EXPIRATION_DAYS = 60;

    protected $fillable = [
        'user_id',
        'points',
        'concept',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->where('points', '<', 0)
                ->orWhere('created_at', '>=', now()->subDays(self::EXPIRATION_DAYS));
        });
    }

    public function scopeExpired($query)
    {
        return $query->where('points', '>', 0)
            ->where('created_at', '<', now()->subDays(self::EXPIRATION_DAYS));
    }

    public function isExpired(): bool
    {
        return $this->points > 0
            && $this->created_at->lt(now()->subDays(self::EXPIRATION_DAYS));
    }

    public function expiresAt(): ?\Illuminate\Support\Carbon
    {
        if ($this->points <= 0) {
            return null;
        }
        return $this->created_at->copy()->addDays(self::EXPIRATION_DAYS);
    }
}
