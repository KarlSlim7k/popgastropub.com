<?php

namespace App\Models;

use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Throwable;

class Promocion extends Model
{
    use HasFactory;

    protected $table = 'promociones';

    protected $fillable = [
        'titulo',
        'descripcion',
        'tipo',
        'descuento',
        'precio_original',
        'precio_promo',
        'dia_inicio',
        'dia_fin',
        'dias_activos',
        'indefinida',
        'imagen',
        'activa',
        'estado',
        'redenciones',
        'meta',
        'ingresos',
    ];

    protected $casts = [
        'precio_original' => 'decimal:2',
        'precio_promo' => 'decimal:2',
        'ingresos' => 'decimal:2',
        'activa' => 'boolean',
        'indefinida' => 'boolean',
    ];

    public function activeDays(): array
    {
        $aliases = [
            'lun' => 'lunes', 'lunes' => 'lunes',
            'mar' => 'martes', 'martes' => 'martes',
            'mie' => 'miercoles', 'miercoles' => 'miercoles',
            'jue' => 'jueves', 'jueves' => 'jueves',
            'vie' => 'viernes', 'viernes' => 'viernes',
            'sab' => 'sabado', 'sabado' => 'sabado',
            'dom' => 'domingo', 'domingo' => 'domingo',
        ];

        return collect(explode(',', Str::ascii(strtolower($this->dias_activos ?? ''))))
            ->map(fn(string $day) => trim($day))
            ->map(fn(string $day) => $aliases[$day] ?? null)
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    public function isWithinDateWindow(CarbonInterface $date): bool
    {
        if ($this->indefinida) return true;

        $start = $this->parseDate($this->dia_inicio);
        $end = $this->parseDate($this->dia_fin);

        return (! $start || $date->greaterThanOrEqualTo($start))
            && (! $end || $date->lessThanOrEqualTo($end));
    }

    public function isAvailableOn(CarbonInterface $date): bool
    {
        if (! $this->activa || ! $this->isWithinDateWindow($date)) return false;

        $days = $this->activeDays();
        $weekDays = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

        return $days === [] || in_array($weekDays[$date->dayOfWeek], $days, true);
    }

    private function parseDate(?string $value): ?Carbon
    {
        if (! $value || ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) return null;

        try {
            return Carbon::createFromFormat('Y-m-d', $value)->startOfDay();
        } catch (Throwable) {
            return null;
        }
    }
}
