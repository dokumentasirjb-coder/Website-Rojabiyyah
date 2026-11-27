<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    public const STATUS_DRAFT     = 'draft';
    public const STATUS_PUBLISHED = 'published';
    public const STATUS_ARCHIVED  = 'archived';

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'category_id',
        'user_id',
        'author_name',
        'author_role',
        'status',
        'is_featured',
        'published_at',
        'meta_title',
        'meta_description',
        'view_count',
    ];

    protected function casts(): array
    {
        return [
            'is_featured'  => 'boolean',
            'published_at' => 'datetime',
            'deleted_at'   => 'datetime',
            'view_count'   => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $article): void {
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }

            if (empty($article->excerpt) && $article->content) {
                $article->excerpt = Str::words(strip_tags($article->content), 30, '...');
            }
        });

        static::saving(function (self $article): void {
            if (
                $article->isDirty('status')
                && $article->status === self::STATUS_PUBLISHED
                && is_null($article->published_at)
            ) {
                $article->published_at = now();
            }
        });
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PUBLISHED)
                     ->whereNotNull('published_at')
                     ->where('published_at', '<=', now());
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function getCoverImageUrlAttribute(): string
    {
        if ($this->cover_image) {
            if (str_starts_with($this->cover_image, 'http://') || str_starts_with($this->cover_image, 'https://')) {
                return $this->cover_image;
            }
            $cleanPath = ltrim($this->cover_image, '/');
            if (str_starts_with($cleanPath, 'storage/')) {
                return url($cleanPath);
            }
            return asset('storage/' . $cleanPath);
        }

        return 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80';
    }
}
