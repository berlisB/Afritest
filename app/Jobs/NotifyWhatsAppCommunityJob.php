<?php

namespace App\Jobs;

use App\Models\Application;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NotifyWhatsAppCommunityJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $application;

    /**
     * Create a new job instance.
     */
    public function __construct(Application $application)
    {
        $this->application = $application;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Récupération de la configuration (à définir dans config/services.php ou le .env)
        $apiUrl = config('services.whatsapp.api_url');
        $token = config('services.whatsapp.token');
        $groupId = config('services.whatsapp.community_group_id');

        if (!$apiUrl || !$token || !$groupId) {
            Log::warning("⚠️ WhatsApp API non configurée. Impossible de notifier la communauté pour l'app: " . $this->application->name);
            return;
        }

        $appName = $this->application->name;
        $platform = strtoupper($this->application->platform);
        $url = route('applications.show', $this->application->id);

        $message = "🚀 *Nouvelle Application à Tester !*\n\n";
        $message .= "📱 *App:* {$appName}\n";
        $message .= "💻 *Plateforme:* {$platform}\n";
        $message .= "✍️ *Description:* " . substr($this->application->description, 0, 150) . "...\n\n";
        $message .= "👉 Inscrivez-vous pour tester et gagner des points de réputation :\n{$url}\n\n";
        $message .= "_AfriTest - La plateforme de QA africaine_";

        try {
            // Exemple d'envoi via API type WATI ou Green API
            $response = Http::withToken($token)->post("{$apiUrl}/api/v1/sendSessionMessage", [
                'whatsappNumber' => $groupId,
                'messageText' => $message
            ]);

            if ($response->successful()) {
                Log::info("✅ Notification WhatsApp envoyée pour l'application: {$appName}");
            } else {
                Log::error("❌ Erreur lors de l'envoi WhatsApp: " . $response->body());
            }
        } catch (\Exception $e) {
            Log::error("🚨 Exception WhatsApp: " . $e->getMessage());
        }
    }
}
