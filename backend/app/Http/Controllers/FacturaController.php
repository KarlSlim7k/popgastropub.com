<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FacturaController extends Controller
{
    public function index(Request $request)
    {
        $facturas = $request->user()->facturas()->orderBy('created_at', 'desc')->get();

        return response()->json($facturas);
    }

    public function store(Request $request)
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

        $path = $request->file('ticket')->store('tickets', 'public');

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

        // Send email to contadores with ticket and fiscal data
        $this->sendToContadores($factura, $path);

        return response()->json($factura, 201);
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
        $disk = Storage::disk('public');

        abort_unless($disk->exists($factura->ticket_path), 404, 'Ticket no encontrado.');

        return $download
            ? $disk->download($factura->ticket_path)
            : response()->file($disk->path($factura->ticket_path));
    }

    private function sendToContadores(Factura $factura, string $ticketPath): void
    {
        $disk = Storage::disk('public');
        $fullPath = $disk->path($ticketPath);

        Mail::raw($this->buildEmailBody($factura), function ($message) use ($factura, $fullPath) {
            $message->to('facturacion@popgastropub.com')
                ->subject("Solicitud de Factura - {$factura->rfc} - #{$factura->id}")
                ->replyTo($factura->email, $factura->razon_social)
                ->attach($fullPath);
        });
    }

    private function buildEmailBody(Factura $factura): string
    {
        return "SOLICITUD DE FACTURA #{$factura->id}\n"
            . "Fecha: " . now()->format('d/m/Y H:i') . "\n\n"
            . "DATOS FISCALES:\n"
            . "RFC: {$factura->rfc}\n"
            . "Razón Social: {$factura->razon_social}\n"
            . "Régimen Fiscal: {$factura->regimen_fiscal}\n"
            . "Código Postal: {$factura->codigo_postal}\n"
            . "Uso CFDI: {$factura->uso_cfdi}\n"
            . "Email cliente: {$factura->email}\n\n"
            . "El ticket de compra se adjunta a este correo.\n"
            . "---\nEnviado desde POP Perote - Sistema de Facturación";
    }
}
