<?php

namespace App\Services;

use App\Models\Article;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class ArticleService
{
    /**
     * Ambil 1 artikel berita utama (Hero / is_featured = true).
     * Jika tidak ada yang ditandai featured, ambil artikel terbitan paling mutakhir.
     */
    public function getFeaturedHero(): ?Article
    {
        return Article::published()
            ->with(['category', 'author'])
            ->where('is_featured', true)
            ->latest('published_at')
            ->first()
            ?? Article::published()
                ->with(['category', 'author'])
                ->latest('published_at')
                ->first();
    }

    /**
     * Ambil 2 artikel sorotan berikutnya (highlight).
     */
    public function getFeaturedSecondary(?int $excludeId = null, int $limit = 2): Collection
    {
        $query = Article::published()
            ->with(['category', 'author']);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        // Prioritaskan artikel featured lainnya, lalu yang terbaru
        return $query->orderByDesc('is_featured')
            ->latest('published_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Ambil daftar berita terbaru (default 6 berita).
     */
    public function getLatestArticles(array $excludeIds = [], int $limit = 6): Collection
    {
        $query = Article::published()
            ->with(['category', 'author']);

        if (!empty($excludeIds)) {
            $query->whereNotIn('id', $excludeIds);
        }

        return $query->latest('published_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Ambil daftar artikel dengan filter kategori, pencarian, dan paginasi (9 item per halaman).
     */
    public function getPaginatedArticles(array $filters = [], int $perPage = 9): LengthAwarePaginator
    {
        $query = Article::published()
            ->with(['category', 'author']);

        // Filter berdasarkan slug kategori
        if (!empty($filters['category'])) {
            $query->whereHas('category', function ($q) use ($filters) {
                $q->where('slug', $filters['category']);
            });
        }

        // Pencarian teks penuh pada judul, excerpt, dan konten
        if (!empty($filters['search'])) {
            $searchTerm = '%' . trim($filters['search']) . '%';
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'like', $searchTerm)
                  ->orWhere('excerpt', 'like', $searchTerm)
                  ->orWhere('content', 'like', $searchTerm);
            });
        }

        return $query->latest('published_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Ambil detail artikel berdasarkan slug beserta relasinya.
     */
    public function getBySlug(string $slug): Article
    {
        return Article::published()
            ->with(['category', 'author'])
            ->where('slug', $slug)
            ->firstOrFail();
    }

    /**
     * Ambil 3 artikel terkait dalam kategori yang sama.
     */
    public function getRelatedArticles(Article $article, int $limit = 3): Collection
    {
        return Article::published()
            ->with(['category', 'author'])
            ->where('category_id', $article->category_id)
            ->where('id', '!=', $article->id)
            ->latest('published_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Tingkatkan jumlah pembaca (view_count) secara atomik.
     */
    public function incrementViews(Article $article): void
    {
        $article->increment('view_count');
    }
}
