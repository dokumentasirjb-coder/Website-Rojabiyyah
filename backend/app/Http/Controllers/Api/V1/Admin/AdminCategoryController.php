<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = Category::withCount(['articles' => fn ($q) => $q->published()])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => CategoryResource::collection($categories),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:100'],
        ]);

        $name = trim($validated['name']);
        $slug = Str::slug($name) ?: 'kategori-' . time();

        $category = Category::firstOrCreate(
            ['slug' => $slug],
            [
                'name'       => $name,
                'color'      => '#008f8a',
                'sort_order' => ((int) Category::max('sort_order')) + 1,
                'is_active'  => true,
            ]
        );

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil ditambahkan.',
            'data'    => new CategoryResource($category),
        ], 201);
    }

    /**
     * Hapus kategori secara aman tanpa memicu error foreign key 1451.
     */
    public function destroy(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        // Cari kategori pengganti untuk artikel (termasuk yang soft-deleted)
        $fallback = Category::where('id', '!=', $category->id)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->first();

        if (! $fallback) {
            $fallback = Category::create([
                'name'       => 'Umum',
                'slug'       => 'umum-' . time(),
                'color'      => '#008f8a',
                'sort_order' => 1,
                'is_active'  => true,
            ]);
        }

        // Lepaskan relasi artikel (termasuk soft-deleted) sebelum menghapus kategori
        Article::withTrashed()
            ->where('category_id', $category->id)
            ->update(['category_id' => $fallback->id]);

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}
