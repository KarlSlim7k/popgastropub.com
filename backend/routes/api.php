<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\PromocionController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\LoyaltyController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\UbicacionController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\RecompensaController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/menu', [MenuController::class, 'index']);
Route::get('/menu/{id}', [MenuController::class, 'show']);
Route::get('/promociones', [PromocionController::class, 'index']);
Route::get('/ubicacion', [UbicacionController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Auth Routes (Sanctum)
|--------------------------------------------------------------------------
*/

Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:auth-register');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:auth-login');
Route::get('/auth/social/providers', [SocialAuthController::class, 'providers']);
Route::get('/auth/social/{provider}/redirect', [SocialAuthController::class, 'redirectToProvider'])
    ->whereIn('provider', ['google', 'facebook', 'x'])
    ->middleware('throttle:auth-social');
Route::get('/auth/social/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback'])
    ->whereIn('provider', ['google', 'facebook', 'x'])
    ->middleware('throttle:auth-social');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Authenticated)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    // Loyalty / POP Points
    Route::get('/loyalty/points', [LoyaltyController::class, 'points']);
    Route::get('/loyalty/tier', [LoyaltyController::class, 'tier']);
    Route::post('/loyalty/checkin', [LoyaltyController::class, 'checkin']);
    Route::get('/loyalty/history', [LoyaltyController::class, 'history']);

    // Invoices
    Route::get('/facturas', [FacturaController::class, 'index']);
    Route::post('/facturas', [FacturaController::class, 'store']);
    Route::get('/facturas/{id}', [FacturaController::class, 'show']);

    // Reservas
    Route::get('/reservas', [ReservaController::class, 'index']);
    Route::post('/reservas', [ReservaController::class, 'store']);

    // Pedidos
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::post('/pedidos', [PedidoController::class, 'store']);

    // Recompensas
    Route::get('/recompensas', [RecompensaController::class, 'index']);
    Route::post('/recompensas/{id}/canjear', [RecompensaController::class, 'redeem']);
});

/*
|--------------------------------------------------------------------------
| Staff Routes (mesero role)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:mesero'])->group(function () {
    Route::get('/ranking', [RankingController::class, 'index']);
    Route::post('/ranking/points', [RankingController::class, 'addPoints']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes (admin role)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index']);

    // Menu CRUD
    Route::apiResource('menu', App\Http\Controllers\Admin\MenuController::class);

    // Promociones CRUD
    Route::apiResource('promociones', App\Http\Controllers\Admin\PromocionController::class);

    // Facturas management
    Route::get('/facturas', [App\Http\Controllers\Admin\FacturaController::class, 'index']);
    Route::patch('/facturas/{id}/status', [App\Http\Controllers\Admin\FacturaController::class, 'updateStatus']);

    // Usuarios CRUD
    Route::apiResource('usuarios', App\Http\Controllers\Admin\UsuarioController::class);

    // Meseros CRUD
    Route::apiResource('meseros', App\Http\Controllers\Admin\MeseroController::class);

    // Reservas
    Route::apiResource('reservas', App\Http\Controllers\Admin\ReservaController::class)->except(['store']);
    Route::patch('/reservas/{id}/status', [App\Http\Controllers\Admin\ReservaController::class, 'updateStatus']);

    // Pedidos
    Route::apiResource('pedidos', App\Http\Controllers\Admin\PedidoController::class)->except(['store']);
    Route::patch('/pedidos/{id}/status', [App\Http\Controllers\Admin\PedidoController::class, 'updateStatus']);

    // Recompensas
    Route::apiResource('recompensas', App\Http\Controllers\Admin\RecompensaController::class);
});
