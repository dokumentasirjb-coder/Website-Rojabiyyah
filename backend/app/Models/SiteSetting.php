<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteSetting extends Model
{
    use HasFactory;

    protected $table = 'site_settings';

    protected $fillable = [
        'site_title',
        'site_subtitle',
        'navbar_badge',
        'favicon_url',
        'logo_image_url',
        'topbar_date',
        'topbar_location',
        'banner_beranda_url',
        'banner_tentang_url',
        'banner_agenda_url',
        'banner_berita_url',
        'banner_galeri_url',
        'banner_informasi_url',
        'hero_headline_1',
        'hero_headline_2',
        'hero_headline_3',
        'hero_tagline',
        'about_tag',
        'about_title',
        'about_subtitle',
        'about_section_label',
        'about_section_title',
        'about_paragraph_1',
        'about_paragraph_2',
        'about_paragraph_3',
        'about_history_label',
        'about_history_title',
        'about_quote_label',
        'about_quote_text',
        'about_quote_location',
        'about_structure_items_json',
        'about_history_paragraphs_json',
        'about_section_enabled',
        'about_history_enabled',
        'about_quote_enabled',
        'agenda_tag',
        'agenda_title',
        'agenda_subtitle',
        'news_tag',
        'news_title',
        'news_subtitle',
        'gallery_tag',
        'gallery_title',
        'gallery_subtitle',
        'footer_description',
        'footer_quote',
        'footer_copyright',
        'contact_address',
        'contact_email',
        'contact_phone',
        'contact_hours',
        'social_instagram',
        'social_youtube',
        'social_facebook',
        'social_twitter',
        'social_tiktok',
        'social_whatsapp',
        'theme_preset',
        'primary_color',
        'primary_hover_color',
        'secondary_color',
        'accent_color',
        'navbar_bg_color',
        'navbar_style',
        'footer_bg_color',
        'footer_bottom_bg_color',
        'agenda_schedules_json',
        'gallery_items_json',
        'gallery_albums_json',
        'informasi_data_json',
    ];

    protected $casts = [
        'agenda_schedules_json' => 'array',
        'gallery_items_json' => 'array',
        'gallery_albums_json' => 'array',
        'about_structure_items_json' => 'array',
        'about_history_paragraphs_json' => 'array',
        'informasi_data_json' => 'array',
        'about_section_enabled' => 'boolean',
        'about_history_enabled' => 'boolean',
        'about_quote_enabled' => 'boolean',
    ];

    /**
     * Mengambil konfigurasi situs aktif (singleton record).
     */
    public static function getSettings(): self
    {
        return static::firstOrCreate([], [
            'site_title' => 'Muktamar Ke-35',
            'site_subtitle' => 'Nahdlatul Ulama',
            'navbar_badge' => '35',
            'topbar_date' => '27–31 AGUSTUS 2026',
            'topbar_location' => 'JOMBANG, JAWA TIMUR',
            'banner_beranda_url' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=80',
            'banner_tentang_url' => 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
            'banner_agenda_url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80',
            'banner_berita_url' => 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1400&q=80',
            'banner_galeri_url' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80',
            'hero_headline_1' => 'Muktamar',
            'hero_headline_2' => 'Nahdlatul Ulama',
            'hero_headline_3' => 'Ke-35',
            'hero_tagline' => 'Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa',
            'about_tag' => 'TENTANG',
            'about_title' => 'Permusyawaratan akbar para ulama Nusantara',
            'about_subtitle' => 'Muktamar adalah forum tertinggi dalam Nahdlatul Ulama. Muktamar ke-35 digelar pada 27–31 Agustus 2026 di Jombang, Jawa Timur.',
            'about_section_label' => 'APA ITU MUKTAMAR',
            'about_paragraph_1' => 'Muktamar merupakan permusyawaratan tertinggi Nahdlatul Ulama yang diselenggarakan setiap lima tahun. Forum ini mempertemukan para ulama, kiai, pengurus, badan otonom, dan warga Nahdliyyin dari seluruh Indonesia, bahkan mancanegara.',
            'about_paragraph_2' => 'Dalam Muktamar, dibahas berbagai hukum atas masalah keagamaan dan kemasyarakatan melalui forum Bahtsul Masail, evaluasi organisasi, perumusan program kerja lima tahun ke depan, rekomendasi kebangsaan, hingga pemilihan Rais Aam dan Ketua Umum untuk periode berikutnya.',
            'about_paragraph_3' => 'Muktamar ke-35 mengusung tema “Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa” yang menegaskan komitmen jam’iyah dalam merawat integritas keulamaan, memberdayakan umat secara berkelanjutan, dan memberikan kontribusi nyata bagi masa depan peradaban.',
            'footer_description' => 'Portal resmi penyelenggaraan Muktamar ke-35 Nahdlatul Ulama (NU). Wadah permusyawaratan tertinggi para ulama nusantara dalam merawat tradisi keilmuan dan mengawal kemaslahatan bangsa.',
            'footer_quote' => '“Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa”',
            'footer_copyright' => 'Perkumpulan Nahdlatul Ulama',
            'contact_address' => 'Kompleks Pondok Pesantren Bahrul Ulum, Tambakberas, Kec. Jombang, Kab. Jombang, Jawa Timur 61451',
            'contact_email' => 'muktamar@nu.id',
            'contact_phone' => '+62 (0321) 8899-7700',
            'contact_hours' => 'Pelayanan: 24 Jam selama Muktamar',
            'social_instagram' => 'https://instagram.com',
            'social_youtube' => 'https://youtube.com',
            'social_facebook' => 'https://facebook.com',
            'social_twitter' => 'https://twitter.com',
            'social_tiktok' => 'https://tiktok.com',
            'social_whatsapp' => 'https://wa.me/6281234567890',
        ]);
    }
}
