<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    // Récupérer les 3 meilleures applications (basé sur le nombre de testeurs)
    $topApps = \App\Models\Application::where('status', 'published')
        ->withCount('testSessions')
        ->orderBy('test_sessions_count', 'desc')
        ->take(3)
        ->get();

    // Récupérer les 3 meilleurs testeurs (basé sur le nombre de tests complétés)
    $topTesters = \App\Models\User::withCount(['testSessions' => function ($query) {
            $query->where('status', 'completed');
        }])
        ->orderBy('test_sessions_count', 'desc')
        ->take(3)
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'topApps' => $topApps,
        'topTesters' => $topTesters,
    ]);
});

Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Dashboard spécifique testeur (optionnel pour l'instant on fait tout sur /dashboard)
Route::get('/dashboard/tester', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard.tester');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Gestion des Applications
    Route::resource('applications', ApplicationController::class);
    Route::post('/applications/{application}/assign', [ApplicationController::class, 'assignTesters'])->name('applications.assign');
    Route::delete('/applications/{application}/testers/{tester}', [ApplicationController::class, 'removeTester'])->name('applications.remove-tester');
    Route::get('/applications/{application}/export', [ApplicationController::class, 'exportTesters'])->name('applications.export');
    Route::post('/applications/{application}/regenerate-tester-emails', [ApplicationController::class, 'regenerateTesterEmails'])->name('applications.regenerate-tester-emails');
    
    // Recherche utilisateurs (API-like)
    Route::get('/users/search', [UserController::class, 'search'])->name('users.search');

    // Inscription au test
    Route::post('/applications/{application}/enroll', [\App\Http\Controllers\TestSessionController::class, 'store'])->name('test_sessions.store');
    Route::post('/test-sessions/{session}/accept', [\App\Http\Controllers\TestSessionController::class, 'accept'])->name('test_sessions.accept');
    Route::post('/test-sessions/{session}/decline', [\App\Http\Controllers\TestSessionController::class, 'decline'])->name('test_sessions.decline');

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');

    // Soumission et consultation du rapport de test
    Route::get('/applications/{application}/report/create', [\App\Http\Controllers\TestReportController::class, 'create'])->name('test_reports.create');
    Route::post('/applications/{application}/report', [\App\Http\Controllers\TestReportController::class, 'store'])->name('test_reports.store');
    Route::get('/applications/{application}/reports/{report}', [\App\Http\Controllers\TestReportController::class, 'show'])->name('test_reports.show');
    Route::get('/reports/{report}/pdf', [\App\Http\Controllers\TestReportController::class, 'export'])->name('test_reports.pdf');

    // Routes Admin
    Route::middleware(\App\Http\Middleware\IsAdmin::class)->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\AdminController::class, 'index'])->name('dashboard');
        Route::post('/applications/{application}/status', [\App\Http\Controllers\AdminController::class, 'updateAppStatus'])->name('applications.update-status');
    });
});

require __DIR__.'/auth.php';
