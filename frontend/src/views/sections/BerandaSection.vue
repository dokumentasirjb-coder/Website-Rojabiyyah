<script setup lang="ts">
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="relative min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] flex items-center bg-white overflow-hidden">
    <!-- Background Image -->
    <div v-if="settingsStore.settings.banner_beranda_url" class="absolute inset-0 z-0">
      <img
        :src="settingsStore.settings.banner_beranda_url"
        :alt="settingsStore.settings.hero_headline_1 || 'Latar Belakang'"
        class="w-full h-full object-cover object-center grayscale contrast-125 opacity-70"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
    </div>

    <!-- Foreground Content (Database-Driven) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative z-10 w-full">
      <div v-reveal="{ y: 18, duration: 0.7 }" class="max-w-3xl space-y-4 sm:space-y-6">
        <div
          v-if="settingsStore.settings?.topbar_date || settingsStore.settings?.topbar_location"
          class="text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-slate-500 leading-snug"
        >
          {{ settingsStore.settings?.topbar_date }}
          <span v-if="settingsStore.settings?.topbar_date && settingsStore.settings?.topbar_location">&nbsp;•&nbsp;</span>
          {{ settingsStore.settings?.topbar_location }}
        </div>

        <h1 class="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.12] sm:leading-[1.08] break-words">
          <template v-if="settingsStore.settings?.hero_headline_1">{{ settingsStore.settings?.hero_headline_1 }}<br /></template>
          <span v-if="settingsStore.settings?.hero_headline_2" class="text-[#006432]">{{ settingsStore.settings?.hero_headline_2 }}<br /></span>
          <span v-if="settingsStore.settings?.hero_headline_3" class="text-[#b38856]">{{ settingsStore.settings?.hero_headline_3 }}</span>
        </h1>

        <p v-if="settingsStore.settings?.hero_tagline" class="text-xs sm:text-base text-slate-700 font-medium leading-relaxed max-w-md pt-1 sm:pt-2">
          {{ settingsStore.settings?.hero_tagline }}
        </p>
      </div>
    </div>
  </div>
</template>
