<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TestSession extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_id',
        'tester_id',
        'assigned_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'assigned_at' => 'datetime',
        ];
    }

    /**
     * L'application testée.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Le tester assigné.
     */
    public function tester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tester_id');
    }

    /**
     * Le rapport de test associé.
     */
    public function testReport(): HasOne
    {
        return $this->hasOne(TestReport::class);
    }

    /**
     * Vérifie si un rapport a été soumis.
     */
    public function hasReport(): bool
    {
        return $this->testReport()->exists();
    }
}
