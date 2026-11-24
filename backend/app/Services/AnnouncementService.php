<?php

namespace App\Services;

use App\Models\Announcement;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AnnouncementService
{
    /**
     * Ambil daftar pengumuman & agenda aktif (default 4 item untuk beranda).
     */
    public function getActiveAnnouncements(int $limit = 4): Collection
    {
        return Announcement::visible()
            ->with('author')
            ->orderByDesc('is_pinned')
            ->orderByRaw('CASE WHEN event_date IS NOT NULL AND event_date >= CURDATE() THEN 0 ELSE 1 END')
            ->orderBy('event_date')
            ->latest('created_at')
            ->limit($limit)
            ->get();
    }

    /**
     * Ambil daftar pengumuman dengan paginasi dan filter jenis/jadwal.
     */
    public function getPaginatedAnnouncements(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = Announcement::visible()
            ->with('author');

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['upcoming']) && filter_var($filters['upcoming'], FILTER_VALIDATE_BOOLEAN)) {
            $query->where('event_date', '>=', today());
        }

        if (!empty($filters['search'])) {
            $term = '%' . trim($filters['search']) . '%';
            $query->where(function ($q) use ($term) {
                $q->where('title', 'like', $term)
                  ->orWhere('content', 'like', $term)
                  ->orWhere('location', 'like', $term);
            });
        }

        return $query->orderByDesc('is_pinned')
            ->orderByRaw('CASE WHEN event_date IS NOT NULL AND event_date >= CURDATE() THEN 0 ELSE 1 END')
            ->orderBy('event_date')
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Ambil pengumuman tunggal berdasarkan ID.
     */
    public function getById(int $id): Announcement
    {
        return Announcement::visible()
            ->with('author')
            ->findOrFail($id);
    }
}
