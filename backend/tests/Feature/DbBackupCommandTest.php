<?php

namespace Tests\Feature;

use App\Console\Commands\DbBackup;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use ReflectionMethod;
use Tests\TestCase;

class DbBackupCommandTest extends TestCase
{
    public function test_skips_when_default_connection_is_not_mysql(): void
    {
        // En testing DB_CONNECTION=sqlite (phpunit.xml).
        $exitCode = Artisan::call('db:backup');

        $this->assertSame(0, $exitCode);
        $this->assertStringContainsString('no es mysql/mariadb', Artisan::output());
    }

    public function test_fails_gracefully_and_cleans_up_when_mysql_unreachable(): void
    {
        config([
            'database.default' => 'mysql',
            'database.connections.mysql.host' => '127.0.0.1',
            'database.connections.mysql.port' => '1',
            'database.connections.mysql.username' => 'nope',
            'database.connections.mysql.password' => 'nope',
            'database.connections.mysql.database' => 'nope',
        ]);

        $directory = storage_path('app/backups');
        File::deleteDirectory($directory);

        $exitCode = Artisan::call('db:backup');

        $this->assertSame(1, $exitCode);
        $this->assertStringContainsString('Backup falló', Artisan::output());
        $this->assertEmpty(File::exists($directory) ? File::glob("{$directory}/*.sql.gz") : []);

        File::deleteDirectory($directory);
    }

    public function test_dump_command_disables_ssl(): void
    {
        $build = new ReflectionMethod(DbBackup::class, 'buildDumpCommand');
        $build->setAccessible(true);

        $command = $build->invoke(new DbBackup(), [
            'host' => '127.0.0.1',
            'port' => '3306',
            'username' => 'root',
            'password' => 'secret',
            'database' => 'pop_perote',
        ], '/tmp/pop_test.sql');

        $this->assertStringStartsWith('mariadb-dump --skip-ssl ', $command);
    }

    public function test_rotate_deletes_only_old_pop_backups(): void
    {
        $directory = storage_path('app/backups_rotate_test');
        File::ensureDirectoryExists($directory);

        $old = "{$directory}/pop_old.sql.gz";
        $recent = "{$directory}/pop_recent.sql.gz";
        $unrelated = "{$directory}/other.sql.gz";

        File::put($old, 'x');
        File::put($recent, 'x');
        File::put($unrelated, 'x');

        touch($old, now()->subDays(20)->getTimestamp());
        touch($recent, now()->subDays(5)->getTimestamp());
        touch($unrelated, now()->subDays(20)->getTimestamp());

        $rotate = new ReflectionMethod(DbBackup::class, 'rotate');
        $rotate->setAccessible(true);
        $deleted = $rotate->invoke(new DbBackup(), $directory, 14);

        $this->assertSame(1, $deleted);
        $this->assertFileDoesNotExist($old);
        $this->assertFileExists($recent);
        $this->assertFileExists($unrelated);

        File::deleteDirectory($directory);
    }
}
