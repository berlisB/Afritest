<?php

namespace App\Observers;

use App\Models\TestReport;

class TestReportObserver
{
    /**
     * Handle the TestReport "created" event.
     */
    public function created(TestReport $testReport): void
    {
        // Lorsqu'un rapport est soumis, on donne 50 points au testeur
        $testReport->loadMissing('testSession.tester');
        
        if ($testReport->testSession && $testReport->testSession->tester) {
            $testReport->testSession->tester->increment('score_tester', 50);
        }
    }
}
