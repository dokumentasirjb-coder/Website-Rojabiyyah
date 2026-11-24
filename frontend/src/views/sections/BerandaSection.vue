<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/stores/settingsStore'

const router = useRouter()
const settingsStore = useSettingsStore()

function goTo(path: string) {
  router.push(path)
}
</script>

<template>
  <div class="relative min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-80px)] flex items-center bg-white overflow-hidden">
    <!-- Background Image: People holding flags across the field with heavy white fog/fade overlay -->
    <div class="absolute inset-0 z-0">
      <img
        :src="settingsStore.settings.banner_beranda_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=80'"
        alt="Latar Belakang Muktamar"
        class="w-full h-full object-cover object-center grayscale contrast-125 opacity-70"
      />
      <!-- Fade overlays matching Screenshot 1 -->
      <div class="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
    </div>

    <!-- Foreground Content (Responsive on Mobile & Desktop) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 relative z-10 w-full">
      <div class="max-w-3xl space-y-4 sm:space-y-6">
        <!-- Date & Location Subtitle (Admin Controlled) -->
        <div class="text-[10px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase text-slate-500 leading-snug">
          {{ settingsStore.settings.topbar_date || '27–31 AGUSTUS 2026' }} &nbsp;•&nbsp; {{ settingsStore.settings.topbar_location || 'JOMBANG, JAWA TIMUR' }}
        </div>

        <!-- Grand Headline (Responsive: text-3xl on mobile, text-5xl on tablet, text-7xl on desktop) -->
        <h1 class="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.12] sm:leading-[1.08] break-words">
          {{ settingsStore.settings.hero_headline_1 || 'Muktamar' }}<br />
          <span class="text-[#006432]">{{ settingsStore.settings.hero_headline_2 || 'Nahdlatul Ulama' }}</span><br />
          <span class="text-[#b38856]">{{ settingsStore.settings.hero_headline_3 || 'Ke-35' }}</span>
        </h1>

        <!-- Tagline (Admin Controlled) -->
        <p class="text-xs sm:text-base text-slate-700 font-medium leading-relaxed max-w-md pt-1 sm:pt-2">
          {{ settingsStore.settings.hero_tagline || 'Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa' }}
        </p>

        <!-- Action Links to Dedicated Pages -->
        <div class="pt-3 sm:pt-4 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold">
          <button
            type="button"
            @click="goTo('/tentang')"
            class="text-[#008f8a] hover:underline flex items-center gap-1 cursor-pointer py-1"
          >
            <span>Tentang Muktamar</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            @click="goTo('/agenda')"
            class="text-slate-600 hover:text-slate-900 cursor-pointer py-1"
          >
            <span>Lihat Jadwal Agenda &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
