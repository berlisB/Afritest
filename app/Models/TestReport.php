<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'test_session_id',
        'device_model',
        'device_os',
        'screen_size',
        'environment',
        'browser',
        'connectivity',
        'features_tested',
        'bugs',
        'rating',
        'notes',
        'screenshots',
        'submitted_at',
    ];

    protected function casts(): array
    {
        return [
            'features_tested' => 'array',
            'bugs' => 'array',
            'screenshots' => 'array',
            'rating' => 'integer',
            'submitted_at' => 'datetime',
        ];
    }

    /**
     * La session de test associée.
     */
    public function testSession(): BelongsTo
    {
        return $this->belongsTo(TestSession::class);
    }

    /**
     * Le tester qui a soumis le rapport (via session).
     */
    public function tester()
    {
        return $this->testSession->tester;
    }

    /**
     * L'application testée (via session).
     */
    public function application()
    {
        return $this->testSession->application;
    }

    /**
     * Nombre de bugs trouvés.
     */
    public function bugsCount(): int
    {
        return is_array($this->bugs) ? count($this->bugs) : 0;
    }

    /**
     * Nombre de bugs critiques.
     */
    public function criticalBugsCount(): int
    {
        if (!is_array($this->bugs)) return 0;

        return collect($this->bugs)
            ->where('severity', 'critical')
            ->count();
    }
}
