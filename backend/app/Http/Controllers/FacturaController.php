<?php

namespace App\Http\Controllers;

use App\Jobs\SendFacturaToAccountant;
use App\Http\Resources\FacturaResource;
use App\Models\Factura;
use App\Services\TicketStorage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Throwable;

class FacturaController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 20), 100);
        $paginated = $request->user()->facturas()->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'data' => FacturaResource::collection($paginated->items()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
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

        SendFacturaToAccountant::dispatch($factura);

        return response()->json([
            'factura' => new FacturaResource($factura->fresh()),
            'message' => 'Solicitud recibida. Tu factura está en proceso de envío al equipo de facturación.',
        ], 201);
    }

    public function show($id, Request $request)
    {
        $factura = $request->user()->facturas()->findOrFail($id);

        return response()->json(new FacturaResource($factura));
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
