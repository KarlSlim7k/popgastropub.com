<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\TicketRedeem;
use App\Services\QrSignatureService;
use App\Services\TicketValidator;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketGeneratorController extends Controller
{
    public function __construct(
        private readonly TicketValidator $validator,
        private readonly QrSignatureService $qrSignature,
    ) {
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
        $totalInt = (int) $total;
        $puntos = (int) floor($total / 10);
        $ref = 'TKT-' . date('Ymd') . '-' . strtoupper(Str::random(6));
        $ts = now()->timestamp;
        $sig = $this->qrSignature->sign($totalInt, $ref, $ts);
        $hashVerificacion = $this->validator->generarHash($v);

        $mesero = $request->user()->mesero;

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store(
                'tickets/' . date('Y/m'),
                'local'
            );
        }

        $fechaExpiracion = now()->addHours(TicketValidator::WINDOW_HOURS);

        try {
            TicketRedeem::create([
                'ref' => $ref,
                'folio_ticket' => $v['folio'],
                'total' => $totalInt,
                'subtotal' => (float) $v['subtotal'],
                'iva' => (float) $v['iva'],
                'puntos' => $puntos,
                'hash_verificacion' => $hashVerificacion,
                'foto_ticket_path' => $fotoPath,
                'mesero_id' => $mesero?->id,
                'ts_emision' => $ts,
                'fecha_emision_ticket' => $v['fecha_emision'] ?? null,
                'fecha_expiracion' => $fechaExpiracion,
                'ip_generacion' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 255),
                'estado_validacion' => 'valido',
            ]);
        } catch (QueryException $e) {
            if (($e->errorInfo[0] ?? null) === '23000') {
                return response()->json([
                    'valido' => false,
                    'errores' => ['Este folio ya fue registrado anteriormente'],
                ], 422);
            }
            throw $e;
        }

        $url = config('app.frontend_url', 'https://popgastropub.com')
            . "/puntos/canjear?total={$totalInt}&ref={$ref}&ts={$ts}&sig={$sig}";

        return response()->json([
            'url' => $url,
            'puntos' => $puntos,
            'ref' => $ref,
            'folio' => $v['folio'],
            'fecha_expiracion' => $fechaExpiracion->toDateTimeString(),
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
            ->append('estado_legible');

        return response()->json($tickets);
    }
}
