<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\TicketRedeem;
use App\Services\TicketValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TicketGeneratorController extends Controller
{
    public function __construct(private readonly TicketValidator $validator)
    {
    }

    public function validar(Request $request)
    {
        $v = $request->validate([
            'folio' => 'required|string',
            'total' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'iva' => 'required|numeric|min:0',
            'fecha_emision' => 'nullable|date',
        ]);

        $errores = $this->validator->validar($v);

        if (!empty($errores)) {
            return response()->json([
                'valido' => false,
                'errores' => $errores,
            ], 422);
        }

        $puntos = (int) floor(((float) $v['total']) / 10);
        $hashPreview = substr($this->validator->generarHash($v), 0, 12);

        return response()->json([
            'valido' => true,
            'puntos_a_generar' => $puntos,
            'hash_preview' => $hashPreview,
            'referencia_preview' => sprintf('QR-%s-%s', $v['folio'], strtoupper(Str::random(4))),
        ]);
    }

    public function generate(Request $request)
    {
        $v = $request->validate([
            'folio' => 'required|string',
            'total' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'iva' => 'required|numeric|min:0',
            'fecha_emision' => 'nullable|date',
            'foto' => 'nullable|image|mimes:jpeg,jpg,png,webp|max:5120',
        ]);

        $errores = $this->validator->validar($v);
        if (!empty($errores)) {
            return response()->json([
                'error' => 'Validación fallida',
                'errores' => $errores,
            ], 422);
        }

        $total = (float) $v['total'];
        $puntos = (int) floor($total / 10);
        $ref = 'TKT-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        $ts = now()->timestamp;
        $sig = hash_hmac('sha256', $total . $ref . $ts, config('app.qr_secret'));
        $hashVerificacion = $this->validator->generarHash($v);

        $mesero = $request->user()->mesero;

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store(
                'tickets/' . date('Y/m'),
                'public'
            );
        }

        TicketRedeem::create([
            'ref' => $ref,
            'folio_ticket' => $v['folio'],
            'total' => (int) round($total),
            'subtotal' => (float) $v['subtotal'],
            'iva' => (float) $v['iva'],
            'puntos' => $puntos,
            'hash_verificacion' => $hashVerificacion,
            'foto_ticket_path' => $fotoPath,
            'mesero_id' => $mesero?->id,
            'ts_emision' => $ts,
            'fecha_emision_ticket' => $v['fecha_emision'] ?? null,
            'fecha_expiracion' => now()->addHours(TicketValidator::WINDOW_HOURS),
            'ip_generacion' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 255),
            'estado_validacion' => 'valido',
        ]);

        $url = config('app.frontend_url', 'https://popgastropub.com')
            . "/puntos/canjear?total={$total}&ref={$ref}&ts={$ts}&sig={$sig}";

        return response()->json([
            'url' => $url,
            'puntos' => $puntos,
            'ref' => $ref,
            'folio' => $v['folio'],
            'foto_url' => $fotoPath ? Storage::url($fotoPath) : null,
            'fecha_expiracion' => now()->addHours(TicketValidator::WINDOW_HOURS)->toDateTimeString(),
        ]);
    }

    public function historial(Request $request)
    {
        $mesero = $request->user()->mesero;

        if (!$mesero) {
            return response()->json([]);
        }

        $tickets = TicketRedeem::where('mesero_id', $mesero->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get([
                'id',
                'ref',
                'folio_ticket',
                'total',
                'puntos',
                'canjeado_at',
                'fecha_expiracion',
                'estado_validacion',
                'created_at',
            ])
            ->map(function ($t) {
                $t->estado_legible = $t->estado_legible;
                return $t;
            });

        return response()->json($tickets);
    }
}
