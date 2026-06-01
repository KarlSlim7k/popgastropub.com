<?php

namespace App\Http\Controllers;

use App\Models\Mesero;
use App\Models\MeseroRating;
use App\Models\StaffNotification;
use Illuminate\Http\Request;

class MeseroRatingController extends Controller
{
    /**
     * List active meseros for rating (public for authenticated clients).
     */
    public function meseros()
    {
        $meseros = Mesero::where('activo', true)
            ->select('id', 'nombre', 'iniciales')
            ->orderBy('nombre')
            ->get();

        return response()->json($meseros);
    }

    /**
     * Client rates a mesero. Awards 30 pts per rating (mention).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mesero_id' => 'required|exists:meseros,id',
            'rating' => 'required|integer|min:1|max:5',
            'comentario' => 'nullable|string|max:255',
        ]);

        $user = $request->user();

        // Limit: 1 rating per mesero per day
        $exists = MeseroRating::where('user_id', $user->id)
            ->where('mesero_id', $validated['mesero_id'])
            ->whereDate('created_at', now()->toDateString())
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Ya calificaste a este mesero hoy'], 422);
        }

        $rating = MeseroRating::create([
            'user_id' => $user->id,
            'mesero_id' => $validated['mesero_id'],
            'rating' => $validated['rating'],
            'comentario' => $validated['comentario'] ?? null,
        ]);

        // Award 30 points to mesero for customer mention
        $mesero = Mesero::find($validated['mesero_id']);
        $mesero->increment('rating_points', 30);
        $mesero->increment('puntos', 30);

        // Update avg_rating
        $avg = MeseroRating::where('mesero_id', $mesero->id)->avg('rating');
        $mesero->update(['avg_rating' => round($avg, 1)]);

        // Notify mesero
        StaffNotification::send(
            $mesero->id,
            'new_rating',
            '¡Nueva calificación!',
            "Un cliente te calificó con {$validated['rating']}★ (+30 pts)",
            ['rating' => $validated['rating'], 'points_awarded' => 30]
        );

        return response()->json([
            'message' => '¡Gracias por tu calificación!',
            'rating' => $rating,
        ], 201);
    }
}
