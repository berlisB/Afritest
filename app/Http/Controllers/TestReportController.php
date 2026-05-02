<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\TestSession;
use App\Models\TestReport;
use App\Http\Requests\StoreTestReportRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;

class TestReportController extends Controller
{
    /**
     * Affiche le formulaire de création de rapport (React).
     */
    public function create(Application $application): Response|\Illuminate\Http\RedirectResponse
    {
        // On cherche la session du testeur pour cette application
        $session = TestSession::where('application_id', $application->id)
            ->where('tester_id', request()->user()->id)
            ->first();

        if (!$session) {
            return redirect()->route('applications.show', $application->id)
                ->with('error', 'Vous devez vous inscrire à ce test avant de soumettre un rapport.');
        }

        if ($session->status === 'completed') {
            return redirect()->route('applications.show', $application->id)
                ->with('error', 'Vous avez déjà soumis un rapport pour ce test.');
        }

        return Inertia::render('TestReports/Create', [
            'application' => $application,
            'testSession' => $session,
        ]);
    }

    /**
     * Enregistre le rapport complet en base de données.
     */
    public function store(StoreTestReportRequest $request, Application $application): RedirectResponse
    {
        $session = TestSession::where('application_id', $application->id)
            ->where('tester_id', $request->user()->id)
            ->where('status', 'in_progress')
            ->firstOrFail();

        // Gestion de l'upload des médias (Phase 1 basique)
        $mediaUrls = [];
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $path = $file->store('reports/media', 'public');
                $mediaUrls[] = Storage::url($path);
            }
        }

        // Créer le rapport
        $report = TestReport::create([
            'test_session_id' => $session->id,
            'environment' => [
                'device_model' => $request->device_model,
                'device_os' => $request->device_os,
                'browser' => $request->browser,
                'screen_size' => $request->screen_size,
                'connectivity' => $request->connectivity,
            ],
            'features_tested' => $request->features_tested ?? [],
            'bugs' => $request->bugs ?? [],
            'ux_feedback' => [
                'rating' => $request->rating,
                'notes' => $request->notes,
            ],
            'ratings' => ['overall' => $request->rating], // Rétrocompatibilité simple
            'media_urls' => $mediaUrls,
        ]);

        // Mettre à jour la session
        $session->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);

        // Notifier le développeur
        \App\Models\SiteNotification::create([
            'user_id' => $application->owner_id,
            'type' => 'report_submitted',
            'title' => 'Nouveau rapport reçu',
            'message' => "Un testeur a soumis un rapport pour votre application : " . $application->name,
            'data' => ['app_id' => $application->id, 'report_id' => $report->id]
        ]);

        // TODO: (Phase 2) Distribuer les récompenses/points au testeur

        return redirect()->route('dashboard.tester')
            ->with('success', 'Rapport soumis avec succès ! Merci pour votre contribution.');
    }

    /**
     * Affiche les détails d'un rapport de test spécifique.
     */
    public function show(Application $application, TestReport $report): Response
    {
        // On s'assure que le rapport appartient bien à l'application
        if ($report->testSession->application_id !== $application->id) {
            abort(404);
        }

        // Sécurité : Seul le proprio de l'app, l'admin ou le testeur peut voir
        $isOwner = $application->owner_id === auth()->id();
        $isTester = $report->testSession->tester_id === auth()->id();
        
        if (!$isOwner && !$isTester && !auth()->user()->is_admin) {
            abort(403);
        }

        $report->load(['testSession.tester']);

        return Inertia::render('TestReports/Show', [
            'application' => $application,
            'report' => $report,
        ]);
    }

    /**
     * Exporte un rapport de test en PDF.
     */
    public function export(TestReport $report)
    {
        // Seul le proprio de l'app, l'admin ou le testeur lui-même peut voir le PDF
        if (auth()->id() !== $report->application()->owner_id && 
            auth()->id() !== $report->tester()->id && 
            !auth()->user()->is_admin) {
            abort(403);
        }

        $pdf = Pdf::loadView('pdf.test_report', compact('report'));
        
        $filename = 'rapport_' . str_replace(' ', '_', strtolower($report->application()->name)) . '_' . $report->id . '.pdf';
        
        return $pdf->download($filename);
    }
}
