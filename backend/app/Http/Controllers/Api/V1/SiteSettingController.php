<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteSettingController extends Controller
{
    /**
     * Mendapatkan pengaturan situs untuk frontend dan admin.
     */
    public function index(): JsonResponse
    {
        $settings = SiteSetting::getSettings();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Memperbarui pengaturan situs dari Admin Dashboard.
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'site_title' => 'nullable|string|max:255',
            'site_subtitle' => 'nullable|string|max:255',
            'navbar_badge' => 'nullable|string|max:50',
            'favicon_url' => 'nullable|string',
            'logo_image_url' => 'nullable|string',
            'topbar_date' => 'nullable|string|max:255',
            'topbar_location' => 'nullable|string|max:255',
            'banner_beranda_url' => 'nullable|string',
            'banner_tentang_url' => 'nullable|string',
            'banner_agenda_url' => 'nullable|string',
            'banner_berita_url' => 'nullable|string',
            'banner_galeri_url' => 'nullable|string',
            'hero_headline_1' => 'nullable|string|max:255',
            'hero_headline_2' => 'nullable|string|max:255',
            'hero_headline_3' => 'nullable|string|max:255',
            'hero_tagline' => 'nullable|string',
            'about_tag' => 'nullable|string|max:100',
            'about_title' => 'nullable|string|max:255',
            'about_subtitle' => 'nullable|string',
            'about_section_label' => 'nullable|string|max:100',
            'about_paragraph_1' => 'nullable|string',
            'about_paragraph_2' => 'nullable|string',
            'about_paragraph_3' => 'nullable|string',
            'agenda_tag' => 'nullable|string|max:100',
            'agenda_title' => 'nullable|string|max:255',
            'agenda_subtitle' => 'nullable|string',
            'news_tag' => 'nullable|string|max:100',
            'news_title' => 'nullable|string|max:255',
            'news_subtitle' => 'nullable|string',
            'gallery_tag' => 'nullable|string|max:100',
            'gallery_title' => 'nullable|string|max:255',
            'gallery_subtitle' => 'nullable|string',
            'footer_description' => 'nullable|string',
            'footer_quote' => 'nullable|string',
            'footer_copyright' => 'nullable|string|max:255',
            'contact_address' => 'nullable|string',
            'contact_email' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:255',
            'contact_hours' => 'nullable|string|max:255',
            'social_instagram' => 'nullable|string|max:255',
            'social_youtube' => 'nullable|string|max:255',
            'social_facebook' => 'nullable|string|max:255',
            'social_twitter' => 'nullable|string|max:255',
            'social_tiktok' => 'nullable|string|max:255',
            'social_whatsapp' => 'nullable|string|max:255',
            'agenda_schedules_json' => 'nullable|array',
            'gallery_items_json' => 'nullable|array',
            'informasi_data_json' => 'nullable|array',
        ]);

        $settings = SiteSetting::getSettings();
        $settings->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan situs berhasil diperbarui.',
            'data' => $settings->fresh(),
        ]);
    }
}
