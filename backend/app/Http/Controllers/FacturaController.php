<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use App\Services\FacturaAccountantMailer;
use App\Services\TicketStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Throwable;

class FacturaController extends Controller
{
    public function index(Request $request)
    {
        $facturas = $request->user()->facturas()->orderBy('created_at', 'desc')->get();

        return response()->json($facturas);
    }

    public function store(Request $request, FacturaAccountantMailer $mailer)
    {
        $validator = Validator::make($request->all(), [
            'rfc' => 'required|string|max:13',
            'razon_social' => 'required|string|max:255',
            'regimen_fiscal' => 'required|string',
            'codigo_postal' => 'required|string|max:5',
            'uso_cfdi' => 'required|string',
            'email' => 'required|email|max:255',
            'ticket' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $path = $request->file('ticket')->store('tickets', 'local');

        try {
            $factura = Factura::create([
                'user_id' => $request->user()->id,
                'ticket_path' => $path,
                'rfc' => $request->rfc,
                'razon_social' => $request->razon_social,
                'regimen_fiscal' => $request->regimen_fiscal,
                'codigo_postal' => $request->codigo_postal,
                'uso_cfdi' => $request->uso_cfdi,
                'email' => $request->email,
                'estado' => 'recibida',
            ]);
        } catch (Throwable $exception) {
            Storage::disk('local')->delete($path);
            throw $exception;
        }

        $sent = $mailer->deliver($factura);

        return response()->json([
            'factura' => $factura->fresh(),
            'message' => $sent
                ? 'Solicitud recibida y enviada al equipo de facturación.'
                : 'Solicitud recibida. El envío al equipo de facturación está en reintento automático.',
        ], $sent ? 201 : 202);
    }

    public function show($id, Request $request)
    {
        $factura = $request->user()->facturas()->findOrFail($id);

        return response()->json($factura);
    }

    public function ticket($id, Request $request)
    {
        $factura = $request->user()->facturas()->findOrFail($id);

        return $this->ticketResponse($factura, $request->boolean('download'));
    }

    private function ticketResponse(Factura $factura, bool $download)
    {
        $disk = TicketStorage::diskFor($factura->ticket_path);

        abort_unless($disk->exists($factura->ticket_path), 404, 'Ticket no encontrado.');

        return $download
            ? $disk->download($factura->ticket_path)
            : response()->file($disk->path($factura->ticket_path));
    }

}
