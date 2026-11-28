<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Services\SiteSettingMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SiteSettingController extends Controller
{
    public function __construct(
        protected SiteSettingMediaService $mediaService
    ) {}

    /**
     * Mendapatkan pengaturan situs untuk frontend dan admin.
     */
    public function index(): JsonResponse
    {
        $settings = $this->mediaService->normalizeStoredBase64Images(
            SiteSetting::getSettings()
        );

        return response()->json([
            'success' => true,
            'data' => $this->appendVirtualSettings($settings),
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
            'banner_informasi_url' => 'nullable|string',
            'hero_headline_1' => 'nullable|string|max:255',
            'hero_headline_2' => 'nullable|string|max:255',
            'hero_headline_3' => 'nullable|string|max:255',
            'hero_tagline' => 'nullable|string',
            'about_tag' => 'nullable|string|max:100',
            'about_title' => 'nullable|string|max:255',
            'about_subtitle' => 'nullable|string',
            'about_section_label' => 'nullable|string|max:100',
            'about_section_title' => 'nullable|string|max:255',
            'about_paragraph_1' => 'nullable|string',
            'about_paragraph_2' => 'nullable|string',
            'about_paragraph_3' => 'nullable|string',
            'about_history_label' => 'nullable|string|max:150',
            'about_history_title' => 'nullable|string|max:255',
            'about_quote_label' => 'nullable|string|max:150',
            'about_quote_text' => 'nullable|string',
            'about_quote_location' => 'nullable|string|max:255',
            'about_structure_items_json' => 'nullable|array',
            'about_history_paragraphs_json' => 'nullable|array',
            'about_section_enabled' => 'nullable|boolean',
            'about_history_enabled' => 'nullable|boolean',
            'about_quote_enabled' => 'nullable|boolean',
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
            'theme_preset' => 'nullable|string|max:50',
            'primary_color' => 'nullable|string|max:30',
            'primary_hover_color' => 'nullable|string|max:30',
            'secondary_color' => 'nullable|string|max:30',
            'accent_color' => 'nullable|string|max:30',
            'navbar_bg_color' => 'nullable|string|max:30',
            'navbar_style' => 'nullable|in:white,primary,dark',
            'footer_bg_color' => 'nullable|string|max:30',
            'footer_bottom_bg_color' => 'nullable|string|max:30',
            'agenda_schedules_json' => 'nullable|array',
            'gallery_items_json' => 'nullable|array',
            'gallery_albums_json' => 'nullable|array',
            'informasi_data_json' => 'nullable|array',
            'countdown_enabled' => 'nullable|boolean',
            'countdown_label' => 'nullable|string|max:255',
            'countdown_target' => 'nullable|string|max:100',
            'countdown_live_text' => 'nullable|string|max:255',
            'parking_zones_json' => 'nullable|array',
        ]);

        $validated = $this->mediaService->convertBase64Fields($validated);

        $settings = SiteSetting::getSettings();

        // Simpan pengaturan countdown & parking_zones ke informasi_data_json agar tidak butuh migrasi baru
        $infoData = is_array($validated['informasi_data_json'] ?? null)
            ? $validated['informasi_data_json']
            : (is_array($settings->informasi_data_json) ? $settings->informasi_data_json : []);

        $countdownKeys = ['countdown_enabled', 'countdown_label', 'countdown_target', 'countdown_live_text'];
        $existingCountdown = is_array($infoData['_countdown'] ?? null) ? $infoData['_countdown'] : [];
        foreach ($countdownKeys as $ck) {
            if (array_key_exists($ck, $validated)) {
                $existingCountdown[$ck] = $validated[$ck];
                unset($validated[$ck]);
            }
        }
        if ($existingCountdown !== []) {
            $infoData['_countdown'] = $existingCountdown;
            $validated['informasi_data_json'] = $infoData;
        }

        if (array_key_exists('parking_zones_json', $validated)) {
            $infoData['_parking_zones'] = $validated['parking_zones_json'] ?? [];
            $validated['informasi_data_json'] = $infoData;
            unset($validated['parking_zones_json']);
        }

        $settings->update($validated);
        $settings = $this->mediaService->normalizeStoredBase64Images($settings->fresh() ?? $settings);

        // Sinkronkan favicon statis jika logo baru diunggah ke /storage/
        if (! empty($validated['logo_image_url']) && is_string($validated['logo_image_url'])) {
            $this->syncStaticFaviconFromLogo($validated['logo_image_url']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan situs berhasil diperbarui.',
            'data' => $this->appendVirtualSettings($settings),
        ]);
    }

    /**
     * Sisipkan field countdown_* & parking_zones_json dari informasi_data_json ke top-level JSON.
     */
    protected function appendVirtualSettings(SiteSetting $settings): array
    {
        $arr = $settings->toArray();
        $info = is_array($settings->informasi_data_json) ? $settings->informasi_data_json : [];
        $cd = is_array($info['_countdown'] ?? null) ? $info['_countdown'] : [];

        $arr['countdown_enabled'] = array_key_exists('countdown_enabled', $cd) ? (bool) $cd['countdown_enabled'] : true;
        $arr['countdown_label'] = $cd['countdown_label'] ?? 'Menuju Puncak Haul Abah Ke-5';
        $arr['countdown_target'] = $cd['countdown_target'] ?? '';
        $arr['countdown_live_text'] = $cd['countdown_live_text'] ?? 'ACARA SEDANG BERLANGSUNG';
        $arr['parking_zones_json'] = is_array($info['_parking_zones'] ?? null) ? $info['_parking_zones'] : null;

        return $arr;
    }

    /**
     * Salin / resize logo PNG ke public/favicon-96x96.png & apple-touch-icon.png jika tersedia.
     */
    protected function syncStaticFaviconFromLogo(string $logoUrl): void
    {
        try {
            if (! str_starts_with($logoUrl, '/storage/')) {
                return;
            }
            $relative = ltrim(substr($logoUrl, strlen('/storage/')), '/');
            if (! Storage::disk('public')->exists($relative)) {
                return;
            }
            $fullPath = Storage::disk('public')->path($relative);
            if (! function_exists('imagecreatefromstring') || ! function_exists('imagepng')) {
                return;
            }
            $raw = @file_get_contents($fullPath);
            if ($raw === false) {
                return;
            }
            $src = @imagecreatefromstring($raw);
            if (! $src) {
                return;
            }
            $w = imagesx($src);
            $h = imagesy($src);
            foreach ([96 => 'favicon-96x96.png', 180 => 'apple-touch-icon.png'] as $size => $filename) {
                $dst = imagecreatetruecolor($size, $size);
                imagealphablending($dst, false);
                imagesavealpha($dst, true);
                $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
                imagefill($dst, 0, 0, $transparent);
                imagecopyresampled($dst, $src, 0, 0, 0, 0, $size, $size, $w, $h);
                $targetPath = public_path($filename);
                if (is_writable(dirname($targetPath))) {
                    @imagepng($dst, $targetPath);
                }
                imagedestroy($dst);
            }
            imagedestroy($src);
        } catch (\Throwable) {
            // Abaikan error filesystem di environment terproteksi
        }
    }
}
