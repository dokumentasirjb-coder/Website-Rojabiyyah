<?php

use App\Http\Controllers\Api\V1\Admin\AdminAnnouncementController;
use App\Http\Controllers\Api\V1\Admin\AdminArticleController;
use App\Http\Controllers\Api\V1\AnnouncementController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\HomeController;
use App\Http\Controllers\Api\V1\SiteSettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Rojabiyyah Portal & CMS
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->name('api.v1.')->middleware('throttle:api')->group(function () {

    // ============================================================
    // 1. PUBLIC ROUTES (Halaman Depan & Pembaca)
    // ============================================================
    Route::get('/home', HomeController::class)->name('home');
    Route::get('/articles', [ArticleController::class, 'index'])->name('articles.index');
    Route::get('/articles/{slug}', [ArticleController::class, 'show'])->name('articles.show');
    Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
    Route::get('/announcements/{id}', [AnnouncementController::class, 'show'])->name('announcements.show');
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/settings', [SiteSettingController::class, 'index'])->name('settings.index');

    // ============================================================
    // 2. AUTHENTICATION (Sanctum Bearer Token + Throttle Login)
    // ============================================================
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:login')
        ->name('login');

    // ============================================================
    // 3. ADMIN CMS PROTECTED ROUTES (auth:sanctum)
    // ============================================================
    Route::middleware('auth:sanctum')->group(function () {
        // Profil & Sesi
        Route::get('/me', [AuthController::class, 'me'])->name('me');
        Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

        // Admin CRUD Artikel & Berita
        Route::apiResource('admin/articles', AdminArticleController::class)->names('admin.articles');

        // Admin CRUD Pengumuman & Agenda
        Route::apiResource('admin/announcements', AdminAnnouncementController::class)->names('admin.announcements');

        // Admin Pengaturan Tampilan Situs (Navbar, Footer, Hero, Medsos, Kontak)
        Route::get('/admin/settings', [SiteSettingController::class, 'index'])->name('admin.settings.show');
        Route::post('/admin/settings', [SiteSettingController::class, 'update'])->name('admin.settings.update');
        Route::put('/admin/settings', [SiteSettingController::class, 'update']);
    });
});

// Backward compatibility user route
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
