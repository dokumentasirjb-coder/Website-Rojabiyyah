<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Services\ArticleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Schema;

class ArticleController extends Controller
{
    public function __construct(
        protected ArticleService $articleService
    ) {}

    /**
     * Ambil daftar artikel dengan filter kategori, pencarian, dan paginasi (9 item per halaman).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['category', 'search']);
        $perPage = $request->integer('per_page', 9);

        // Batasi rentang per_page antara 1 sampai 30 untuk keamanan
        $perPage = max(1, min(30, $perPage));

        $articles = $this->articleService->getPaginatedArticles($filters, $perPage);

        return ArticleResource::collection($articles);
    }

    /**
     * Ambil detail lengkap artikel berdasarkan slug beserta 3 artikel terkait.
     */
    public function show(string $slug): JsonResponse
    {
        $article = $this->articleService->getBySlug($slug);

        // Naikkan view count artikel secara aman (cek ketersediaan kolom views / view_count)
        if (Schema::hasColumn('articles', 'views')) {
            $article->increment('views');
        } elseif (Schema::hasColumn('articles', 'view_count')) {
            $this->articleService->incrementViews($article);
        }

        // Ambil 3 artikel terkait dari kategori yang sama
        $relatedArticles = $this->articleService->getRelatedArticles($article, 3);

        return response()->json([
            'success' => true,
            'message' => 'Detail artikel berhasil dimuat.',
            'data'    => [
                'article'          => new ArticleResource($article),
                'related_articles' => ArticleResource::collection($relatedArticles),
            ],
        ]);
    }

    /**
     * Sajikan HTML dengan meta tag Open Graph dinamis untuk crawler WhatsApp / media sosial.
     */
    public function ogMeta(string $slug)
    {
        $article = $this->articleService->getBySlug($slug);
        $title = e($article->title . ' — Panitia Rojabiyyah & Haul Abah Ke-5');
        $rawDesc = $article->excerpt ?: strip_tags((string) $article->content);
        $description = e(\Illuminate\Support\Str::limit(trim(preg_replace('/\s+/', ' ', $rawDesc)), 160));
        $frontendUrl = rtrim((string) config('app.frontend_url', env('FRONTEND_URL', url('/'))), '/');
        $canonicalUrl = e($frontendUrl . '/artikel/' . $article->slug);

        $cover = $article->cover_image_url ?: $article->cover_image ?: '';
        if ($cover && !str_starts_with($cover, 'http://') && !str_starts_with($cover, 'https://')) {
            $cleanCover = ltrim($cover, '/');
            $cover = str_starts_with($cleanCover, 'storage/')
                ? url($cleanCover)
                : url('storage/' . $cleanCover);
        }
        $imageUrl = e($cover);

        $html = <<<HTML
<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>{$title}</title>
  <meta name="description" content="{$description}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Panitia Rojabiyyah &amp; Haul Abah Ke-5" />
  <meta property="og:title" content="{$title}" />
  <meta property="og:description" content="{$description}" />
  <meta property="og:url" content="{$canonicalUrl}" />
  <meta property="og:image" content="{$imageUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="{$title}" />
  <meta name="twitter:description" content="{$description}" />
  <meta name="twitter:image" content="{$imageUrl}" />
  <meta http-equiv="refresh" content="0;url={$canonicalUrl}" />
</head>
<body>
  <script>window.location.replace("{$canonicalUrl}");</script>
</body>
</html>
HTML;

        return response($html, 200)->header('Content-Type', 'text/html; charset=UTF-8');
    }
}
