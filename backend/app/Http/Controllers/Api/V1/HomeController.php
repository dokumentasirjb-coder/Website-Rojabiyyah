<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Http\Resources\ArticleResource;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Services\AnnouncementService;
use App\Services\ArticleService;
use Illuminate\Http\JsonResponse;

class HomeController extends Controller
{
    public function __construct(
        protected ArticleService $articleService,
        protected AnnouncementService $announcementService
    ) {}

    /**
     * Endpoint terpadu untuk halaman depan (Home):
     * - 1 Berita utama (Hero / is_featured)
     * - 2 Berita sorotan (Highlights)
     * - 6 Berita terbaru
     * - Semua kategori aktif
     * - 4 Pengumuman & agenda aktif
     */
    public function __invoke(): JsonResponse
    {
        // 1. Berita Utama (Hero)
        $hero = $this->articleService->getFeaturedHero();

        // 2. Berita Sorotan (Highlights)
        $highlights = $this->articleService->getFeaturedSecondary($hero?->id, 2);

        // Kumpulkan ID yang sudah tampil agar tidak duplikat di section terbaru
        $excludeIds = array_filter(array_merge(
            [$hero?->id],
            $highlights->pluck('id')->all()
        ));

        // 3. Berita Terbaru (6 item)
        $latest = $this->articleService->getLatestArticles($excludeIds, 6);

        // 4. Semua Kategori Aktif beserta jumlah artikelnya
        $categories = Category::active()
            ->withCount(['articles' => fn ($q) => $q->published()])
            ->orderBy('sort_order')
            ->get();

        // 5. 4 Pengumuman / Agenda Kegiatan Aktif
        $announcements = $this->announcementService->getActiveAnnouncements(4);

        return response()->json([
            'success' => true,
            'message' => 'Data beranda berhasil dimuat.',
            'data'    => [
                'hero'          => $hero ? new ArticleResource($hero) : null,
                'highlights'    => ArticleResource::collection($highlights),
                'latest'        => ArticleResource::collection($latest),
                'categories'    => CategoryResource::collection($categories),
                'announcements' => AnnouncementResource::collection($announcements),
            ],
        ]);
    }
}
