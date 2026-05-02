<?php

namespace App\Http\Controllers;

use App\Models\SiteNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Liste les notifications de l'utilisateur.
     */
    public function index(Request $request): JsonResponse
    {
        $notifications = $request->user()->appNotifications()
            ->latest()
            ->take(20)
            ->get();

        return response()->json($notifications);
    }

    /**
     * Marque une notification comme lue.
     */
    public function markAsRead(SiteNotification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json(['success' => true]);
    }

    /**
     * Marque toutes les notifications comme lues.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        $request->user()->appNotifications()->where('is_read', false)->update(['is_read' => true]);

        return response()->json(['success' => true]);
    }
}
