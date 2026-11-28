<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

const MONTH_MAP: Record<string, number> = {
  januari: 0,
  februari: 1,
  maret: 2,
  april: 3,
  mei: 4,
  juni: 5,
  juli: 6,
  agustus: 7,
  september: 8,
  oktober: 9,
  november: 10,
  desember: 11,
}

function parseIndoDateTime(dateStr?: string, timeStr?: string): number | null {
  if (!dateStr) return null
  const match = dateStr.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/)
  if (!match) return null
  const day = parseInt(match[1], 10)
  const monthIdx = MONTH_MAP[match[2].toLowerCase()]
  const year = parseInt(match[3], 10)
  if (monthIdx === undefined || Number.isNaN(day) || Number.isNaN(year)) return null

  let hours = 8
  let minutes = 0
  if (timeStr) {
    const tMatch = timeStr.match(/(\d{1,2})[:.](\d{2})/)
    if (tMatch) {
      hours = parseInt(tMatch[1], 10)
      minutes = parseInt(tMatch[2], 10)
    }
  }
  return new Date(year, monthIdx, day, hours, minutes, 0).getTime()
}

const nowMs = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null

const nextAgendaTarget = computed(() => {
  const days = settingsStore.settings.agenda_schedules_json || []
  const candidates: { ts: number; label: string }[] = []

  for (const d of days) {
    if (Array.isArray(d.items) && d.items.length > 0) {
      for (const item of d.items) {
        const ts = parseIndoDateTime(d.fullDate || d.dayDate, item.time)
        if (ts) {
          candidates.push({ ts, label: item.title || d.theme || 'Rangkaian Acara' })
        }
      }
    } else {
      const ts = parseIndoDateTime(d.fullDate || d.dayDate)
      if (ts) {
        candidates.push({ ts, label: d.theme || 'Rangkaian Acara' })
      }
    }
  }

  candidates.sort((a, b) => a.ts - b.ts)
  const upcoming = candidates.find((c) => c.ts > nowMs.value)
  if (upcoming) return upcoming

  if (candidates.length > 0) {
    return candidates[candidates.length - 1]
  }

  // Fallback puncak acara dari pengaturan / default
  const fallbackTs = new Date(2026, 11, 16, 8, 0, 0).getTime()
  return { ts: fallbackTs, label: 'Puncak Haul Abah Ke-5' }
})

const countdown = computed(() => {
  const diff = nextAgendaTarget.value.ts - nowMs.value
  if (diff <= 0) {
    return { isLive: true, days: '00', hours: '00', minutes: '00', seconds: '00' }
  }
  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return {
    isLive: false,
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }
})

onMounted(() => {
  timer = setInterval(() => {
    nowMs.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
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

        <!-- Live Countdown Widget -->
        <div class="pt-3 sm:pt-4">
          <div
            v-if="countdown.isLive"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold tracking-wider uppercase"
          >
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ACARA SEDANG BERLANGSUNG</span>
          </div>

          <div
            v-else
            class="inline-flex flex-col gap-2 bg-white/10 border border-white/15 rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5"
          >
            <div class="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d4af37] truncate max-w-[280px] sm:max-w-md">
              Menuju {{ nextAgendaTarget.label }}
            </div>
            <div class="flex items-center gap-2 sm:gap-3 text-white tabular-nums">
              <div class="text-center min-w-[44px]">
                <span class="block text-xl sm:text-2xl font-extrabold leading-none">{{ countdown.days }}</span>
                <span class="block text-[9px] uppercase tracking-wider text-slate-300 mt-1">Hari</span>
              </div>
              <span class="text-lg font-bold text-white/40 -mt-3">:</span>
              <div class="text-center min-w-[40px]">
                <span class="block text-xl sm:text-2xl font-extrabold leading-none">{{ countdown.hours }}</span>
                <span class="block text-[9px] uppercase tracking-wider text-slate-300 mt-1">Jam</span>
              </div>
              <span class="text-lg font-bold text-white/40 -mt-3">:</span>
              <div class="text-center min-w-[40px]">
                <span class="block text-xl sm:text-2xl font-extrabold leading-none">{{ countdown.minutes }}</span>
                <span class="block text-[9px] uppercase tracking-wider text-slate-300 mt-1">Menit</span>
              </div>
              <span class="text-lg font-bold text-white/40 -mt-3">:</span>
              <div class="text-center min-w-[40px]">
                <span class="block text-xl sm:text-2xl font-extrabold leading-none text-[#d4af37]">{{ countdown.seconds }}</span>
                <span class="block text-[9px] uppercase tracking-wider text-slate-300 mt-1">Detik</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
