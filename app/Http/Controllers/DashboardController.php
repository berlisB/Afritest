<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Statistiques Développeur
        $myApps = $user->applications()->withCount('testSessions')->latest()->take(3)->get();
        $totalApps = $user->applications()->count();

        // Statistiques Testeur
        $myTests = $user->testSessions()->whereIn('status', ['in_progress', 'done'])->with('application')->latest()->take(5)->get();
        $invitations = $user->testSessions()->where('status', 'pending')->with('application')->latest()->get();
        
        $totalTests = $user->testSessions()->whereIn('status', ['in_progress', 'done', 'completed'])->count();
        $completedTests = $user->testSessions()->where('status', 'completed')->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'developer' => [
                    'total_apps' => $totalApps,
                    'recent_apps' => $myApps,
                ],
                'tester' => [
                    'total_tests' => $totalTests,
                    'completed_tests' => $completedTests,
                    'recent_tests' => $myTests,
                    'invitations' => $invitations,
                ]
            ]
        ]);
    }
}
