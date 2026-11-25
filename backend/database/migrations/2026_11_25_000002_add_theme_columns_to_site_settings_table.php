<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('site_settings')) {
            return;
        }

        Schema::table('site_settings', function (Blueprint $table) {
            // Perbesar kolom URL/JSON agar menampung gambar atau data panjang tanpa terpotong
            $table->longText('favicon_url')->nullable()->change();
            $table->longText('logo_image_url')->nullable()->change();
            $table->longText('banner_beranda_url')->nullable()->change();
            $table->longText('banner_tentang_url')->nullable()->change();
            $table->longText('banner_agenda_url')->nullable()->change();
            $table->longText('banner_berita_url')->nullable()->change();
            $table->longText('banner_galeri_url')->nullable()->change();
            $table->longText('agenda_schedules_json')->nullable()->change();
            $table->longText('gallery_items_json')->nullable()->change();

            if (!Schema::hasColumn('site_settings', 'banner_informasi_url')) {
                $table->longText('banner_informasi_url')->nullable()->after('banner_galeri_url');
            }

            // Kolom Tema & Palet Warna
            if (!Schema::hasColumn('site_settings', 'theme_preset')) {
                $table->string('theme_preset', 50)->nullable()->default('emerald-nu');
            }
            if (!Schema::hasColumn('site_settings', 'primary_color')) {
                $table->string('primary_color', 30)->nullable()->default('#008f8a');
            }
            if (!Schema::hasColumn('site_settings', 'primary_hover_color')) {
                $table->string('primary_hover_color', 30)->nullable()->default('#007a75');
            }
            if (!Schema::hasColumn('site_settings', 'secondary_color')) {
                $table->string('secondary_color', 30)->nullable()->default('#006432');
            }
            if (!Schema::hasColumn('site_settings', 'accent_color')) {
                $table->string('accent_color', 30)->nullable()->default('#b38856');
            }
            if (!Schema::hasColumn('site_settings', 'navbar_bg_color')) {
                $table->string('navbar_bg_color', 30)->nullable()->default('#ffffff');
            }
            if (!Schema::hasColumn('site_settings', 'navbar_style')) {
                $table->string('navbar_style', 20)->nullable()->default('white');
            }
            if (!Schema::hasColumn('site_settings', 'footer_bg_color')) {
                $table->string('footer_bg_color', 30)->nullable()->default('#042623');
            }
            if (!Schema::hasColumn('site_settings', 'footer_bottom_bg_color')) {
                $table->string('footer_bottom_bg_color', 30)->nullable()->default('#021a18');
            }

            // Kolom Header Halaman Agenda, Berita, Galeri
            if (!Schema::hasColumn('site_settings', 'agenda_tag')) {
                $table->string('agenda_tag', 100)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'agenda_title')) {
                $table->string('agenda_title', 255)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'agenda_subtitle')) {
                $table->text('agenda_subtitle')->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'news_tag')) {
                $table->string('news_tag', 100)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'news_title')) {
                $table->string('news_title', 255)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'news_subtitle')) {
                $table->text('news_subtitle')->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'gallery_tag')) {
                $table->string('gallery_tag', 100)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'gallery_title')) {
                $table->string('gallery_title', 255)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'gallery_subtitle')) {
                $table->text('gallery_subtitle')->nullable();
            }

            // Kolom Konten Lanjutan Halaman Tentang & Galeri Album
            if (!Schema::hasColumn('site_settings', 'about_section_title')) {
                $table->string('about_section_title', 255)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'about_history_label')) {
                $table->string('about_history_label', 150)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'about_history_title')) {
                $table->string('about_history_title', 255)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'about_quote_label')) {
                $table->string('about_quote_label', 150)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'about_quote_text')) {
                $table->text('about_quote_text')->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'about_quote_location')) {
                $table->string('about_quote_location', 255)->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'about_structure_items_json')) {
                $table->longText('about_structure_items_json')->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'about_history_paragraphs_json')) {
                $table->longText('about_history_paragraphs_json')->nullable();
            }
            if (!Schema::hasColumn('site_settings', 'about_section_enabled')) {
                $table->boolean('about_section_enabled')->default(true);
            }
            if (!Schema::hasColumn('site_settings', 'about_history_enabled')) {
                $table->boolean('about_history_enabled')->default(true);
            }
            if (!Schema::hasColumn('site_settings', 'about_quote_enabled')) {
                $table->boolean('about_quote_enabled')->default(true);
            }
            if (!Schema::hasColumn('site_settings', 'gallery_albums_json')) {
                $table->longText('gallery_albums_json')->nullable();
            }
        });
    }

    public function down(): void
    {
        if (!Schema::hasTable('site_settings')) {
            return;
        }

        $columns = [
            'banner_informasi_url',
            'theme_preset',
            'primary_color',
            'primary_hover_color',
            'secondary_color',
            'accent_color',
            'navbar_bg_color',
            'navbar_style',
            'footer_bg_color',
            'footer_bottom_bg_color',
            'agenda_tag',
            'agenda_title',
            'agenda_subtitle',
            'news_tag',
            'news_title',
            'news_subtitle',
            'gallery_tag',
            'gallery_title',
            'gallery_subtitle',
            'about_section_title',
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
            'gallery_albums_json',
        ];

        Schema::table('site_settings', function (Blueprint $table) use ($columns) {
            foreach ($columns as $col) {
                if (Schema::hasColumn('site_settings', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};
