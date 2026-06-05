<?php

namespace App\Models;

use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Spatie\Activitylog\Models\Concerns\LogsActivity;
use Throwable;

class Promocion extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;

    public const FORM_FIELDS = ['nombre', 'telefono', 'email', 'mensaje'];

    protected $table = 'promociones';

    protected $fillable = [
        'titulo',
        'slug',
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
        'landing_enabled',
        'landing_title',
        'landing_subtitle',
        'landing_content',
        'landing_template',
        'seo_title',
        'seo_description',
        'og_image',
        'cta_primary_text',
        'cta_primary_url',
        'cta_secondary_text',
        'cta_secondary_url',
        'form_enabled',
        'form_fields',
        'views_count',
        'clicks_count',
        'leads_count',
        'published_at',
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
        'landing_enabled' => 'boolean',
        'form_enabled' => 'boolean',
        'form_fields' => 'array',
        'views_count' => 'integer',
        'clicks_count' => 'integer',
        'leads_count' => 'integer',
        'published_at' => 'datetime',
    ];

    public function leads()
    {
        return $this->hasMany(PromoLead::class);
    }

    public function events()
    {
        return $this->hasMany(PromoEvent::class);
    }

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

    public function hasValidDateWindow(): bool
    {
        if ($this->indefinida) return true;

        $start = $this->parseDate($this->dia_inicio);
        $end = $this->parseDate($this->dia_fin);

        return $start !== null && $end !== null && $end->greaterThanOrEqualTo($start);
    }

    public function isAvailableOn(CarbonInterface $date): bool
    {
        if (! $this->activa || ! $this->isWithinDateWindow($date)) return false;

        $days = $this->activeDays();
        $weekDays = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

        return $days === [] || in_array($weekDays[$date->dayOfWeek], $days, true);
    }

    public function hasPublicLanding(CarbonInterface $date): bool
    {
        return $this->landing_enabled
            && $this->published_at !== null
            && $this->activa
            && $this->estado === 'activa'
            && $this->hasValidDateWindow()
            && $this->isWithinDateWindow($date);
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
