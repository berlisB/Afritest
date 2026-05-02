<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class AdminController extends Controller
{
    /**
     * Affiche le tableau de bord principal de l'administration.
     */
    public function index()
    {
        $stats = [
            'total_users' => User::count(),
            'total_apps' => Application::count(),
            'published_apps' => Application::where('status', 'published')->count(),
            'suspended_apps' => Application::where('status', 'suspended')->count(),
            'vibe_coded_apps' => Application::where('is_vibe_coded', '!=', 'no')->count(),
        ];

        // On charge les 10 dernières apps avec les testeurs comptés
        $recentApps = Application::with('owner')
            ->withCount('testSessions')
            ->latest()
            ->take(10)
            ->get();
            
        $recentUsers = User::latest()->take(10)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentApps' => $recentApps,
            'recentUsers' => $recentUsers,
        ]);
    }

    /**
     * Change le statut d'une application (Modération).
     */
    public function updateAppStatus(Request $request, Application $application): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:draft,published,in_progress,completed,suspended',
            'reason' => 'nullable|string|max:1000'
        ]);

        $application->update([
            'status' => $request->status,
            'suspension_reason' => $request->status === 'suspended' ? $request->reason : null
        ]);

        // Notifier le propriétaire
        $statusMsg = $request->status === 'suspended' ? 'suspendue' : 'mise à jour';
        \App\Models\SiteNotification::create([
            'user_id' => $application->owner_id,
            'type' => 'app_status_updated',
            'title' => "Statut de votre application : {$application->name}",
            'message' => "Votre application est désormais {$statusMsg}." . ($request->reason ? " Motif : " . $request->reason : ""),
            'data' => ['app_id' => $application->id, 'status' => $request->status]
        ]);

        return back()->with('success', "Le statut de l'application {$application->name} a été mis à jour.");
    }
}
