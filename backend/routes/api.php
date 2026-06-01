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
Route::get('/tickets/validate', [\App\Http\Controllers\TicketRedeemController::class, 'validate']);

// Public reservation (works with or without auth - controller checks $request->user())
Route::post('/reservas/public', [ReservaController::class, 'store'])->middleware('throttle:6,1');

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
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'changePassword']);
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
    Route::get('/facturas/{id}/ticket', [FacturaController::class, 'ticket']);

    // Referidos
    Route::get('/referidos', [\App\Http\Controllers\ReferralController::class, 'index']);

    // Reservas
    Route::get('/reservas', [ReservaController::class, 'index']);
    Route::post('/reservas', [ReservaController::class, 'store']);
    Route::patch('/reservas/{id}/cancel', [ReservaController::class, 'cancel']);

    // Pedidos
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::post('/pedidos', [PedidoController::class, 'store']);

    // Recompensas
    Route::get('/recompensas', [RecompensaController::class, 'index']);
    Route::get('/recompensas/historial', [RecompensaController::class, 'history']);
    Route::post('/recompensas/{id}/canjear', [RecompensaController::class, 'redeem']);

    // Tickets — canje de puntos por QR
    Route::post('/tickets/redeem', [\App\Http\Controllers\TicketRedeemController::class, 'redeem']);

    // Mesero ratings (client → waiter)
    Route::get('/meseros/para-calificar', [\App\Http\Controllers\MeseroRatingController::class, 'meseros']);
    Route::post('/meseros/calificar', [\App\Http\Controllers\MeseroRatingController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| Staff Routes (mesero role)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:mesero,admin'])->group(function () {
    Route::get('/ranking', [RankingController::class, 'index']);
    Route::post('/ranking/points', [RankingController::class, 'addPoints']);
});

Route::middleware(['auth:sanctum', 'role:mesero,admin'])->prefix('staff')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Staff\StaffDashboardController::class, 'index']);
    Route::get('/analytics', [App\Http\Controllers\Staff\StaffAnalyticsController::class, 'index']);
    Route::get('/reservas', [App\Http\Controllers\Staff\StaffReservaController::class, 'index']);
    Route::patch('/reservas/{id}/status', [App\Http\Controllers\Staff\StaffReservaController::class, 'updateStatus']);
    Route::get('/menu', [App\Http\Controllers\Staff\StaffMenuController::class, 'index']);
    Route::patch('/menu/{id}/disponibilidad', [App\Http\Controllers\Staff\StaffMenuController::class, 'toggleDisponibilidad']);
    Route::get('/mi-ranking', [App\Http\Controllers\Staff\StaffRankingController::class, 'miRanking']);
    Route::get('/configuracion', [App\Http\Controllers\Staff\StaffConfigController::class, 'index']);
    Route::put('/configuracion', [App\Http\Controllers\Staff\StaffConfigController::class, 'update']);
    Route::post('/tickets/generate', [App\Http\Controllers\Staff\TicketGeneratorController::class, 'generate']);
    Route::get('/tickets', [App\Http\Controllers\Staff\TicketGeneratorController::class, 'historial']);

    // Notifications
    Route::get('/notificaciones', [App\Http\Controllers\Staff\StaffNotificationController::class, 'index']);
    Route::get('/notificaciones/count', [App\Http\Controllers\Staff\StaffNotificationController::class, 'unreadCount']);
    Route::post('/notificaciones/read', [App\Http\Controllers\Staff\StaffNotificationController::class, 'markRead']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes (admin role)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index']);
    Route::get('/dashboard/chart-data', [App\Http\Controllers\Admin\DashboardController::class, 'chartData']);
    Route::get('/dashboard/sales-mix', [App\Http\Controllers\Admin\DashboardController::class, 'salesMix']);
    Route::get('/dashboard/top-waiters', [App\Http\Controllers\Admin\DashboardController::class, 'topWaiters']);
    Route::get('/dashboard/live-menu', [App\Http\Controllers\Admin\DashboardController::class, 'liveMenu']);

    // Puntos POP
    Route::get('/puntos/stats', [App\Http\Controllers\Admin\PuntosController::class, 'stats']);
    Route::get('/puntos/tiers', [App\Http\Controllers\Admin\PuntosController::class, 'tiers']);
    Route::get('/puntos/top-members', [App\Http\Controllers\Admin\PuntosController::class, 'topMembers']);
    Route::get('/puntos/activity', [App\Http\Controllers\Admin\PuntosController::class, 'activity']);
    Route::post('/puntos/redeem', [App\Http\Controllers\Admin\PuntosController::class, 'redeem']);

    // Configuración
    Route::get('/configuracion', [App\Http\Controllers\Admin\ConfiguracionController::class, 'index']);
    Route::put('/configuracion', [App\Http\Controllers\Admin\ConfiguracionController::class, 'update']);

    // Menu CRUD
    Route::apiResource('menu', App\Http\Controllers\Admin\MenuController::class);

    // Promociones CRUD
    Route::apiResource('promociones', App\Http\Controllers\Admin\PromocionController::class);

    // Facturas management
    Route::get('/facturas', [App\Http\Controllers\Admin\FacturaController::class, 'index']);
    Route::get('/facturas/{id}', [App\Http\Controllers\Admin\FacturaController::class, 'show']);
    Route::get('/facturas/{id}/ticket', [App\Http\Controllers\Admin\FacturaController::class, 'ticket']);
    Route::patch('/facturas/{id}/status', [App\Http\Controllers\Admin\FacturaController::class, 'updateStatus']);

    // Usuarios CRUD
    Route::apiResource('usuarios', App\Http\Controllers\Admin\UsuarioController::class);
    Route::get('/usuarios-export', [App\Http\Controllers\Admin\UsuarioController::class, 'export']);

    // Meseros CRUD
    Route::apiResource('meseros', App\Http\Controllers\Admin\MeseroController::class);

    // Ranking Periods
    Route::get('/ranking/periodos', [App\Http\Controllers\Admin\RankingPeriodController::class, 'index']);
    Route::post('/ranking/rotar', [App\Http\Controllers\Admin\RankingPeriodController::class, 'rotate']);
    Route::post('/ranking/multiplicador', [App\Http\Controllers\Admin\RankingPeriodController::class, 'setMultiplier']);

    // Reservas
    Route::get('/reservas', [App\Http\Controllers\Admin\ReservaController::class, 'index']);
    Route::patch('/reservas/{id}/status', [App\Http\Controllers\Admin\ReservaController::class, 'updateStatus']);
    Route::delete('/reservas/{id}', [App\Http\Controllers\Admin\ReservaController::class, 'destroy']);

    // Pedidos
    Route::get('/pedidos', [App\Http\Controllers\Admin\PedidoController::class, 'index']);
    Route::patch('/pedidos/{id}/status', [App\Http\Controllers\Admin\PedidoController::class, 'updateStatus']);
    Route::delete('/pedidos/{id}', [App\Http\Controllers\Admin\PedidoController::class, 'destroy']);

    // Recompensas
    Route::apiResource('recompensas', App\Http\Controllers\Admin\RecompensaController::class);
});
