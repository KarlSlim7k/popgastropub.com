<?php

use App\Http\Controllers\Admin\ConfiguracionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DrinkTypeController;
use App\Http\Controllers\Admin\LoyaltyConfigController;
use App\Http\Controllers\Admin\MailTestController;
use App\Http\Controllers\Admin\MesaController;
use App\Http\Controllers\Admin\MeseroController;
use App\Http\Controllers\Admin\PuntosController;
use App\Http\Controllers\Admin\RankingPeriodController;
use App\Http\Controllers\Admin\StaffSaleController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\UsuarioController;
use App\Http\Controllers\Auth0Controller;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CspReportController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\LoyaltyController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MeseroRatingController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\PromocionController;
use App\Http\Controllers\PublicImageController;
use App\Http\Controllers\PushNotificationController;
use App\Http\Controllers\RankingController;
use App\Http\Controllers\RecompensaController;
use App\Http\Controllers\ReferralController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\Staff\StaffAnalyticsController;
use App\Http\Controllers\Staff\StaffConfigController;
use App\Http\Controllers\Staff\StaffDashboardController;
use App\Http\Controllers\Staff\StaffMenuController;
use App\Http\Controllers\Staff\StaffNotificationController;
use App\Http\Controllers\Staff\StaffRankingController;
use App\Http\Controllers\Staff\StaffReservaController;
use App\Http\Controllers\Staff\TicketGeneratorController;
use App\Http\Controllers\TicketRedeemController;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\UbicacionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/menu', [MenuController::class, 'index']);
Route::get('/menu/{id}', [MenuController::class, 'show']);
Route::get('/promociones', [PromocionController::class, 'index']);
Route::get('/promociones/{slug}', [PromocionController::class, 'show']);
Route::post('/promociones/{slug}/lead', [PromocionController::class, 'lead'])->middleware('throttle:6,1');
Route::post('/promociones/{slug}/click', [PromocionController::class, 'click'])->middleware('throttle:30,1');
Route::post('/promociones/{slug}/view', [PromocionController::class, 'view'])->middleware('throttle:30,1');
Route::get('/storage/{path}', [PublicImageController::class, 'show'])->where('path', '.*');
Route::get('/ubicacion', [UbicacionController::class, 'show']);
Route::get('/tickets/validate', [TicketRedeemController::class, 'validate'])
    ->middleware('throttle:tickets');

// Public loyalty + rewards (landing POP Points)
Route::get('/loyalty/tiers', [App\Http\Controllers\Public\LoyaltyController::class, 'tiers']);
Route::get('/loyalty/point-actions', [App\Http\Controllers\Public\LoyaltyController::class, 'pointActions']);
Route::get('/recompensas', [RecompensaController::class, 'index']);

// Public reservation (works with or without auth - controller checks $request->user())
Route::post('/reservas/public', [ReservaController::class, 'store'])->middleware('throttle:6,1');

// Public push key
Route::get('/push/vapid-public-key', [PushNotificationController::class, 'vapidPublicKey']);

// CSP violation reports (Report-Only, telemetría V3-07)
Route::post('/csp-report', [CspReportController::class, 'store'])
    ->middleware('throttle:csp-report');

// Newsletter subscription (landing footer + opt-out links)
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe'])
    ->middleware('throttle:6,1');
Route::post('/newsletter/unsubscribe', [NewsletterController::class, 'unsubscribe'])
    ->middleware('throttle:6,1');

/*
|--------------------------------------------------------------------------
| Auth Routes (Sanctum)
|--------------------------------------------------------------------------
*/

Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:auth-register');
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:auth-login');
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:auth-password-reset');
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:auth-password-reset');
Route::get('/auth/social/providers', [SocialAuthController::class, 'providers']);
Route::get('/auth/social/{provider}/redirect', [SocialAuthController::class, 'redirectToProvider'])
    ->whereIn('provider', ['google', 'facebook', 'x'])
    ->middleware(['web', 'throttle:auth-social']);
Route::get('/auth/social/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback'])
    ->whereIn('provider', ['google', 'facebook', 'x'])
    ->middleware(['web', 'throttle:auth-social']);
