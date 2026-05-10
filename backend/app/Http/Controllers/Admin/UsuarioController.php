<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index()
    {
        $users = User::orderBy('name')->get();

        return response()->json($users->map(fn($u) => $this->toFrontend($u)));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:cliente,mesero,admin',
        ]);

        $user = User::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password')),
            'role' => $request->input('role'),
            'phone' => $request->input('phone'),
            'rfc' => $request->input('rfc'),
            'status' => $request->input('status', 'activo'),
        ]);

        return response()->json($this->toFrontend($user), 201);
    }

    public function show($id)
    {
        return response()->json($this->toFrontend(User::findOrFail($id)));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:cliente,mesero,admin',
        ]);

        $data = [];
        if ($request->has('name')) $data['name'] = $request->input('name');
        if ($request->has('email')) $data['email'] = $request->input('email');
        if ($request->has('role')) $data['role'] = $request->input('role');
        if ($request->has('phone')) $data['phone'] = $request->input('phone');
        if ($request->has('rfc')) $data['rfc'] = $request->input('rfc');
        if ($request->has('status')) $data['status'] = $request->input('status');
        if ($request->has('points')) $data['points'] = $request->input('points');
        if ($request->filled('password')) $data['password'] = Hash::make($request->input('password'));

        $user->update($data);

        return response()->json($this->toFrontend($user->fresh()));
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }

    public function export()
    {
        $users = User::orderBy('name')->get();

        $csv = "ID,Nombre,Email,Teléfono,Rol,Estado,Puntos,Tier,RFC,Registro\n";
        foreach ($users as $u) {
            $csv .= "{$u->id},\"{$u->name}\",{$u->email},{$u->phone},{$u->role},{$u->status},{$u->points},{$u->tier},{$u->rfc},{$u->created_at}\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="usuarios_pop_perote.csv"',
        ]);
    }

    private function toFrontend(User $u): array
    {
        $tierColors = [
            'fan' => 'text-gray-400',
            'lover' => 'text-pop-gold',
            'vip' => 'text-pop-orange',
            'elite' => 'text-purple-400',
        ];

        return [
            'id' => (string) $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'phone' => $u->phone ?? '',
            'rfc' => $u->rfc ?? '',
            'role' => $u->role,
            'status' => $u->status ?? 'activo',
            'points' => $u->points ?? 0,
            'tier' => ucfirst($u->tier),
            'tierColor' => $tierColors[$u->tier] ?? 'text-gray-400',
            'joinDate' => $u->created_at?->toISOString() ?? '',
            'lastVisit' => $u->last_visit?->diffForHumans() ?? 'Nunca',
            'orders' => $u->orders_count ?? 0,
            'totalSpent' => '$' . number_format((float) ($u->total_spent ?? 0), 0, '.', ','),
            'avatar' => $u->name ? strtoupper(substr($u->name, 0, 1)) : '?',
        ];
    }
}
