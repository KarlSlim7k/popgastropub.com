<?php

namespace App\Http\Controllers;

use App\Jobs\SendPushNotification;
use App\Models\PushSubscription;
use Illuminate\Http\Request;

class PushNotificationController extends Controller
{
    /**
     * Save a push subscription for the authenticated user.
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'endpoint' => 'required|string|max:500',
            'keys.p256dh' => 'required|string',
            'keys.auth' => 'required|string',
        ]);

        PushSubscription::updateOrCreate(
            ['endpoint' => $request->input('endpoint')],
            [
                'user_id' => $request->user()?->id,
                'p256dh' => $request->input('keys.p256dh'),
                'auth' => $request->input('keys.auth'),
            ]
        );

        return response()->json(['message' => 'Suscripción guardada'], 201);
    }

    /**
     * Remove a push subscription.
     */
    public function unsubscribe(Request $request)
    {
        $request->validate(['endpoint' => 'required|string']);
        PushSubscription::where('endpoint', $request->input('endpoint'))->delete();
        return response()->json(['message' => 'Suscripción eliminada']);
    }

    /**
     * Return the VAPID public key for the frontend.
     */
    public function vapidPublicKey()
    {
        return response()->json(['public_key' => config('app.vapid_public_key')]);
    }

    /**
     * Send a push notification to a specific user or all subscribers.
     * Used internally by other controllers.
     */
    public static function sendToUser(int $userId, string $title, string $body, array $data = []): void
    {
        $subscriptions = PushSubscription::where('user_id', $userId)->get();
        if ($subscriptions->isEmpty()) return;

        SendPushNotification::dispatch($subscriptions->toArray(), $title, $body, $data);
    }

    public static function sendToAll(string $title, string $body, array $data = []): void
    {
        $subscriptions = PushSubscription::all();
        if ($subscriptions->isEmpty()) return;

        SendPushNotification::dispatch($subscriptions->toArray(), $title, $body, $data);
    }
}
