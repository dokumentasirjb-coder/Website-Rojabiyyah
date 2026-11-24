<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    /**
     * Ambil daftar seluruh kategori aktif beserta jumlah artikelnya.
     */
    public function index(): AnonymousResourceCollection
    {
        $categories = Category::active()
            ->withCount(['articles' => fn ($q) => $q->published()])
            ->orderBy('sort_order')
            ->get();

        return CategoryResource::collection($categories);
    }
}
