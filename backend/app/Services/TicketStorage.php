<?php

namespace App\Services;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;

class TicketStorage
{
    /**
     * Resuelve el disco donde vive un ticket: nuevos tickets se guardan en
     * 'local' (privado); tickets antiguos pueden seguir en 'public' hasta
     * que el comando tickets:migrate-to-private los mueva.
     */
    public static function diskFor(string $path): Filesystem
    {
        return Storage::disk(Storage::disk('local')->exists($path) ? 'local' : 'public');
    }
}