Route::post('/auth/2fa/verify', [TwoFactorController::class, 'verify'])->middleware('throttle:auth-login');
Route::post('/auth/auth0/callback', [Auth0Controller::class, 'callback'])
    ->middleware('throttle:auth-login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', 'token.full'])->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'changePassword']);

    // 2FA
    Route::get('/auth/2fa/status', [TwoFactorController::class, 'status']);
    Route::post('/auth/2fa/setup', [TwoFactorController::class, 'setup']);
    Route::post('/auth/2fa/enable', [TwoFactorController::class, 'enable']);
    Route::post('/auth/2fa/disable', [TwoFactorController::class, 'disable']);
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Authenticated)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'token.full'])->group(function () {
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
    Route::get('/referidos', [ReferralController::class, 'index']);

    // Reservas
    Route::get('/reservas', [ReservaController::class, 'index']);
    Route::post('/reservas', [ReservaController::class, 'store']);
    Route::patch('/reservas/{id}/cancel', [ReservaController::class, 'cancel']);

    // Recompensas
    Route::get('/recompensas/historial', [RecompensaController::class, 'history']);
    Route::post('/recompensas/{id}/canjear', [RecompensaController::class, 'redeem']);

    // Tickets — canje de puntos por QR
    Route::post('/tickets/redeem', [TicketRedeemController::class, 'redeem'])
        ->middleware('throttle:tickets');

    // Mesero ratings (client → waiter)
    Route::get('/meseros/para-calificar', [MeseroRatingController::class, 'meseros']);
    Route::post('/meseros/calificar', [MeseroRatingController::class, 'store']);

    // Push notifications
    Route::post('/push/subscribe', [PushNotificationController::class, 'subscribe']);
    Route::post('/push/unsubscribe', [PushNotificationController::class, 'unsubscribe']);
});

