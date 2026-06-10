<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigrateTicketsToPrivateDisk extends Command
{
    protected $signature = 'tickets:migrate-to-private';

    protected $description = 'Mueve storage/app/public/tickets/** al disco privado (local). Idempotente.';

    public function handle(): int
    {
        $public = Storage::disk('public');
        $local = Storage::disk('local');

        $files = $public->allFiles('tickets');

        if (empty($files)) {
            $this->info('No hay archivos en tickets/ del disco public.');

            return self::SUCCESS;
        }

        $moved = 0;
        foreach ($files as $path) {
            if ($local->exists($path)) {
                $public->delete($path);
                continue;
            }

            $stream = $public->readStream($path);
            $local->put($path, $stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
            $public->delete($path);
            $moved++;
        }

        $this->info("{$moved} archivo(s) movido(s) a disco privado (de " . count($files) . ' encontrados).');

        return self::SUCCESS;
    }
}
