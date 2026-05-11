<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class StaffConfigController extends Controller
{
    public function index(Request $request)
    {
        $group = 'staff_' . $request->user()->id;

        return response()->json(Setting::getGroup($group));
    }

    public function update(Request $request)
    {
        $request->validate(['data' => 'required|array']);

        $group = 'staff_' . $request->user()->id;
        Setting::setGroup($group, $request->input('data'));

        return response()->json(['message' => 'Configuración guardada']);
    }
}
