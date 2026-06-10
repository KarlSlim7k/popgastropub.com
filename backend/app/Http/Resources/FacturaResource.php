<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacturaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rfc' => $this->rfc,
            'razon_social' => $this->razon_social,
            'regimen_fiscal' => $this->regimen_fiscal,
            'codigo_postal' => $this->codigo_postal,
            'uso_cfdi' => $this->uso_cfdi,
            'email' => $this->email,
            'estado' => $this->estado,
            'ticket_path' => $this->ticket_path,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
