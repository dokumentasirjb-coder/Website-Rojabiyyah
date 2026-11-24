<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            
            // Navbar & Identitas & Icon Website
            $table->string('site_title')->default('Muktamar Ke-35');
            $table->string('site_subtitle')->default('Nahdlatul Ulama');
            $table->string('navbar_badge')->default('35');
            $table->string('favicon_url')->nullable();
            $table->string('logo_image_url')->nullable();
            $table->string('topbar_date')->default('27–31 AGUSTUS 2026');
            $table->string('topbar_location')->default('JOMBANG, JAWA TIMUR');
            
            // Foto Banner / Slider Halaman
            $table->text('banner_beranda_url')->nullable();
            $table->text('banner_tentang_url')->nullable();
            $table->text('banner_agenda_url')->nullable();
            $table->text('banner_berita_url')->nullable();
            $table->text('banner_galeri_url')->nullable();

            // Hero Section Beranda
            $table->string('hero_headline_1')->default('Muktamar');
            $table->string('hero_headline_2')->default('Nahdlatul Ulama');
            $table->string('hero_headline_3')->default('Ke-35');
            $table->text('hero_tagline')->nullable();
            
            // Konten Halaman Tentang
            $table->string('about_tag')->default('TENTANG');
            $table->string('about_title')->default('Permusyawaratan akbar para ulama Nusantara');
            $table->text('about_subtitle')->nullable();
            $table->string('about_section_label')->default('APA ITU MUKTAMAR');
            $table->text('about_paragraph_1')->nullable();
            $table->text('about_paragraph_2')->nullable();
            $table->text('about_paragraph_3')->nullable();
            
            // Footer & Kontak
            $table->text('footer_description')->nullable();
            $table->text('footer_quote')->nullable();
            $table->string('footer_copyright')->default('Perkumpulan Nahdlatul Ulama');
            $table->text('contact_address')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_hours')->nullable();
            
            // Media Sosial
            $table->string('social_instagram')->nullable();
            $table->string('social_youtube')->nullable();
            $table->string('social_facebook')->nullable();
            $table->string('social_twitter')->nullable();
            $table->string('social_tiktok')->nullable();
            $table->string('social_whatsapp')->nullable();

            // Custom Agenda & Gallery Storage (JSON)
            $table->json('agenda_schedules_json')->nullable();
            $table->json('gallery_items_json')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
    }
};
