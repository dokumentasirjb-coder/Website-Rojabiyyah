<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="bg-[#faf9f6] text-slate-900 transition-colors">
    <!-- Header / Intro Bar with Subtle Bottom Border -->
    <div class="border-b border-slate-200/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-baseline">
          <div class="lg:col-span-5 space-y-1">
            <span class="text-[11px] font-bold tracking-[0.25em] uppercase text-[#008f8a] block">
              {{ settingsStore.settings.about_tag || 'TENTANG MUKTAMAR' }}
            </span>
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              {{ settingsStore.settings.about_title || 'Permusyawaratan akbar para ulama Nusantara' }}
            </h1>
          </div>
          <div class="lg:col-span-7">
            <p class="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-normal">
              {{ settingsStore.settings.about_subtitle || 'Muktamar adalah forum tertinggi dalam Nahdlatul Ulama. Muktamar ke-35 digelar pada 27–31 Agustus 2026 di Jombang, Jawa Timur.' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Editorial Image Banner (Optional Admin Controlled Photo) -->
    <div 
      v-if="settingsStore.settings.banner_tentang_url"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-4"
    >
      <div class="overflow-hidden rounded-xl border border-slate-200/80 shadow-2xs bg-white">
        <img
          :src="settingsStore.settings.banner_tentang_url"
          alt="Dokumentasi Tentang Muktamar"
          class="w-full h-64 sm:h-96 lg:h-[440px] object-cover object-center"
        />
      </div>
      <div class="flex items-center justify-between text-[11px] text-slate-500 mt-2.5 px-1 italic">
        <span>Dokumentasi Resmi Jam'iyah Nahdlatul Ulama</span>
        <span>Jombang, Jawa Timur</span>
      </div>
    </div>

    <!-- Section Block 1: Struktur & Dimensi Utama (Matching Screenshot Layout) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-b border-slate-200/80">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        <!-- Kolom Kiri: Overline & Judul Besar -->
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

          <!-- Structured Rows (Matching PBNU / PWNU / PCNU table in screenshot) -->
          <div class="border-t border-slate-200/90 divide-y divide-slate-200/80">
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

    <!-- Section Block 2: Sekilas & Visi Sejarah (Matching Screenshot's "Khidmah sejak 1926" block) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
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
            <div class="p-5 sm:p-6 rounded-xl border border-slate-200/90 bg-white shadow-2xs border-l-4 border-l-[#008f8a]">
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
