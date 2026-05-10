<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class ConfiguracionController extends Controller
{
    public function index()
    {
        return response()->json([
            'general' => Setting::getGroup('general'),
            'notificaciones' => Setting::getGroup('notificaciones'),
            'apariencia' => Setting::getGroup('apariencia'),
            'seguridad' => Setting::getGroup('seguridad'),
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'group' => 'required|string|in:general,notificaciones,apariencia,seguridad',
            'data' => 'required|array',
        ]);

        Setting::setGroup($request->input('group'), $request->input('data'));

        return response()->json(['message' => 'Configuración guardada']);
    }
}
