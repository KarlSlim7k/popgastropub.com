<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return array_merge(parent::toArray($request), [
            'tierColor' => self::tierColor($this->tier),
        ]);
    }

    public static function tierColor(string $tier): string
    {
        return match ($tier) {
            'lover' => '#D96725',
            'vip' => '#732817',
            'elite' => '#0D0D0D',
            default => '#F2C777',
        };
    }
}
