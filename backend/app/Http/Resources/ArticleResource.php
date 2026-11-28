<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Hitung estimasi waktu baca (standar 200 kata per menit)
        $cleanText = strip_tags($this->content ?? '');
        $wordCount = str_word_count($cleanText);
        $readingMinutes = max(1, (int) ceil($wordCount / 200));

        // Format tanggal dalam Bahasa Indonesia
        $publishedAt = $this->published_at ? Carbon::parse($this->published_at)->locale('id') : null;

        // URL Cover Image Lengkap (dengan fallback placeholder jika null)
        $defaultPlaceholder = 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=1200&auto=format&fit=crop&q=80';
        $coverImageUrl = $defaultPlaceholder;

        if (!empty($this->cover_image)) {
            $coverImageUrl = filter_var($this->cover_image, FILTER_VALIDATE_URL)
                ? $this->cover_image
                : asset('storage/' . ltrim($this->cover_image, '/'));
        }

        $attributes = $this->resource?->getAttributes() ?? [];
        $loadedAuthor = $this->whenLoaded('author');
        $fallbackName = ($loadedAuthor && !($loadedAuthor instanceof \Illuminate\Http\Resources\MissingValue))
            ? ($loadedAuthor->name ?? null)
            : null;
        $fallbackRole = ($loadedAuthor && !($loadedAuthor instanceof \Illuminate\Http\Resources\MissingValue))
            ? ($loadedAuthor->role ?? null)
            : null;

        $authorName = !empty($attributes['author_name'])
            ? $attributes['author_name']
            : ($fallbackName ?: 'Admin Redaksi');
        $authorRole = !empty($attributes['author_role'])
            ? $attributes['author_role']
            : ($fallbackRole ?: 'Redaktur');

        return [
            'id'                   => $this->id,
            'title'                => $this->title,
            'slug'                 => $this->slug,
            'excerpt'              => $this->excerpt,
            'tags'                 => $attributes['tags'] ?? null,
            'content'              => $this->content,

            // URL Gambar Lengkap untuk kebutuhan Frontend domain terpisah
            'cover_image'          => $coverImageUrl,
            'cover_image_url'      => $coverImageUrl,

            'is_featured'          => (bool) $this->is_featured,
            'status'               => $this->status,
            'view_count'           => (int) $this->view_count,
            'author_name'          => $authorName,
            'author_role'          => $authorRole,

            // Waktu baca
            'reading_time'         => "{$readingMinutes} menit baca",
            'reading_time_minutes' => $readingMinutes,

            // Format tanggal Indonesia
            'published_at'         => $this->published_at?->toIso8601String(),
            'published_at_formatted' => $publishedAt?->translatedFormat('d F Y'),
            'published_at_human'   => $publishedAt?->diffForHumans(),

            'created_at'           => $this->created_at?->toIso8601String(),
            'created_at_formatted' => $this->created_at ? Carbon::parse($this->created_at)->locale('id')->translatedFormat('d F Y') : null,

            // Eager Loaded Relationships
            'category'             => new CategoryResource($this->whenLoaded('category')),
            'author'               => [
                'id'     => ($loadedAuthor && !($loadedAuthor instanceof \Illuminate\Http\Resources\MissingValue)) ? $loadedAuthor->id : ($this->user_id ?? 1),
                'name'   => $authorName,
                'role'   => $authorRole,
                'avatar' => ($loadedAuthor && !($loadedAuthor instanceof \Illuminate\Http\Resources\MissingValue) && $loadedAuthor->avatar)
                    ? asset('storage/' . $loadedAuthor->avatar)
                    : null,
                'bio'    => ($loadedAuthor && !($loadedAuthor instanceof \Illuminate\Http\Resources\MissingValue)) ? ($loadedAuthor->bio ?? null) : null,
            ],
        ];
    }
}
