<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mesero;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->input('per_page', 20), 100);
        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status');

        $query = User::orderBy('name');

        if ($search) {
            $query->where(fn($q) => $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
        }
        if ($role) $query->where('role', $role);
        if ($status) $query->where('status', $status);

        $paginated = $query->paginate($perPage);

        return response()->json([
            'data' => $paginated->map(fn($u) => $this->toFrontend($u)),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:cliente,mesero,admin',
            'phone' => 'nullable|string|max:20',
            'rfc' => 'nullable|string|max:13',
            'status' => 'nullable|in:activo,inactivo,pendiente',
        ]);

        $user = DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
                'role' => $request->input('role'),
                'phone' => $request->input('phone'),
                'rfc' => $request->input('rfc'),
                'status' => $request->input('status', 'activo'),
            ]);

            $this->syncMeseroProfile($user);

            return $user;
        });

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
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:cliente,mesero,admin',
            'phone' => 'nullable|string|max:20',
            'rfc' => 'nullable|string|max:13',
            'status' => 'sometimes|in:activo,inactivo,pendiente',
            'points' => 'sometimes|integer|min:0',
            'password' => 'nullable|string|min:8',
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

        DB::transaction(function () use ($user, $data) {
            $user->update($data);
            if ($user->status === 'inactivo') {
                $user->tokens()->delete();
            }
            $this->syncMeseroProfile($user->fresh());
        });

        return response()->json($this->toFrontend($user->fresh()));
    }

    public function destroy(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->user()->is($user)) {
            abort(422, 'No puedes eliminar tu propia cuenta.');
        }

        if ($user->role === 'admin' && User::where('role', 'admin')->count() <= 1) {
            abort(422, 'No puedes eliminar la única cuenta administradora.');
        }

        $user->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }

    public function export()
    {
        $users = User::orderBy('name')->get();

        return response()->streamDownload(function () use ($users) {
            $output = fopen('php://output', 'w');
            fputcsv($output, ['ID', 'Nombre', 'Email', 'Teléfono', 'Rol', 'Estado', 'Puntos', 'Tier', 'RFC', 'Registro']);

            foreach ($users as $user) {
                fputcsv($output, [
                    $user->id,
                    $user->name,
                    $user->email,
                    $user->phone,
                    $user->role,
                    $user->status,
                    $user->points,
                    $user->tier,
                    $user->rfc,
                    $user->created_at,
                ]);
            }

            fclose($output);
        }, 'usuarios_pop_perote.csv', ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    private function toFrontend(User $u): array
    {
        return [
            'id' => (string) $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'phone' => $u->phone ?? '',
            'rfc' => $u->rfc ?? '',
            'role' => $u->role,
            'status' => $u->status ?? 'activo',
            'points' => $u->points ?? 0,
            'tier' => $u->tier,
            'joinDate' => $u->created_at?->toISOString() ?? '',
            'lastVisit' => $u->last_visit?->diffForHumans() ?? 'Nunca',
            'orders' => $u->orders_count ?? 0,
            'totalSpent' => (float) ($u->total_spent ?? 0),
            'avatar' => $u->name ? strtoupper(substr($u->name, 0, 1)) : '?',
        ];
    }

    private function syncMeseroProfile(User $user): void
    {
        if ($user->role !== 'mesero') {
            $user->mesero?->update(['activo' => false, 'status' => 'inactivo']);
            return;
        }

        Mesero::updateOrCreate(
            ['user_id' => $user->id],
            [
                'nombre' => $user->name,
                'activo' => $user->status !== 'inactivo',
                'status' => $user->status === 'inactivo' ? 'inactivo' : 'activo',
            ]
        );
    }
}
