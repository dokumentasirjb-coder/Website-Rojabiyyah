<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Schema;
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
        $this->prepareCategoryInput($request);

        $validated = $request->validate([
            'title'         => ['required', 'string', 'max:255'],
            'category_id'   => ['required', 'integer', 'exists:categories,id'],
            'category_name' => ['nullable', 'string', 'max:100'],
            'content'       => ['required', 'string'],
            'excerpt'       => ['nullable', 'string', 'max:500'],
            'tags'          => ['nullable', 'string', 'max:500'],
            'status'        => ['required', 'in:draft,published,archived'],
            'is_featured'   => ['nullable', 'boolean'],
            'cover_image'   => ['nullable'],
            'author_name'   => ['nullable', 'string', 'max:120'],
            'author_role'   => ['nullable', 'string', 'max:120'],
        ]);

        unset($validated['category_name']);

        if (! Schema::hasColumn('articles', 'author_name')) {
            unset($validated['author_name']);
        }
        if (! Schema::hasColumn('articles', 'author_role')) {
            unset($validated['author_role']);
        }
        if (! Schema::hasColumn('articles', 'tags')) {
            unset($validated['tags']);
        } elseif (array_key_exists('tags', $validated)) {
            $validated['tags'] = $this->normalizeTags($validated['tags']);
        }
        if (! Schema::hasColumn('articles', 'tags')) {
            unset($validated['tags']);
        } elseif (isset($validated['tags'])) {
            $validated['tags'] = $this->normalizeTags($validated['tags']);
        }

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

        $this->prepareCategoryInput($request);

        $validated = $request->validate([
            'title'         => ['sometimes', 'required', 'string', 'max:255'],
            'category_id'   => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'category_name' => ['nullable', 'string', 'max:100'],
            'content'       => ['sometimes', 'required', 'string'],
            'excerpt'       => ['nullable', 'string', 'max:500'],
            'tags'          => ['nullable', 'string', 'max:500'],
            'status'        => ['sometimes', 'required', 'in:draft,published,archived'],
            'is_featured'   => ['nullable', 'boolean'],
            'cover_image'   => ['nullable'],
            'author_name'   => ['nullable', 'string', 'max:120'],
            'author_role'   => ['nullable', 'string', 'max:120'],
        ]);

        unset($validated['category_name']);

        if (! Schema::hasColumn('articles', 'author_name')) {
            unset($validated['author_name']);
        }
        if (! Schema::hasColumn('articles', 'author_role')) {
            unset($validated['author_role']);
        }
        if (! Schema::hasColumn('articles', 'tags')) {
            unset($validated['tags']);
        } elseif (array_key_exists('tags', $validated)) {
            $validated['tags'] = $this->normalizeTags($validated['tags']);
        }
        if (! Schema::hasColumn('articles', 'tags')) {
            unset($validated['tags']);
        } elseif (isset($validated['tags'])) {
            $validated['tags'] = $this->normalizeTags($validated['tags']);
        }

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

    /**
     * Jika admin mengirim nama kategori baru (category_name atau category_id berupa string),
     * buat/ambil kategori terlebih dahulu sebelum validasi exists:categories,id.
     */
    private function prepareCategoryInput(Request $request): void
    {
        $rawName = $request->input('category_name');
        $rawId = $request->input('category_id');

        $catName = is_string($rawName) && trim($rawName) !== ''
            ? trim($rawName)
            : (is_string($rawId) && ! is_numeric($rawId) && trim($rawId) !== '' ? trim($rawId) : '');

        if ($catName !== '') {
            $slug = Str::slug($catName) ?: 'kategori-' . time();
            $category = Category::firstOrCreate(
                ['slug' => $slug],
                [
                    'name'       => $catName,
                    'color'      => '#008f8a',
                    'sort_order' => ((int) Category::max('sort_order')) + 1,
                    'is_active'  => true,
                ]
            );
            $request->merge(['category_id' => $category->id]);
        }
    }

    /**
     * Rapikan daftar tag dipisah koma agar konsisten.
     */
    private function normalizeTags(?string $rawTags): string
    {
        if ($rawTags === null || trim($rawTags) === '') {
            return '';
        }

        $items = array_filter(array_map(
            fn ($t) => trim(ltrim(trim($t), '#')),
            explode(',', $rawTags)
        ));

        return implode(', ', array_unique($items));
    }
}
