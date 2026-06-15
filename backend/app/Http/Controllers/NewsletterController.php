<?php

namespace App\Http\Controllers;

use App\Services\NewsletterService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function __construct(private NewsletterService $newsletter)
    {
    }

    public function subscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email:rfc|max:191',
            'name' => 'nullable|string|max:255',
        ]);

        $this->newsletter->recordSubscription(
            Str::lower(trim($validated['email'])),
            $validated['name'] ?? null,
            null,
            'landing'
        );

        return response()->json(['message' => 'Gracias por suscribirte a nuestro newsletter.']);
    }

    public function unsubscribe(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email:rfc|max:191',
        ]);

        $this->newsletter->recordUnsubscription(Str::lower(trim($validated['email'])));

        return response()->json(['message' => 'Has cancelado tu suscripción al newsletter.']);
    }
}
