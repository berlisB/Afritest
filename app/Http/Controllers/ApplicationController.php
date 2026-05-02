<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Http\Requests\StoreApplicationRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class ApplicationController extends Controller
{
    /**
     * Affiche la liste des applications publiées.
     */
    public function index(): Response
    {
        // On récupère uniquement les apps publiées, avec les infos de leur propriétaire
        $applications = Application::with('owner:id,name,country')
            ->published()
            ->withCount('testSessions')
            ->latest()
            ->get();

        return Inertia::render('Applications/Index', [
            'applications' => $applications,
        ]);
    }

    /**
     * Affiche le formulaire de soumission (multi-step React gère les étapes).
     */
    public function create(): Response
    {
        return Inertia::render('Applications/Create');
    }

    /**
     * Enregistre une nouvelle application.
     */
    public function store(StoreApplicationRequest $request): RedirectResponse
    {
        $data = $request->validated();
        
        // Gestion de l'upload du logo
        if ($request->hasFile('logo_file')) {
            $path = $request->file('logo_file')->store('apps/logos', 'public');
            $data['logo'] = '/storage/' . $path;
        }

        // Gestion du fichier d'exigences
        if ($request->hasFile('requirements_file')) {
            $path = $request->file('requirements_file')->store('apps/requirements', 'public');
            $data['requirements_file'] = '/storage/' . $path;
        }

        $application = $request->user()->applications()->create($data);

        // Peuplement automatique des emails Google Play si c'est une app mobile (ou Android)
        if ($application->type === 'mobile_app' || in_array($application->platform, ['android', 'both'])) {
            $application->google_tester_emails = \App\Services\TesterPool::getRandomEmails($application->expected_testers ?? 14);
            $application->save();
        }

        // Si l'utilisateur a choisi de publier immédiatement
        if ($application->status === 'published') {
            \App\Jobs\NotifyWhatsAppCommunityJob::dispatch($application);
            
            return redirect()->route('applications.show', $application->id)
                ->with('success', 'Application soumise et publiée avec succès !');
        }

        // Sinon, c'est un brouillon
        return redirect()->route('dashboard')
            ->with('success', 'Brouillon sauvegardé.');
    }

    /**
     * Affiche les détails d'une application spécifique.
     */
    public function show(Application $application): Response
    {
        $user = request()->user();
        $isOwner = $application->owner_id === $user->id;
        $isAdmin = $user->is_admin ?? false;
        
        // Vérification de l'inscription / assignation
        $session = $application->testSessions()->where('tester_id', $user->id)->first();
        $isEnrolled = $session !== null;

        // Restriction pour les tests fermés
        if (!$application->is_open && !$isOwner && !$isAdmin && !$isEnrolled) {
            abort(403, "Cette application est en mode test fermé. Vous n'avez pas encore été invité.");
        }

        // On charge le propriétaire et les testeurs/rapports si c'est le proprio qui regarde
        $application->load('owner');
        if ($isOwner || $isAdmin) {
            $application->load(['testSessions.tester', 'testSessions.testReport']);
        }

        return Inertia::render('Applications/Show', [
            'application' => $application,
            'isOwner' => $isOwner,
            'isEnrolled' => $isEnrolled,
            'session' => $session,
        ]);
    }

    /**
     * Assigne manuellement des testeurs à une application (tests fermés).
     */
    public function assignTesters(Request $request, Application $application): RedirectResponse
    {
        if ($application->owner_id !== $request->user()->id && !$request->user()->is_admin) {
            abort(403);
        }

        $request->validate([
            'tester_ids' => 'required|array',
            'tester_ids.*' => 'exists:users,id'
        ]);

        foreach ($request->tester_ids as $testerId) {
            $application->testSessions()->updateOrCreate(
                ['tester_id' => $testerId],
                ['assigned_at' => now(), 'status' => 'pending']
            );

            // Créer une notification pour le testeur
            \App\Models\SiteNotification::create([
                'user_id' => $testerId,
                'type' => 'test_assigned',
                'title' => 'Nouvelle mission de test',
                'message' => "Vous avez été invité à tester l'application : " . $application->name,
                'data' => ['app_id' => $application->id]
            ]);
        }

        return back()->with('success', count($request->tester_ids) . ' testeurs assignés avec succès.');
    }

    /**
     * Retire un testeur d'une application.
     */
    public function removeTester(Request $request, Application $application, \App\Models\User $tester): RedirectResponse
    {
        if ($application->owner_id !== $request->user()->id && !$request->user()->is_admin) {
            abort(403);
        }

        $application->testSessions()->where('tester_id', $tester->id)->delete();

        return back()->with('success', 'Testeur retiré de la session.');
    }

    /**
     * Exporte la liste des testeurs (format CSV) pour Google Play Console ou TestFlight.
     */
    public function exportTesters(Application $application)
    {
        // Seul le propriétaire ou un admin peut exporter
        if ($application->owner_id !== request()->user()->id && !request()->user()->is_admin) {
            abort(403, 'Action non autorisée.');
        }

        $testers = $application->testSessions()->with('tester')->get()->pluck('tester');

        $csvFileName = 'testers_' . str_replace(' ', '_', strtolower($application->name)) . '.csv';
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=$csvFileName",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $callback = function() use($testers) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Name', 'Email', 'Country', 'Tester Score']);

            foreach ($testers as $tester) {
                if ($tester) {
                    fputcsv($file, [$tester->name, $tester->email, $tester->country, $tester->score_tester]);
                }
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Régénère la liste des emails de testeurs Google Play.
     */
    public function regenerateTesterEmails(Application $application): RedirectResponse
    {
        if ($application->owner_id !== request()->user()->id && !request()->user()->is_admin) {
            abort(403);
        }

        $application->google_tester_emails = \App\Services\TesterPool::getRandomEmails($application->expected_testers ?? 14);
        $application->save();

        return back()->with('success', 'La liste des emails a été mise à jour.');
    }
}
