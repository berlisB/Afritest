<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\TestSession;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class TestSessionController extends Controller
{
    /**
     * Inscrit le testeur courant à une application.
     */
    public function store(Request $request, Application $application): RedirectResponse
    {
        // Vérifier que l'application est ouverte
        if (!$application->is_open || $application->status !== 'published') {
            return back()->with('error', 'Cette application n\'accepte pas de nouveaux testeurs.');
        }

        // Vérifier si déjà inscrit
        if ($application->testSessions()->where('tester_id', $request->user()->id)->exists()) {
            return back()->with('error', 'Vous participez déjà à ce test.');
        }

        // Créer la session
        TestSession::create([
            'application_id' => $application->id,
            'tester_id' => $request->user()->id,
            'status' => 'in_progress',
            'assigned_at' => now(),
            'accepted_at' => now(),
        ]);

        return redirect()->route('applications.show', $application->id)
            ->with('success', 'Inscription réussie ! Vous pouvez maintenant commencer le test.');
    }

    /**
     * Accepte une invitation de test.
     */
    public function accept(TestSession $session): RedirectResponse
    {
        if ($session->tester_id !== auth()->id()) abort(403);

        $session->update([
            'status' => 'in_progress',
            'accepted_at' => now()
        ]);

        return back()->with('success', 'Invitation acceptée !');
    }

    /**
     * Refuse une invitation de test.
     */
    public function decline(Request $request, TestSession $session): RedirectResponse
    {
        if ($session->tester_id !== auth()->id()) abort(403);

        $session->update([
            'status' => 'declined',
            'declined_at' => now(),
            'decline_reason' => $request->reason
        ]);

        return back()->with('success', 'Invitation refusée.');
    }
}