/*
|--------------------------------------------------------------------------
| Staff Routes (mesero role)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'token.full', 'role:mesero,admin', 'throttle:admin-api'])->group(function () {
    Route::get('/ranking', [RankingController::class, 'index']);
    Route::get('/ranking/history', [RankingController::class, 'history']);
    Route::get('/ranking/drink-types', [RankingController::class, 'drinkTypes']);
});

Route::middleware(['auth:sanctum', 'token.full', 'role:mesero', 'throttle:admin-api'])
    ->post('/ranking/points', [RankingController::class, 'addPoints']);

Route::middleware(['auth:sanctum', 'token.full', 'role:mesero,admin', 'throttle:admin-api'])->prefix('staff')->group(function () {
    Route::get('/dashboard', [StaffDashboardController::class, 'index']);
    Route::get('/analytics', [StaffAnalyticsController::class, 'index']);
    Route::get('/reservas', [StaffReservaController::class, 'index']);
    Route::patch('/reservas/{id}/status', [StaffReservaController::class, 'updateStatus']);
    Route::get('/menu', [StaffMenuController::class, 'index']);
    Route::patch('/menu/{id}/disponibilidad', [StaffMenuController::class, 'toggleDisponibilidad']);
    Route::get('/mi-ranking', [StaffRankingController::class, 'miRanking']);
    Route::get('/configuracion', [StaffConfigController::class, 'index']);
    Route::put('/configuracion', [StaffConfigController::class, 'update']);
    Route::post('/tickets/validate', [TicketGeneratorController::class, 'validar']);
    Route::post('/tickets/generate', [TicketGeneratorController::class, 'generate']);
    Route::get('/tickets', [TicketGeneratorController::class, 'historial']);

    // Notifications
    Route::get('/notificaciones', [StaffNotificationController::class, 'index']);
    Route::get('/notificaciones/count', [StaffNotificationController::class, 'unreadCount']);
    Route::post('/notificaciones/read', [StaffNotificationController::class, 'markRead']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes (admin role)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'token.full', 'role:admin', 'throttle:admin-api'])->prefix('admin')->group(function () {
    Route::get('/staff-sales', [StaffSaleController::class, 'index']);
    Route::patch('/staff-sales/{sale}/approve', [StaffSaleController::class, 'approve']);
    Route::patch('/staff-sales/{sale}/reject', [StaffSaleController::class, 'reject']);
    // Upload
    Route::post('/upload', [UploadController::class, 'store']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/chart-data', [DashboardController::class, 'chartData']);
    Route::get('/dashboard/sales-mix', [DashboardController::class, 'salesMix']);
    Route::get('/dashboard/top-waiters', [DashboardController::class, 'topWaiters']);
    Route::get('/dashboard/live-menu', [DashboardController::class, 'liveMenu']);

    // Puntos POP
    Route::get('/puntos/stats', [PuntosController::class, 'stats']);
    Route::get('/puntos/tiers', [PuntosController::class, 'tiers']);
    Route::post('/puntos/tiers', [PuntosController::class, 'storeTier']);
    Route::put('/puntos/tiers/{id}', [PuntosController::class, 'updateTier']);
    Route::delete('/puntos/tiers/{id}', [PuntosController::class, 'destroyTier']);
    Route::post('/puntos/tiers/reorder', [PuntosController::class, 'reorderTiers']);

    Route::get('/puntos/actions', [PuntosController::class, 'pointActions']);
    Route::post('/puntos/actions', [PuntosController::class, 'storePointAction']);
    Route::put('/puntos/actions/{id}', [PuntosController::class, 'updatePointAction']);
    Route::delete('/puntos/actions/{id}', [PuntosController::class, 'destroyPointAction']);
    Route::post('/puntos/actions/reorder', [PuntosController::class, 'reorderPointActions']);

    Route::get('/puntos/top-members', [PuntosController::class, 'topMembers']);
    Route::get('/puntos/activity', [PuntosController::class, 'activity']);
    Route::post('/puntos/redeem', [PuntosController::class, 'redeem']);
    Route::post('/puntos/adjust', [PuntosController::class, 'adjustPoints']);

    // Configuración
    Route::get('/configuracion', [ConfiguracionController::class, 'index']);
    Route::put('/configuracion', [ConfiguracionController::class, 'update']);

    // Loyalty config (business constants)
    Route::get('/loyalty-config', [LoyaltyConfigController::class, 'index']);
    Route::put('/loyalty-config', [LoyaltyConfigController::class, 'update']);

    // Menu CRUD
    Route::apiResource('menu', App\Http\Controllers\Admin\MenuController::class);

    // Drink Types CRUD
    Route::apiResource('drink-types', DrinkTypeController::class);
    Route::post('/drink-types/reorder', [DrinkTypeController::class, 'reorder']);

    // Promociones CRUD
    Route::post('/promociones/{id}/publish', [App\Http\Controllers\Admin\PromocionController::class, 'publish']);
    Route::post('/promociones/{id}/unpublish', [App\Http\Controllers\Admin\PromocionController::class, 'unpublish']);
    Route::get('/promociones/{id}/metrics', [App\Http\Controllers\Admin\PromocionController::class, 'metrics']);
    Route::get('/promociones/{id}/leads', [App\Http\Controllers\Admin\PromocionController::class, 'leads']);
    Route::get('/promociones/{id}/leads.csv', [App\Http\Controllers\Admin\PromocionController::class, 'leadsCsv']);
    Route::apiResource('promociones', App\Http\Controllers\Admin\PromocionController::class);

    // Facturas management
    Route::get('/facturas', [App\Http\Controllers\Admin\FacturaController::class, 'index']);
    Route::get('/facturas/{id}', [App\Http\Controllers\Admin\FacturaController::class, 'show']);
    Route::get('/facturas/{id}/ticket', [App\Http\Controllers\Admin\FacturaController::class, 'ticket']);
    Route::patch('/facturas/{id}/status', [App\Http\Controllers\Admin\FacturaController::class, 'updateStatus']);
    Route::post('/facturas/{id}/retry-accountant-email', [App\Http\Controllers\Admin\FacturaController::class, 'retryAccountantEmail']);
    Route::get('/facturas/{id}/log', [App\Http\Controllers\Admin\FacturaController::class, 'statusLog']);

    // Usuarios CRUD
    Route::apiResource('usuarios', UsuarioController::class);
    Route::get('/usuarios-export', [UsuarioController::class, 'export']);

    // Meseros CRUD
    Route::apiResource('meseros', MeseroController::class);
    Route::post('/meseros/{id}/adjust-points', [MeseroController::class, 'adjustPoints']);
    Route::get('/meseros/{id}/points-log', [MeseroController::class, 'pointsLog']);

    // Ranking Periods
    Route::get('/ranking/periodos', [RankingPeriodController::class, 'index']);
    Route::post('/ranking/rotar', [RankingPeriodController::class, 'rotate']);
    Route::post('/ranking/multiplicador', [RankingPeriodController::class, 'setMultiplier']);

    // Reservas
    Route::get('/reservas', [App\Http\Controllers\Admin\ReservaController::class, 'index']);
    Route::get('/reservas/disponibilidad', [App\Http\Controllers\Admin\ReservaController::class, 'disponibilidad']);
    Route::patch('/reservas/{id}/status', [App\Http\Controllers\Admin\ReservaController::class, 'updateStatus']);
    Route::delete('/reservas/{id}', [App\Http\Controllers\Admin\ReservaController::class, 'destroy']);

    // Mesas CRUD
    Route::apiResource('mesas', MesaController::class);

    // Recompensas
    Route::apiResource('recompensas', App\Http\Controllers\Admin\RecompensaController::class);

    // Mail diagnostics
    Route::post('/mail/test', [MailTestController::class, 'send']);
    Route::get('/mail/config', [MailTestController::class, 'config']);

    // Newsletter (Resend)
    Route::get('/newsletter', [App\Http\Controllers\Admin\NewsletterController::class, 'index']);
    Route::get('/newsletter/subscribers', [App\Http\Controllers\Admin\NewsletterController::class, 'subscribers']);
    Route::get('/newsletter/broadcasts', [App\Http\Controllers\Admin\NewsletterController::class, 'broadcasts']);
    Route::post('/newsletter/broadcasts', [App\Http\Controllers\Admin\NewsletterController::class, 'storeBroadcast']);
    Route::get('/newsletter/broadcasts/{id}', [App\Http\Controllers\Admin\NewsletterController::class, 'showBroadcast']);
    Route::post('/newsletter/broadcasts/{id}/send', [App\Http\Controllers\Admin\NewsletterController::class, 'sendBroadcast']);
    Route::delete('/newsletter/broadcasts/{id}', [App\Http\Controllers\Admin\NewsletterController::class, 'destroyBroadcast']);
});
