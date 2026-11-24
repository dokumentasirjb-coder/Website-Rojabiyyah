<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="bg-white text-slate-900 transition-colors">
    <!-- Top Hero Banner with Image Fade (Matching Screenshot & Other Pages) -->
    <div class="relative bg-white border-b border-slate-100 overflow-hidden min-h-[340px] sm:min-h-[400px] lg:min-h-[440px] flex items-center">
      <!-- Background / Right-aligned Banner Photo with Smooth White Fade -->
      <div class="absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-3/5 z-0">
        <img
          :src="settingsStore.settings.banner_tentang_url || 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80'"
          alt="Latar Belakang Tentang Muktamar"
          class="w-full h-full object-cover object-center opacity-80"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
      </div>

      <!-- Banner Header Text -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10 w-full">
        <div class="max-w-2xl space-y-3 sm:space-y-4">
          <span class="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-[#008f8a]">
            {{ settingsStore.settings.about_tag || 'TENTANG MUKTAMAR' }}
          </span>
          <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            {{ settingsStore.settings.about_title || 'Permusyawaratan akbar para ulama Nusantara' }}
          </h1>
          <p class="text-sm sm:text-base text-slate-600 font-normal leading-relaxed pt-1">
            {{ settingsStore.settings.about_subtitle || 'Muktamar adalah forum tertinggi dalam Nahdlatul Ulama. Muktamar ke-35 digelar pada 27–31 Agustus 2026 di Jombang, Jawa Timur.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Section Block 1: Struktur & Dimensi Utama (Tata Letak Terstruktur) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-b border-slate-100">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        <!-- Kolom Kiri: Overline & Judul Besar Samping -->
        <div class="lg:col-span-5 space-y-2">
          <span class="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 block">
            {{ settingsStore.settings.about_section_label || 'APA ITU MUKTAMAR' }}
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            {{ settingsStore.settings.about_section_title || 'Permusyawaratan tertinggi organisasi NU' }}
          </h2>
        </div>

        <!-- Kolom Kanan: Paragraf Pengantar + Baris Tabel Terstruktur -->
        <div class="lg:col-span-7 space-y-8">
          <!-- Lead Paragraph -->
          <p class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {{ settingsStore.settings.about_paragraph_1 || 'Muktamar merupakan permusyawaratan tertinggi Nahdlatul Ulama yang diselenggarakan setiap lima tahun. Forum ini mempertemukan para ulama, kiai, pengurus, badan otonom, dan warga Nahdliyyin dari seluruh Indonesia, bahkan mancanegara.' }}
          </p>

          <!-- Structured Rows (Format PBNU / PWNU / PCNU dengan Garis Pembatas Halus) -->
          <div class="border-t border-slate-200/80 divide-y divide-slate-100">
            <!-- Row 1 -->
            <div class="py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline">
              <div class="sm:col-span-5">
                <span class="font-bold text-sm sm:text-base text-[#008f8a] block">
                  {{ settingsStore.settings.about_row_1_title || 'Bahtsul Masail Diniyah' }}
                </span>
                <span v-if="settingsStore.settings.about_row_1_subtitle" class="text-[11px] text-slate-400 uppercase tracking-wider font-medium block">
                  {{ settingsStore.settings.about_row_1_subtitle }}
                </span>
              </div>
              <div class="sm:col-span-7 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {{ settingsStore.settings.about_row_1_desc || 'Forum permusyawaratan para fukaha dan ulama pesantren dalam membahas serta menetapkan hukum Islam atas berbagai dinamika keagamaan, sosial, dan kebangsaan terkini.' }}
              </div>
            </div>

            <!-- Row 2 -->
            <div class="py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline">
              <div class="sm:col-span-5">
                <span class="font-bold text-sm sm:text-base text-[#008f8a] block">
                  {{ settingsStore.settings.about_row_2_title || 'Sidang Komisi Organisasi' }}
                </span>
                <span v-if="settingsStore.settings.about_row_2_subtitle" class="text-[11px] text-slate-400 uppercase tracking-wider font-medium block">
                  {{ settingsStore.settings.about_row_2_subtitle }}
                </span>
              </div>
              <div class="sm:col-span-7 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {{ settingsStore.settings.about_row_2_desc || 'Evaluasi laporan pertanggungjawaban pimpinan pusat, perumusan garis-garis besar program kerja lima tahunan, penyempurnaan AD/ART, dan penerbitan rekomendasi strategis bagi kemaslahatan umat.' }}
              </div>
            </div>

            <!-- Row 3 -->
            <div class="py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline">
              <div class="sm:col-span-5">
                <span class="font-bold text-sm sm:text-base text-[#008f8a] block">
                  {{ settingsStore.settings.about_row_3_title || 'Musyawarah AHWA' }}
                </span>
                <span v-if="settingsStore.settings.about_row_3_subtitle" class="text-[11px] text-slate-400 uppercase tracking-wider font-medium block">
                  {{ settingsStore.settings.about_row_3_subtitle }}
                </span>
              </div>
              <div class="sm:col-span-7 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {{ settingsStore.settings.about_row_3_desc || 'Musyawarah penuh keadaban sembilan kiai sepuh terpilih untuk menetapkan Rais \'Aam Syuriyah PBNU, dilanjutkan musyawarah pemilihan Ketua Umum Tanfidziyah.' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Block 2: Sekilas & Visi Sejarah (Ulasan Narasi & Kutipan Tema) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        <!-- Kolom Kiri -->
        <div class="lg:col-span-5 space-y-2">
          <span class="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-400 block">
            {{ settingsStore.settings.about_history_label || 'SEKILAS MUKTAMAR & KHIDMAH' }}
          </span>
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
            {{ settingsStore.settings.about_history_title || 'Khidmah berkelanjutan untuk umat & bangsa' }}
          </h2>
        </div>

        <!-- Kolom Kanan: Paragraf Naratif Bersih & Rapi -->
        <div class="lg:col-span-7 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          <p>
            {{ settingsStore.settings.about_paragraph_2 || 'Dalam Muktamar, dibahas berbagai hukum atas masalah keagamaan dan kemasyarakatan melalui forum Bahtsul Masail, evaluasi organisasi, perumusan program kerja lima tahun ke depan, rekomendasi kebangsaan, hingga pemilihan Rais Aam dan Ketua Umum untuk periode berikutnya.' }}
          </p>

          <p>
            {{ settingsStore.settings.about_paragraph_3 || 'Muktamar ke-35 mengusung tema “Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa” yang menegaskan komitmen jam’iyah dalam merawat integritas keulamaan, memberdayakan umat secara berkelanjutan, dan memberikan kontribusi nyata bagi masa depan peradaban.' }}
          </p>

          <!-- Quote Card / Aksen Tagline -->
          <div class="pt-2">
            <div class="p-5 sm:p-6 rounded-2xl border border-slate-100 bg-slate-50/80 shadow-2xs border-l-4 border-l-[#008f8a]">
              <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {{ settingsStore.settings.about_quote_label || 'TEMA RESMI MUKTAMAR KE-35' }}
              </span>
              <p class="text-sm sm:text-base font-bold text-slate-900 italic leading-snug">
                “{{ settingsStore.settings.about_quote_text || settingsStore.settings.hero_tagline || 'Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa' }}”
              </p>
              <div v-if="settingsStore.settings.about_quote_location" class="text-[11px] text-slate-500 mt-2 font-medium">
                {{ settingsStore.settings.about_quote_location }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
