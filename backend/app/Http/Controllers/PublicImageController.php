<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class PublicImageController extends Controller
{
    public function show(string $path)
    {
        abort_unless(
            preg_match('#^(menu|promociones|recompensas)/[a-f0-9-]+\.(jpg|jpeg|png|webp|gif)$#i', $path),
            404
        );

        $disk = Storage::disk('public');
        abort_unless($disk->exists($path), 404);

        return response()->file($disk->path($path), [
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }
}
