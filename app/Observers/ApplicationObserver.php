<?php

namespace App\Observers;

use App\Models\Application;

class ApplicationObserver
{
    /**
     * Handle the Application "created" event.
     */
    public function created(Application $application): void
    {
        // Si elle est publiée directement, on donne 20 points au développeur
        if ($application->status === 'published') {
            $application->owner->increment('score_dev', 20);
        }
    }

    /**
     * Handle the Application "updated" event.
     */
    public function updated(Application $application): void
    {
        // Si le statut passe de draft à published
        if ($application->isDirty('status') && $application->status === 'published') {
            $application->owner->increment('score_dev', 20);
        }
    }
}
