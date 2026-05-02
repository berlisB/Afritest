<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable([
    'name', 'email', 'password', 'country', 'bio',
    'whatsapp', 'avatar', 'devices',
])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'devices' => 'array',
            'is_admin' => 'boolean',
            'score_tester' => 'integer',
            'score_dev' => 'integer',
        ];
    }

    /**
     * Applications soumises par l'utilisateur (en tant que dev).
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, 'owner_id');
    }

    /**
     * Sessions de test (en tant que tester).
     */
    public function testSessions(): HasMany
    {
        return $this->hasMany(TestSession::class, 'tester_id');
    }

    /**
     * Notifications de l'utilisateur.
     */
    public function appNotifications(): HasMany
    {
        return $this->hasMany(SiteNotification::class);
    }

    /**
     * Nombre de notifications non lues.
     */
    public function unreadNotificationsCount(): int
    {
        return $this->appNotifications()->where('is_read', false)->count();
    }
}
