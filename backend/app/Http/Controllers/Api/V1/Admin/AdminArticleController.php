<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminArticleController extends Controller
{
    /**
     * Ambil seluruh artikel untuk panel CMS (termasuk draft & archived).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Article::with(['category', 'author']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $search = '%' . trim($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', $search)
                  ->orWhere('excerpt', 'like', $search);
            });
        }

        $articles = $query->latest('id')->paginate($request->integer('per_page', 10));

        return ArticleResource::collection($articles);
    }

    /**
     * Simpan artikel baru beserta upload gambar sampul ke disk public.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'       => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'content'     => ['required', 'string'],
            'excerpt'     => ['nullable', 'string', 'max:500'],
            'status'      => ['required', 'in:draft,published,archived'],
            'is_featured' => ['nullable', 'boolean'],
            'cover_image' => ['nullable'],
        ]);

        // Handle upload cover image
        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        } elseif ($request->filled('cover_image') && str_starts_with($request->cover_image, 'data:image')) {
            try {
                $parts = explode(';base64,', $request->cover_image);
                $ext = str_contains($parts[0], 'png') ? 'png' : 'jpg';
                $data = base64_decode($parts[1] ?? '');
                if ($data) {
                    $filename = 'covers/' . Str::random(32) . '.' . $ext;
                    Storage::disk('public')->put($filename, $data);
                    $validated['cover_image'] = $filename;
                }
            } catch (\Throwable) {
                // Keep as is or skip
            }
        }

        // Generate slug unik (termasuk mengecek artikel yang di-soft-delete agar tidak bentrok unique constraint DB)
        $validated['slug'] = $this->generateUniqueSlug($validated['title']);

        // Auto-generate excerpt jika kosong
        if (empty($validated['excerpt']) && !empty($validated['content'])) {
            $validated['excerpt'] = Str::words(strip_tags($validated['content']), 25, '...');
        }

        // Tautkan user pembuat dari token
        $validated['user_id'] = $request->user()->id;

        if ($validated['status'] === Article::STATUS_PUBLISHED) {
            $validated['published_at'] = now();
        }

        $article = Article::create($validated);
        $article->load(['category', 'author']);

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil diterbitkan.',
            'data'    => new ArticleResource($article),
        ], 201);
    }

    /**
     * Ambil data artikel tunggal untuk edit.
     */
    public function show(int $id): JsonResponse
    {
        $article = Article::with(['category', 'author'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data'    => new ArticleResource($article),
        ]);
    }

    /**
     * Perbarui artikel dan kelola penggantian file cover jika ada upload baru.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title'       => ['sometimes', 'required', 'string', 'max:255'],
            'category_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'content'     => ['sometimes', 'required', 'string'],
            'excerpt'     => ['nullable', 'string', 'max:500'],
            'status'      => ['sometimes', 'required', 'in:draft,published,archived'],
            'is_featured' => ['nullable', 'boolean'],
            'cover_image' => ['nullable'],
        ]);

        // Update cover image jika berkas baru dikirim
        if ($request->hasFile('cover_image')) {
            // Hapus cover lama dari disk public jika ada
            if ($article->cover_image && Storage::disk('public')->exists($article->cover_image)) {
                Storage::disk('public')->delete($article->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('covers', 'public');
        } elseif ($request->filled('cover_image') && str_starts_with($request->cover_image, 'data:image')) {
            try {
                $parts = explode(';base64,', $request->cover_image);
                $ext = str_contains($parts[0], 'png') ? 'png' : 'jpg';
                $data = base64_decode($parts[1] ?? '');
                if ($data) {
                    $filename = 'covers/' . Str::random(32) . '.' . $ext;
                    Storage::disk('public')->put($filename, $data);
                    $validated['cover_image'] = $filename;
                }
            } catch (\Throwable) {
                // Keep as is or skip
            }
        }

        // Update slug jika judul diubah
        if (!empty($validated['title']) && $validated['title'] !== $article->title) {
            $validated['slug'] = $this->generateUniqueSlug($validated['title'], $article->id);
        }

        // Set published_at jika status beralih ke published
        if (
            isset($validated['status'])
            && $validated['status'] === Article::STATUS_PUBLISHED
            && is_null($article->published_at)
        ) {
            $validated['published_at'] = now();
        }

        $article->update($validated);
        $article->load(['category', 'author']);

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil diperbarui.',
            'data'    => new ArticleResource($article),
        ]);
    }

    /**
     * Unggah gambar konten berita ke disk public dan kembalikan URL pendeknya.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        $path = $request->file('image')->store('articles', 'public');

        return response()->json([
            'success' => true,
            'message' => 'Gambar berhasil diunggah.',
            'url'     => url('storage/' . $path),
            'path'    => $path,
        ], 201);
    }

    /**
     * Hapus artikel (soft delete).
     */
    public function destroy(int $id): JsonResponse
    {
        $article = Article::findOrFail($id);
        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Artikel berhasil dihapus.',
        ]);
    }

    /**
     * Buat slug unik dari judul artikel (mengecek termasuk artikel soft-deleted).
     */
    private function generateUniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title) ?: 'artikel-' . time();
        $slug = $baseSlug;
        $counter = 1;

        while (
            Article::withTrashed()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
