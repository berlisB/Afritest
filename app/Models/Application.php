<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Facades\Storage;

class Application extends Model
{
    use HasFactory;

    protected $appends = ['logo_url'];

    protected $fillable = [
        'owner_id',
        'name',
        'type',
        'platform',
        'url',
        'apk_url',
        'store_link',
        'description',
        'test_scope',
        'test_credentials',
        'google_tester_emails',
        'logo',
        'is_open',
        'is_vibe_coded',
        'status',
        'expected_testers',
        'deadline',
        'suspension_reason',
    ];

    protected function casts(): array
    {
        return [
            'test_scope' => 'array',
            'test_credentials' => 'array',
            'is_open' => 'boolean',
            'deadline' => 'datetime',
            'expected_testers' => 'integer',
        ];
    }

    /**
     * Propriétaire de l'app (le dev qui l'a soumise).
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Sessions de test liées à cette app.
     */
    public function testSessions(): HasMany
    {
        return $this->hasMany(TestSession::class);
    }

    /**
     * Rapports de test via les sessions.
     */
    public function testReports(): HasManyThrough
    {
        return $this->hasManyThrough(TestReport::class, TestSession::class);
    }

    /**
     * Nombre de testers inscrits.
     */
    public function enrolledTestersCount(): int
    {
        return $this->testSessions()->count();
    }

    /**
     * Nombre de rapports soumis.
     */
    public function submittedReportsCount(): int
    {
        return $this->testReports()->count();
    }

    /**
     * Vérifie si un utilisateur est le propriétaire.
     */
    public function isOwnedBy(User $user): bool
    {
        return $this->owner_id === $user->id;
    }

    /**
     * Vérifie si l'app est ouverte aux inscriptions.
     */
    public function isOpenForEnrollment(): bool
    {
        return $this->is_open
            && in_array($this->status, ['published', 'in_progress'])
            && ($this->deadline === null || $this->deadline->isFuture());
    }

    /**
     * Scope: uniquement les apps publiées.
     */
    public function scopePublished($query)
    {
        return $query->whereIn('status', ['published', 'in_progress']);
    }

    /**
     * Get the full URL for the application logo.
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo) {
            return null;
        }

        return Storage::url($this->logo);
    }
}
