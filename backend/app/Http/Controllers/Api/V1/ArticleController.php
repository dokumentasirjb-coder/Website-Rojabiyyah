<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Services\ArticleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

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

        // Naikkan view count artikel
        $this->articleService->incrementViews($article);

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
}
