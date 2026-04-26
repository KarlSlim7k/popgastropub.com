<?php

namespace App\Http\Controllers;

use App\Models\Factura;
use Illuminate\Http\Request;
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
            'email' => 'nullable|email|max:255',
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

        return response()->json($factura, 201);
    }

    public function show($id, Request $request)
    {
        $factura = $request->user()->facturas()->findOrFail($id);

        return response()->json($factura);
    }
}
