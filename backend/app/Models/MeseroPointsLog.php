<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeseroPointsLog extends Model
{
    protected $table = 'mesero_points_log';

    protected $fillable = [
        'mesero_id',
        'category',
        'quantity',
        'points',
        'multiplier',
        'status',
        'submitted_by',
        'reviewed_by',
        'reviewed_at',
        'description',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'points' => 'integer',
        'multiplier' => 'decimal:1',
        'reviewed_at' => 'datetime',
    ];

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function mesero()
    {
        return $this->belongsTo(Mesero::class);
    }

    public function submitter()
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
