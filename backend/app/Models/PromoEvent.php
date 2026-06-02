<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PromoEvent extends Model
{
    public const VIEW = 'view';
    public const CTA_PRIMARY_CLICK = 'cta_primary_click';
    public const CTA_SECONDARY_CLICK = 'cta_secondary_click';
    public const LEAD = 'lead';

    public $timestamps = false;

    protected $fillable = [
        'promocion_id',
        'event_type',
        'ip_hash',
        'user_agent',
        'referrer',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function promocion()
    {
        return $this->belongsTo(Promocion::class);
    }
}
