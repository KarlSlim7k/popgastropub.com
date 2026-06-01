<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use App\Models\StaffNotification;
use Illuminate\Http\Request;

class StaffNotificationController extends Controller
{
    public function index(Request $request)
    {
        $mesero = Mesero::where('user_id', $request->user()->id)->first();
        if (!$mesero) {
            return response()->json([]);
        }

        $notifications = StaffNotification::where('mesero_id', $mesero->id)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return response()->json($notifications);
    }

    public function unreadCount(Request $request)
    {
        $mesero = Mesero::where('user_id', $request->user()->id)->first();
        if (!$mesero) {
            return response()->json(['count' => 0]);
        }

        $count = StaffNotification::where('mesero_id', $mesero->id)
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }

    public function markRead(Request $request)
    {
        $mesero = Mesero::where('user_id', $request->user()->id)->first();
        if (!$mesero) {
            return response()->json(['message' => 'OK']);
        }

        StaffNotification::where('mesero_id', $mesero->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['message' => 'Notificaciones marcadas como leídas']);
    }
}
