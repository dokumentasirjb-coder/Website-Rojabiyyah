<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="relative min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] flex items-center bg-[#08253C] overflow-hidden">
    <!-- Background Image (LCP element: fetchpriority="high", eager loading) -->
    <div class="absolute inset-0 z-0 bg-gradient-to-br from-[#08253C] via-[#0b3150] to-[#051a2b]">
      <img
        :src="settingsStore.settings.banner_beranda_url || '/storage/settings/hero-beranda-active.jpg'"
        :alt="settingsStore.settings.hero_headline_1 || 'Panitia Rojabiyyah & Haul Abah Ke-5'"
        fetchpriority="high"
        loading="eager"
        decoding="async"
        class="w-full h-full object-cover object-center opacity-45"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#08253C] via-[#08253C]/85 to-[#08253C]/40"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#08253C] via-[#08253C]/45 to-transparent"></div>
    </div>

    <!-- Foreground Content (Immediate Fallback + Database-Driven) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative z-10 w-full">
      <div class="max-w-3xl space-y-4 sm:space-y-6">
        <div class="text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-[#d4af37] leading-snug">
          {{ settingsStore.settings?.topbar_date || '16–17 DESEMBER 2026' }}
          &nbsp;•&nbsp;
          {{ settingsStore.settings?.topbar_location || 'JOMBANG, JAWA TIMUR' }}
        </div>

        <h1 class="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.12] sm:leading-[1.08] break-words">
          <template v-if="settingsStore.settings?.hero_headline_1 || settingsStore.settings?.hero_headline_2 || settingsStore.settings?.hero_headline_3">
            <template v-if="settingsStore.settings?.hero_headline_1">{{ settingsStore.settings?.hero_headline_1 }}<br /></template>
            <span v-if="settingsStore.settings?.hero_headline_2" class="text-emerald-300">{{ settingsStore.settings?.hero_headline_2 }}<br /></span>
            <span v-if="settingsStore.settings?.hero_headline_3" class="text-[#d4af37]">{{ settingsStore.settings?.hero_headline_3 }}</span>
          </template>
          <template v-else>
            Panitia Rojabiyyah<br />
            <span class="text-[#d4af37]">&amp; Haul Abah Ke-5</span>
          </template>
        </h1>

        <p class="text-xs sm:text-base text-slate-200 font-medium leading-relaxed max-w-md pt-1 sm:pt-2">
          {{ settingsStore.settings?.hero_tagline || 'Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa' }}
        </p>
      </div>
    </div>
  </div>
</template>
