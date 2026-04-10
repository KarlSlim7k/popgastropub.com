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

    // Invoices
    Route::get('/facturas', [FacturaController::class, 'index']);
    Route::post('/facturas', [FacturaController::class, 'store']);
    Route::get('/facturas/{id}', [FacturaController::class, 'show']);
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
});
