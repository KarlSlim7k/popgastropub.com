<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StaffNotification extends Model
{
    protected $fillable = ['mesero_id', 'type', 'title', 'body', 'data', 'read_at'];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    public function mesero()
    {
        return $this->belongsTo(Mesero::class);
    }

    public static function notify(int $meseroId, string $type, string $title, string $body, ?array $data = null): self
    {
        return static::create(compact('meseroId', 'type', 'title', 'body', 'data'));
    }

    public static function send(int $meseroId, string $type, string $title, string $body, ?array $data = null): self
    {
        return static::create([
            'mesero_id' => $meseroId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ]);
    }
}
