<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

class DbBackup extends Command
{
    protected $signature = 'db:backup
                            {--keep-days=14 : Días de retención de backups locales}';

    protected $description = 'Genera un dump comprimido (mariadb-dump + gzip) de la base de datos y rota backups antiguos.';

    public function handle(): int
    {
        $connectionName = config('database.default');
        $connection = config("database.connections.{$connectionName}");

        if (($connection['driver'] ?? null) !== 'mysql') {
            $this->warn("Conexión '{$connectionName}' no es mysql/mariadb, nada que respaldar.");

            return self::SUCCESS;
        }

        $directory = storage_path('app/backups');
        File::ensureDirectoryExists($directory);

        $sqlPath = $directory.'/pop_'.now()->format('Ymd_His').'.sql';
        $gzPath = $sqlPath.'.gz';

        $dumpCommand = $this->buildDumpCommand($connection, $sqlPath);

        $dump = Process::fromShellCommandline($dumpCommand);
        $dump->setTimeout(300);
        $dump->run();

        if (!$dump->isSuccessful() || !File::exists($sqlPath) || File::size($sqlPath) === 0) {
            File::delete($sqlPath);
            $this->error('Backup falló: '.trim($dump->getErrorOutput()));

            return self::FAILURE;
        }

        $gzip = new Process(['gzip', '-f', $sqlPath]);
        $gzip->run();

        if (!$gzip->isSuccessful() || !File::exists($gzPath)) {
            File::delete($sqlPath);
            $this->error('Backup falló al comprimir: '.trim($gzip->getErrorOutput()));

            return self::FAILURE;
        }

        $this->info("Backup creado: {$gzPath} (".$this->humanSize(File::size($gzPath)).')');

        $deleted = $this->rotate($directory, (int) $this->option('keep-days'));

        if ($deleted > 0) {
            $this->info("Backups antiguos eliminados (> {$this->option('keep-days')} días): {$deleted}");
        }

        return self::SUCCESS;
    }

    private function buildDumpCommand(array $connection, string $sqlPath): string
    {
        // --skip-ssl: la conexión es interna (red docker pop_network) y el
        // servidor MariaDB no tiene TLS habilitado. mariadb-dump >= 10.11
        // intenta SSL por defecto y falla con "SSL is required, but the
        // server does not support it" si no se desactiva explícitamente.
        return sprintf(
            'mariadb-dump --skip-ssl -h%s -P%s -u%s -p%s %s > %s',
            escapeshellarg((string) $connection['host']),
            escapeshellarg((string) $connection['port']),
            escapeshellarg((string) $connection['username']),
            escapeshellarg((string) $connection['password']),
            escapeshellarg((string) $connection['database']),
            escapeshellarg($sqlPath)
        );
    }

    private function rotate(string $directory, int $keepDays): int
    {
        $cutoff = now()->subDays($keepDays);
        $deleted = 0;

        foreach (File::files($directory) as $file) {
            if ($file->getExtension() !== 'gz' || !str_starts_with($file->getFilename(), 'pop_')) {
                continue;
            }

            if (Carbon::createFromTimestamp($file->getMTime())->lt($cutoff)) {
                File::delete($file->getPathname());
                $deleted++;
            }
        }

        return $deleted;
    }

    private function humanSize(int $bytes): string
    {
        return $bytes >= 1048576
            ? round($bytes / 1048576, 2).' MB'
            : round($bytes / 1024, 2).' KB';
    }
}
