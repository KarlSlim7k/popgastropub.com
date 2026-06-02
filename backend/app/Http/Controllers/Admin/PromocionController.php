<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promocion;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PromocionController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 20), 100);

        if ($request->boolean('all')) {
            return response()->json(Promocion::orderBy('created_at', 'desc')->get()->map(fn($p) => $this->toFrontend($p)));
        }

        $query = Promocion::orderBy('created_at', 'desc');
        if ($request->input('estado')) $query->where('estado', $request->input('estado'));

        $paginated = $query->paginate($perPage);

        return response()->json([
            'data' => $paginated->map(fn($p) => $this->toFrontend($p)),
            'meta' => ['current_page' => $paginated->currentPage(), 'last_page' => $paginated->lastPage(), 'total' => $paginated->total()],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate($this->rules($request));

        $attributes = $this->fromFrontend($request);
        $this->validateSanitizedName($attributes);
        $attributes['slug'] ??= $this->uniqueSlug((string) $attributes['titulo']);

        $promo = Promocion::create($attributes);

        return response()->json($this->toFrontend($promo), 201);
    }

    public function show($id)
    {
        return response()->json($this->toFrontend(Promocion::findOrFail($id)));
    }

    public function update(Request $request, $id)
    {
        $promo = Promocion::findOrFail($id);
        $request->validate($this->rules($request, false, (int) $promo->id));

        $attributes = $this->fromFrontend($request);
        $this->validateSanitizedName($attributes);
        if (($attributes['landing_enabled'] ?? $promo->landing_enabled) && ! ($attributes['slug'] ?? $promo->slug)) {
            $attributes['slug'] = $this->uniqueSlug((string) ($attributes['titulo'] ?? $promo->titulo), (int) $promo->id);
        }
        $promo->update($attributes);

        return response()->json($this->toFrontend($promo->fresh()));
    }

    public function destroy($id)
    {
        Promocion::findOrFail($id)->delete();

        return response()->json(['message' => 'Promoción eliminada']);
    }

    public function publish($id)
    {
        $promo = Promocion::findOrFail($id);

        if (! $promo->landing_enabled) {
            throw ValidationException::withMessages([
                'landingEnabled' => 'Activa la landing pública antes de publicarla.',
            ]);
        }

        if (! $promo->slug || ! preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $promo->slug)) {
            throw ValidationException::withMessages([
                'slug' => 'La promoción necesita un slug válido antes de publicarse.',
            ]);
        }

        if (! $promo->activa || $promo->estado !== 'activa') {
            throw ValidationException::withMessages([
                'status' => 'Solo se pueden publicar promociones activas.',
            ]);
        }

        if (! $promo->hasValidDateWindow()) {
            throw ValidationException::withMessages([
                'startDate' => 'La promoción necesita una vigencia válida antes de publicarse.',
            ]);
        }

        $promo->update(['published_at' => now()]);

        return response()->json($this->toFrontend($promo->fresh()));
    }

    public function unpublish($id)
    {
        $promo = Promocion::findOrFail($id);
        $promo->update(['published_at' => null]);

        return response()->json($this->toFrontend($promo->fresh()));
    }

    public function metrics($id)
    {
        $promo = Promocion::findOrFail($id);
        $events = $promo->events()
            ->select('event_type', DB::raw('COUNT(*) as total'))
            ->groupBy('event_type')
            ->pluck('total', 'event_type');

        return response()->json([
            'viewsCount' => (int) $promo->views_count,
            'clicksCount' => (int) $promo->clicks_count,
            'leadsCount' => (int) $promo->leads_count,
            'clickThroughRate' => $this->percentage((int) $promo->clicks_count, (int) $promo->views_count),
            'leadConversionRate' => $this->percentage((int) $promo->leads_count, (int) $promo->views_count),
            'events' => [
                'views' => (int) ($events['view'] ?? 0),
                'primaryClicks' => (int) ($events['cta_primary_click'] ?? 0),
                'secondaryClicks' => (int) ($events['cta_secondary_click'] ?? 0),
                'leads' => (int) ($events['lead'] ?? 0),
            ],
        ]);
    }

    public function leads(Request $request, $id)
    {
        $promo = Promocion::findOrFail($id);
        $perPage = min(max((int) $request->input('per_page', 25), 1), 100);
        $leads = $promo->leads()->latest()->paginate($perPage);

        return response()->json([
            'data' => $leads->items(),
            'meta' => [
                'current_page' => $leads->currentPage(),
                'last_page' => $leads->lastPage(),
                'total' => $leads->total(),
            ],
        ]);
    }

    public function leadsCsv($id)
    {
        $promo = Promocion::findOrFail($id);
        $filename = 'leads-' . ($promo->slug ?: $promo->id) . '.csv';

        return response()->streamDownload(function () use ($promo): void {
            $output = fopen('php://output', 'w');
            fputcsv($output, ['Fecha', 'Nombre', 'Teléfono', 'Email', 'Mensaje', 'Origen']);

            $promo->leads()->latest()->chunk(500, function ($leads) use ($output): void {
                foreach ($leads as $lead) {
                    fputcsv($output, array_map([$this, 'csvSafe'], [
                        $lead->created_at?->toIso8601String(),
                        $lead->nombre,
                        $lead->telefono,
                        $lead->email,
                        $lead->mensaje,
                        $lead->origen,
                    ]));
                }
            });

            fclose($output);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function rules(Request $request, bool $creating = true, ?int $id = null): array
    {
        $formEnabled = $request->boolean('formEnabled');

        return [
            'name' => ($creating ? 'required' : 'sometimes') . '|string|max:255',
            'description' => 'nullable|string',
            'type' => 'nullable|string|in:descuento,2x1,combo,happy_hour,evento,puntos,regalo,especial',
            'discount' => 'nullable|string|max:50',
            'indefinite' => 'nullable|boolean',
            'startDate' => ($creating ? 'nullable|required_unless:indefinite,true' : 'sometimes|nullable|required_unless:indefinite,true') . '|date',
            'endDate' => ($creating ? 'nullable|required_unless:indefinite,true' : 'sometimes|nullable|required_unless:indefinite,true') . '|date|after_or_equal:startDate',
            'daysActive' => ($creating ? 'required' : 'sometimes') . '|array|min:1',
            'daysActive.*' => 'string|in:lunes,martes,miercoles,jueves,viernes,sabado,domingo',
            'status' => 'nullable|string|in:activa,pausada,finalizada',
            'target' => 'nullable|integer|min:0',
            'image' => ['nullable', 'string', 'max:500', $this->safePublicUrl()],
            'slug' => [
                'nullable',
                'string',
                'max:250',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('promociones', 'slug')->ignore($id),
            ],
            'landingEnabled' => 'nullable|boolean',
            'landingTitle' => 'nullable|string|max:255',
            'landingSubtitle' => 'nullable|string|max:500',
            'landingContent' => 'nullable|string|max:10000',
            'landingTemplate' => 'nullable|string|in:editorial,clasica',
            'seoTitle' => 'nullable|string|max:255',
            'seoDescription' => 'nullable|string|max:500',
            'ogImage' => ['nullable', 'string', 'max:500', $this->safePublicUrl()],
            'ctaPrimaryText' => 'nullable|required_with:ctaPrimaryUrl|string|max:100',
            'ctaPrimaryUrl' => ['nullable', 'required_with:ctaPrimaryText', 'string', 'max:500', $this->safeCtaUrl()],
            'ctaSecondaryText' => 'nullable|required_with:ctaSecondaryUrl|string|max:100',
            'ctaSecondaryUrl' => ['nullable', 'required_with:ctaSecondaryText', 'string', 'max:500', $this->safeCtaUrl()],
            'formEnabled' => 'nullable|boolean',
            'formFields' => $formEnabled
                ? 'required|array|min:1'
                : 'nullable|array',
            'formFields.*' => ['string', Rule::in(Promocion::FORM_FIELDS), 'distinct'],
        ];
    }

    private function toFrontend(Promocion $p): array
    {
        return [
            'id' => (string) $p->id,
            'name' => $p->titulo,
            'description' => $p->descripcion ?? '',
            'type' => $p->tipo ?? 'descuento',
            'discount' => $p->descuento ?? '',
            'startDate' => $this->hasDateRange($p) ? $p->dia_inicio : '',
            'endDate' => $this->hasDateRange($p) ? $p->dia_fin : '',
            'daysActive' => $p->activeDays(),
            'indefinite' => $p->indefinida || ! $this->hasDateRange($p),
            'status' => $p->estado ?? ($p->activa ? 'activa' : 'pausada'),
            'redemptions' => $p->redenciones ?? 0,
            'target' => $p->meta ?? 0,
            'revenue' => (float) ($p->ingresos ?? 0),
            'image' => $p->imagen ?? '',
            'imageAlt' => $p->titulo,
            'slug' => $p->slug ?? '',
            'landingEnabled' => (bool) $p->landing_enabled,
            'landingTitle' => $p->landing_title ?? '',
            'landingSubtitle' => $p->landing_subtitle ?? '',
            'landingContent' => $p->landing_content ?? '',
            'landingTemplate' => $p->landing_template ?? 'editorial',
            'seoTitle' => $p->seo_title ?? '',
            'seoDescription' => $p->seo_description ?? '',
            'ogImage' => $p->og_image ?? '',
            'ctaPrimaryText' => $p->cta_primary_text ?? '',
            'ctaPrimaryUrl' => $p->cta_primary_url ?? '',
            'ctaSecondaryText' => $p->cta_secondary_text ?? '',
            'ctaSecondaryUrl' => $p->cta_secondary_url ?? '',
            'formEnabled' => (bool) $p->form_enabled,
            'formFields' => $p->form_fields ?? [],
            'viewsCount' => (int) ($p->views_count ?? 0),
            'clicksCount' => (int) ($p->clicks_count ?? 0),
            'leadsCount' => (int) ($p->leads_count ?? 0),
            'published' => $p->published_at !== null,
            'publishedAt' => $p->published_at?->toIso8601String(),
            'landingUrl' => $p->slug
                ? rtrim((string) config('app.frontend_url'), '/') . '/promo/' . $p->slug
                : '',
        ];
    }

    private function fromFrontend(Request $request): array
    {
        $map = [];

        if ($request->has('name')) $map['titulo'] = $this->cleanText($request->input('name'));
        if ($request->has('description')) $map['descripcion'] = $this->nullableCleanText($request, 'description');
        if ($request->has('type')) $map['tipo'] = $request->input('type');
        if ($request->has('discount')) $map['descuento'] = $this->nullableCleanText($request, 'discount');
        if ($request->has('indefinite')) {
            $map['indefinida'] = $request->boolean('indefinite');
            if ($map['indefinida']) {
                $map['dia_inicio'] = null;
                $map['dia_fin'] = null;
            }
        }
        if (! ($map['indefinida'] ?? false) && $request->has('startDate')) $map['dia_inicio'] = $request->input('startDate');
        if (! ($map['indefinida'] ?? false) && $request->has('endDate')) $map['dia_fin'] = $request->input('endDate');
        if ($request->has('daysActive')) $map['dias_activos'] = implode(',', $request->input('daysActive'));
        if ($request->has('status')) {
            $map['estado'] = $request->input('status');
            $map['activa'] = $request->input('status') === 'activa';
        }
        if ($request->has('target')) $map['meta'] = $request->input('target');
        if ($request->has('image')) $map['imagen'] = $request->input('image');
        if ($request->has('redemptions')) $map['redenciones'] = $request->input('redemptions');
        if ($request->has('slug')) $map['slug'] = $request->filled('slug') ? Str::slug($request->input('slug')) : null;
        if ($request->has('landingEnabled')) $map['landing_enabled'] = $request->boolean('landingEnabled');
        if ($request->has('landingTitle')) $map['landing_title'] = $this->nullableCleanText($request, 'landingTitle');
        if ($request->has('landingSubtitle')) $map['landing_subtitle'] = $this->nullableCleanText($request, 'landingSubtitle');
        if ($request->has('landingContent')) $map['landing_content'] = $this->nullableCleanText($request, 'landingContent');
        if ($request->has('landingTemplate')) $map['landing_template'] = $request->input('landingTemplate') ?: 'editorial';
        if ($request->has('seoTitle')) $map['seo_title'] = $this->nullableCleanText($request, 'seoTitle');
        if ($request->has('seoDescription')) $map['seo_description'] = $this->nullableCleanText($request, 'seoDescription');
        if ($request->has('ogImage')) $map['og_image'] = $this->nullableString($request, 'ogImage');
        if ($request->has('ctaPrimaryText')) $map['cta_primary_text'] = $this->nullableCleanText($request, 'ctaPrimaryText');
        if ($request->has('ctaPrimaryUrl')) $map['cta_primary_url'] = $this->nullableString($request, 'ctaPrimaryUrl');
        if ($request->has('ctaSecondaryText')) $map['cta_secondary_text'] = $this->nullableCleanText($request, 'ctaSecondaryText');
        if ($request->has('ctaSecondaryUrl')) $map['cta_secondary_url'] = $this->nullableString($request, 'ctaSecondaryUrl');
        if ($request->has('formEnabled')) $map['form_enabled'] = $request->boolean('formEnabled');
        if ($request->has('formFields')) {
            $map['form_fields'] = array_values(array_intersect(Promocion::FORM_FIELDS, $request->input('formFields', [])));
        }

        return $map;
    }

    private function hasDateRange(Promocion $promo): bool
    {
        return (bool) preg_match('/^\d{4}-\d{2}-\d{2}$/', $promo->dia_inicio ?? '')
            && (bool) preg_match('/^\d{4}-\d{2}-\d{2}$/', $promo->dia_fin ?? '');
    }

    private function uniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value) ?: 'promocion';
        $slug = $base;
        $suffix = 2;

        while (Promocion::where('slug', $slug)
            ->when($ignoreId, fn($query) => $query->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = $base . '-' . $suffix++;
        }

        return $slug;
    }

    private function safeCtaUrl(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if (! is_string($value) || $value === '') return;

            if (preg_match('~^/(?!/)[A-Za-z0-9/_?=&%+.,:@#-]*$~', $value)) return;

            if (filter_var($value, FILTER_VALIDATE_URL)
                && strtolower((string) parse_url($value, PHP_URL_SCHEME)) === 'https') {
                return;
            }

            $fail('El campo :attribute debe ser una ruta interna o una URL HTTPS válida.');
        };
    }

    private function safePublicUrl(): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail): void {
            if (! is_string($value) || $value === '') return;

            if (preg_match('~^/(?!/)[A-Za-z0-9/_?=&%+.,:@#-]*$~', $value)) return;

            if (filter_var($value, FILTER_VALIDATE_URL)
                && strtolower((string) parse_url($value, PHP_URL_SCHEME)) === 'https') {
                return;
            }

            $fail('El campo :attribute debe ser una ruta interna o una URL HTTPS válida.');
        };
    }

    private function nullableString(Request $request, string $key): ?string
    {
        $value = trim((string) $request->input($key, ''));

        return $value !== '' ? $value : null;
    }

    private function nullableCleanText(Request $request, string $key): ?string
    {
        $value = $this->cleanText($request->input($key));

        return $value !== '' ? $value : null;
    }

    private function cleanText(mixed $value): string
    {
        $value = preg_replace('~<(script|style)\b[^>]*>.*?</\1>~is', '', (string) $value);

        return trim(strip_tags((string) $value));
    }

    private function validateSanitizedName(array $attributes): void
    {
        if (array_key_exists('titulo', $attributes) && $attributes['titulo'] === '') {
            throw ValidationException::withMessages([
                'name' => 'El nombre debe contener texto visible.',
            ]);
        }
    }

    private function percentage(int $value, int $total): float
    {
        return $total > 0 ? round(($value / $total) * 100, 2) : 0;
    }

    private function csvSafe(mixed $value): string
    {
        $value = (string) ($value ?? '');

        return preg_match('/^[=+\-@]/', $value) ? "'" . $value : $value;
    }
}
