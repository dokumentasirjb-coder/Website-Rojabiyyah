<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnnouncementResource;
use App\Models\Announcement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class AdminAnnouncementController extends Controller
{
    /**
     * Daftar seluruh agenda & pengumuman (termasuk yang non-aktif).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Announcement::with('author');

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->is_active, FILTER_VALIDATE_BOOLEAN));
        }

        if ($request->filled('search')) {
            $search = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', $search)
                  ->orWhere('content', 'like', $search)
                  ->orWhere('location', 'like', $search);
            });
        }

        $announcements = $query->orderByDesc('id')->paginate($request->integer('per_page', 10));

        return AnnouncementResource::collection($announcements);
    }

    /**
     * Simpan pengumuman / agenda baru.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'      => ['required', 'string', 'max:255'],
            'content'    => ['required', 'string'],
            'type'       => ['required', 'in:announcement,event,agenda'],
            'event_date' => ['nullable', 'date'],
            'event_time' => ['nullable', 'string'],
            'location'   => ['nullable', 'string', 'max:255'],
            'is_active'  => ['nullable', 'boolean'],
            'is_pinned'  => ['nullable', 'boolean'],
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['is_pinned'] = $request->boolean('is_pinned', false);

        $announcement = Announcement::create($validated);
        $announcement->load('author');

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil ditambahkan.',
            'data'    => new AnnouncementResource($announcement),
        ], 201);
    }

    /**
     * Detail pengumuman tunggal.
     */
    public function show(int $id): JsonResponse
    {
        $announcement = Announcement::with('author')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => new AnnouncementResource($announcement),
        ]);
    }

    /**
     * Perbarui pengumuman.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $announcement = Announcement::findOrFail($id);

        $validated = $request->validate([
            'title'      => ['sometimes', 'required', 'string', 'max:255'],
            'content'    => ['sometimes', 'required', 'string'],
            'type'       => ['sometimes', 'required', 'in:announcement,event,agenda'],
            'event_date' => ['nullable', 'date'],
            'event_time' => ['nullable', 'string'],
            'location'   => ['nullable', 'string', 'max:255'],
            'is_active'  => ['nullable', 'boolean'],
            'is_pinned'  => ['nullable', 'boolean'],
        ]);

        $announcement->update($validated);
        $announcement->load('author');

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil diperbarui.',
            'data'    => new AnnouncementResource($announcement),
        ]);
    }

    /**
     * Hapus pengumuman.
     */
    public function destroy(int $id): JsonResponse
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengumuman berhasil dihapus.',
        ]);
    }
}
