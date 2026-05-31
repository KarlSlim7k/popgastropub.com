<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class FacturaController extends Controller
{
    public function index(Request $request)
    {
        $query = Factura::with('user')->orderBy('created_at', 'desc');

        if ($request->has('from') && $request->input('from')) {
            $query->whereDate('created_at', '>=', $request->input('from'));
        }
        if ($request->has('to') && $request->input('to')) {
            $query->whereDate('created_at', '<=', $request->input('to'));
        }

        return response()->json($query->get());
    }

    public function show($id)
    {
        $factura = Factura::with('user')->findOrFail($id);

        return response()->json($factura);
    }

    public function updateStatus(Request $request, $id)
    {
        $status = $request->input('status') ?? $request->input('estado');

        $validated = validator(['estado' => $status], [
            'estado' => 'required|in:recibida,en_proceso,enviada_contadores,completada,rechazada',
        ])->validate();

        $factura = Factura::findOrFail($id);
        $oldStatus = $factura->estado;
        $factura->update(['estado' => $validated['estado']]);

        // Send email notification if factura has email
        if ($factura->email && $oldStatus !== $validated['estado']) {
            $this->sendStatusNotification($factura);
        }

        return response()->json($factura);
    }

    public function ticket($id, Request $request)
    {
        $factura = Factura::findOrFail($id);
        $disk = Storage::disk('public');

        abort_unless($disk->exists($factura->ticket_path), 404, 'Ticket no encontrado.');

        return $request->boolean('download')
            ? $disk->download($factura->ticket_path)
            : response()->file($disk->path($factura->ticket_path));
    }

    private function sendStatusNotification(Factura $factura): void
    {
        $statusLabels = [
            'recibida' => 'Recibida',
            'en_proceso' => 'En Proceso',
            'enviada_contadores' => 'Enviada a Contadores',
            'completada' => 'Completada',
            'rechazada' => 'Rechazada',
        ];

        $label = $statusLabels[$factura->estado] ?? $factura->estado;

        try {
            Mail::raw(
                "Hola {$factura->razon_social},\n\n" .
                "Tu solicitud de facturación (Folio F-" . str_pad($factura->id, 4, '0', STR_PAD_LEFT) . ") " .
                "ha sido actualizada al estado: {$label}.\n\n" .
                "Si tienes dudas, contáctanos al 282-825-32-43.\n\n" .
                "— POP Perote",
                function ($message) use ($factura) {
                    $message->to($factura->email)
                        ->subject('Actualización de tu solicitud de factura - POP Perote');
                }
            );
        } catch (\Exception $e) {
            // Log but don't fail the request
            \Log::warning('Failed to send factura notification: ' . $e->getMessage());
        }
    }
}
