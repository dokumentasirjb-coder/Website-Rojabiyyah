<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, SoftDeletes;

    public const TYPE_ANNOUNCEMENT = 'announcement';
    public const TYPE_EVENT        = 'event';
    public const TYPE_AGENDA       = 'agenda';

    protected $fillable = [
        'title',
        'content',
        'event_date',
        'event_time',
        'location',
        'type',
        'is_active',
        'is_pinned',
        'expires_at',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'is_active'  => 'boolean',
            'is_pinned'  => 'boolean',
            'expires_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_active', true)
                     ->where(function (Builder $q): void {
                         $q->whereNull('expires_at')
                           ->orWhere('expires_at', '>', now());
                     });
    }

    public function scopeUpcomingEvents(Builder $query): Builder
    {
        return $query->where('type', self::TYPE_EVENT)
                     ->where('event_date', '>=', today())
                     ->orderBy('event_date');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getTypeLabelAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_EVENT  => 'Acara',
            self::TYPE_AGENDA => 'Agenda',
            default           => 'Pengumuman',
        };
    }
}
