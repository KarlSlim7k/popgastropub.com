<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeseroRating extends Model
{
    protected $fillable = ['user_id', 'mesero_id', 'rating', 'comentario'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mesero()
    {
        return $this->belongsTo(Mesero::class);
    }
}
