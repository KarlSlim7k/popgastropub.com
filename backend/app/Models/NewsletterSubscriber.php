<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = ['user_id', 'email', 'name', 'source', 'unsubscribed_at'];

    protected $casts = [
        'unsubscribed_at' => 'datetime',
    ];

    public function user() { return $this->belongsTo(User::class); }
}
