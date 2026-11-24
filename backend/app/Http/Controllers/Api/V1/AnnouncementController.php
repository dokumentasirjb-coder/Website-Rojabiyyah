<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Services\AnnouncementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AnnouncementController extends Controller
{
    public function __construct(
        protected AnnouncementService $announcementService
    ) {}

    /**
     * Ambil daftar pengumuman & agenda kegiatan publik.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->only(['type', 'upcoming', 'search']);
        $perPage = $request->integer('per_page', 10);
        $perPage = max(1, min(30, $perPage));

        $announcements = $this->announcementService->getPaginatedAnnouncements($filters, $perPage);

        return AnnouncementResource::collection($announcements);
    }

    /**
     * Ambil detail pengumuman tunggal.
     */
    public function show(int $id): JsonResponse
    {
        $announcement = $this->announcementService->getById($id);

        return response()->json([
            'success' => true,
            'message' => 'Detail pengumuman berhasil dimuat.',
            'data'    => new AnnouncementResource($announcement),
        ]);
    }
}
