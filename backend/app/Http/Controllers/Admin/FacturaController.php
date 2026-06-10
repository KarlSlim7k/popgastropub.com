<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\PushNotificationController;
use App\Models\Factura;
use App\Models\FacturaStatusLog;
use App\Services\FacturaAccountantMailer;
use App\Services\TicketStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class FacturaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 20), 100);
        $query = Factura::with('user')->orderBy('created_at', 'desc');

        if ($request->input('from')) $query->whereDate('created_at', '>=', $request->input('from'));
        if ($request->input('to')) $query->whereDate('created_at', '<=', $request->input('to'));
        if ($request->input('estado')) $query->where('estado', $request->input('estado'));

        $paginated = $query->paginate($perPage);

        return response()->json([
            'data' => $paginated->items(),
            'meta' => ['current_page' => $paginated->currentPage(), 'last_page' => $paginated->lastPage(), 'total' => $paginated->total()],
        ]);
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

        // Log the status change
        FacturaStatusLog::create([
            'factura_id' => $factura->id,
            'user_id' => $request->user()?->id,
            'from_status' => $oldStatus,
            'to_status' => $validated['estado'],
            'nota' => $request->input('nota'),
        ]);

        // Send email notification if factura has email
        if ($factura->email && $oldStatus !== $validated['estado']) {
            $this->sendStatusNotification($factura);
        }

        // Push notification to client
        if ($factura->user_id && $oldStatus !== $validated['estado']) {
            $labels = ['recibida' => 'Recibida', 'en_proceso' => 'En proceso', 'enviada_contadores' => 'Con contadores', 'completada' => '✅ Completada', 'rechazada' => '❌ Rechazada'];
            PushNotificationController::sendToUser(
                $factura->user_id,
                'Actualización de tu factura',
                'Tu solicitud F-' . str_pad($factura->id, 4, '0', STR_PAD_LEFT) . ' está ahora: ' . ($labels[$validated['estado']] ?? $validated['estado'])
            );
        }

        return response()->json($factura);
    }

    public function statusLog($id)
    {
        $factura = Factura::findOrFail($id);
        return response()->json(
            FacturaStatusLog::where('factura_id', $factura->id)
                ->with('user:id,name')
                ->orderByDesc('created_at')
                ->get()
        );
    }

    public function ticket($id, Request $request)
    {
        $factura = Factura::findOrFail($id);
        $disk = TicketStorage::diskFor($factura->ticket_path);

        abort_unless($disk->exists($factura->ticket_path), 404, 'Ticket no encontrado.');

        return $request->boolean('download')
            ? $disk->download($factura->ticket_path)
            : response()->file($disk->path($factura->ticket_path));
    }

    public function retryAccountantEmail($id, FacturaAccountantMailer $mailer)
    {
        $factura = Factura::findOrFail($id);
        $sent = $mailer->deliver($factura);

        return response()->json([
            'factura' => $factura->fresh(),
            'message' => $sent ? 'Correo enviado a contadores.' : 'No se pudo enviar. Se reintentará automáticamente.',
        ], $sent ? 200 : 202);
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
