<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promocion;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
        $request->validate($this->rules());

        $attributes = $this->fromFrontend($request);
        $attributes['slug'] ??= $this->uniqueSlug((string) $request->input('name'));

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
        $request->validate($this->rules(false, (int) $promo->id));

        $attributes = $this->fromFrontend($request);
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

    private function rules(bool $creating = true, ?int $id = null): array
    {
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
            'image' => 'nullable|string|max:500',
            'slug' => [
                'nullable',
                'string',
                'max:250',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('promociones', 'slug')->ignore($id),
            ],
            'landingEnabled' => 'nullable|boolean',
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

        if ($request->has('name')) $map['titulo'] = $request->input('name');
        if ($request->has('description')) $map['descripcion'] = $request->input('description');
        if ($request->has('type')) $map['tipo'] = $request->input('type');
        if ($request->has('discount')) $map['descuento'] = $request->input('discount');
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
}
