<?php

namespace App\Http\Controllers;

use App\Models\PromoEvent;
use App\Models\PromoLead;
use App\Models\Promocion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PromocionController extends Controller
{
    public function index()
    {
        $promociones = Promocion::where('activa', true)
            ->orderBy('dia_inicio')
            ->get()
            ->filter(fn(Promocion $promo) => $promo->isWithinDateWindow(today()))
            ->values()
            ->map(fn(Promocion $promo) => $this->toPublic($promo));

        return response()->json(['data' => $promociones]);
    }

    public function show(string $slug)
    {
        return response()->json(['data' => $this->toPublic($this->publicPromo($slug))]);
    }

    public function view(Request $request, string $slug)
    {
        $promo = $this->publicPromo($slug);
        $ipHash = $this->ipHash($request);
        $recorded = ! PromoEvent::where('promocion_id', $promo->id)
            ->where('event_type', PromoEvent::VIEW)
            ->where('ip_hash', $ipHash)
            ->where('created_at', '>=', now()->subMinutes(30))
            ->exists();

        if ($recorded) {
            DB::transaction(function () use ($promo, $request, $ipHash): void {
                $this->createEvent($promo, PromoEvent::VIEW, $request, $ipHash);
                $promo->increment('views_count');
            });
        }

        return response()->json(['recorded' => $recorded], 202);
    }

    public function click(Request $request, string $slug)
    {
        $promo = $this->publicPromo($slug);
        $validated = $request->validate([
            'type' => 'required|string|in:cta_primary_click,cta_secondary_click',
        ]);

        DB::transaction(function () use ($promo, $request, $validated): void {
            $this->createEvent($promo, $validated['type'], $request);
            $promo->increment('clicks_count');
        });

        return response()->json(['recorded' => true], 202);
    }

    public function lead(Request $request, string $slug)
    {
        $promo = $this->publicPromo($slug);
        abort_unless($promo->form_enabled, 404);

        $fields = array_values(array_intersect(Promocion::FORM_FIELDS, $promo->form_fields ?? []));
        abort_if($fields === [], 422, 'La campaña no tiene campos de formulario configurados.');

        $rules = [
            'nombre' => 'string|max:150',
            'telefono' => ['string', 'max:30', 'regex:/^[0-9+().\s-]{7,30}$/'],
            'email' => 'email:rfc|max:191',
            'mensaje' => 'string|max:2000',
            'origen' => 'nullable|string|max:100',
        ];

        foreach ($fields as $field) {
            $rules[$field] = 'required|' . (is_array($rules[$field]) ? implode('|', $rules[$field]) : $rules[$field]);
        }

        $validated = $request->validate($rules);
        $attributes = ['promocion_id' => $promo->id];
        foreach (array_merge($fields, ['origen']) as $field) {
            $attributes[$field] = $this->cleanText($validated[$field] ?? null);
        }

        DB::transaction(function () use ($attributes, $promo, $request): void {
            PromoLead::create($attributes);
            $this->createEvent($promo, PromoEvent::LEAD, $request);
            $promo->increment('leads_count');
        });

        return response()->json(['message' => 'Datos registrados correctamente.'], 201);
    }

    private function toPublic(Promocion $promo): array
    {
        $data = $promo->makeHidden(['views_count', 'clicks_count', 'leads_count'])->toArray();
        $data['dias_activos'] = $promo->activeDays();
        $data['disponible_hoy'] = $promo->isAvailableOn(today());
        $data['landing_url'] = $promo->hasPublicLanding(today())
            ? rtrim((string) config('app.frontend_url'), '/') . '/promo/' . $promo->slug
            : null;

        return $data;
    }

    private function publicPromo(string $slug): Promocion
    {
        $promo = Promocion::where('slug', $slug)
            ->where('landing_enabled', true)
            ->whereNotNull('published_at')
            ->where('activa', true)
            ->where('estado', 'activa')
            ->firstOrFail();

        abort_unless($promo->hasPublicLanding(today()), 404);

        return $promo;
    }

    private function createEvent(Promocion $promo, string $type, Request $request, ?string $ipHash = null): void
    {
        PromoEvent::create([
            'promocion_id' => $promo->id,
            'event_type' => $type,
            'ip_hash' => $ipHash ?? $this->ipHash($request),
            'user_agent' => $this->limitText($request->userAgent(), 500),
            'referrer' => $this->limitText($request->headers->get('referer'), 500),
            'created_at' => now(),
        ]);
    }

    private function ipHash(Request $request): string
    {
        return hash_hmac('sha256', (string) $request->ip(), (string) config('app.key'));
    }

    private function limitText(?string $value, int $limit): ?string
    {
        $value = $this->cleanText($value);

        return $value === null ? null : mb_substr($value, 0, $limit);
    }

    private function cleanText(?string $value): ?string
    {
        $value = trim(strip_tags((string) $value));

        return $value !== '' ? $value : null;
    }
}
