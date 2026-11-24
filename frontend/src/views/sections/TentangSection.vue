<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore, DEFAULT_ABOUT_STRUCTURE_ITEMS, DEFAULT_ABOUT_HISTORY_PARAGRAPHS } from '@/stores/settingsStore'
import type { AboutStructureItem, AboutParagraphItem } from '@/types'

const settingsStore = useSettingsStore()

const structureItems = computed<AboutStructureItem[]>(() => {
  if (Array.isArray(settingsStore.settings.about_structure_items_json) && settingsStore.settings.about_structure_items_json.length > 0) {
    return settingsStore.settings.about_structure_items_json
  }
  return DEFAULT_ABOUT_STRUCTURE_ITEMS
})

const historyParagraphs = computed<AboutParagraphItem[]>(() => {
  if (Array.isArray(settingsStore.settings.about_history_paragraphs_json) && settingsStore.settings.about_history_paragraphs_json.length > 0) {
    return settingsStore.settings.about_history_paragraphs_json
  }
  return DEFAULT_ABOUT_HISTORY_PARAGRAPHS
})
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

    <!-- Section Block 1: Struktur & Dimensi Utama (Bisa Ditambah, Diedit & Dihapus) -->
    <div 
      v-if="settingsStore.settings.about_section_enabled !== false && structureItems.length > 0"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 border-b border-slate-100"
    >
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
          <p v-if="settingsStore.settings.about_paragraph_1" class="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {{ settingsStore.settings.about_paragraph_1 }}
          </p>

          <!-- Structured Rows Dinamis (Setiap baris bisa diedit atau dihapus) -->
          <div class="border-t border-slate-200/80 divide-y divide-slate-100">
            <div 
              v-for="item in structureItems" 
              :key="item.id"
              class="py-4 sm:py-5 grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-6 items-baseline"
            >
              <div class="sm:col-span-5">
                <span class="font-bold text-sm sm:text-base text-[#008f8a] block">
                  {{ item.title }}
                </span>
                <span v-if="item.subtitle" class="text-[11px] text-slate-400 uppercase tracking-wider font-medium block">
                  {{ item.subtitle }}
                </span>
              </div>
              <div class="sm:col-span-7 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {{ item.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Block 2: Sekilas & Visi Sejarah (Bisa Ditambah, Diedit & Dihapus) -->
    <div 
      v-if="settingsStore.settings.about_history_enabled !== false"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
    >
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

        <!-- Kolom Kanan: Paragraf Naratif Dinamis -->
        <div class="lg:col-span-7 space-y-6 text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
          <p v-for="p in historyParagraphs" :key="p.id">
            {{ p.text }}
          </p>

          <!-- Quote Card / Aksen Tagline (Bisa diaktifkan/dinonaktifkan) -->
          <div v-if="settingsStore.settings.about_quote_enabled !== false && (settingsStore.settings.about_quote_text || settingsStore.settings.hero_tagline)" class="pt-2">
            <div class="p-5 sm:p-6 rounded-2xl border border-slate-100 bg-slate-50/80 shadow-2xs border-l-4 border-l-[#008f8a]">
              <span v-if="settingsStore.settings.about_quote_label" class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                {{ settingsStore.settings.about_quote_label }}
              </span>
              <p class="text-sm sm:text-base font-bold text-slate-900 italic leading-snug">
                “{{ settingsStore.settings.about_quote_text || settingsStore.settings.hero_tagline }}”
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
