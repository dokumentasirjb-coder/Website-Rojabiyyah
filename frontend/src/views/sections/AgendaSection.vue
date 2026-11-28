<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'
import { useSettingsStore, DEFAULT_SCHEDULE_DAYS } from '@/stores/settingsStore'
import type { ScheduleDay, ScheduleItem } from '@/types'

const settingsStore = useSettingsStore()

const scheduleDays = computed<ScheduleDay[]>(() => {
  if (Array.isArray(settingsStore.settings.agenda_schedules_json)) {
    return settingsStore.settings.agenda_schedules_json
  }
  return DEFAULT_SCHEDULE_DAYS
})

const activeDay = ref(scheduleDays.value[0]?.id || 'rabu')

function toggleAccordion(item: ScheduleItem) {
  item.isOpen = !item.isOpen
}

const MONTH_MAP: Record<string, number> = {
  januari: 1,
  februari: 2,
  maret: 3,
  april: 4,
  mei: 5,
  juni: 6,
  juli: 7,
  agustus: 8,
  september: 9,
  oktober: 10,
  november: 11,
  desember: 12,
}

function parseScheduleRange(fullDate: string, timeStr: string): { start: string; end: string } {
  const dMatch = (fullDate || '').match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/)
  const year = dMatch ? parseInt(dMatch[3], 10) : 2026
  const month = dMatch ? (MONTH_MAP[dMatch[2].toLowerCase()] || 12) : 12
  const day = dMatch ? parseInt(dMatch[1], 10) : 16

  const times = (timeStr || '').match(/(\d{1,2})[:.](\d{2})/g) || []
  const parseHM = (hm: string | undefined, defH: number, defM: number) => {
    if (!hm) return { h: defH, m: defM }
    const p = hm.split(/[:.]/)
    return { h: parseInt(p[0], 10) || defH, m: parseInt(p[1], 10) || defM }
  }

  const s = parseHM(times[0], 8, 0)
  const e = times[1] ? parseHM(times[1], s.h + 2, s.m) : { h: Math.min(23, s.h + 2), m: s.m }

  const pad = (n: number) => String(n).padStart(2, '0')
  const ymd = `${year}${pad(month)}${pad(day)}`
  return {
    start: `${ymd}T${pad(s.h)}${pad(s.m)}00`,
    end: `${ymd}T${pad(e.h)}${pad(e.m)}00`,
  }
}

function getAgendaWhatsAppUrl(day: ScheduleDay, item: ScheduleItem): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://panitiarojabiyyah.id'
  const lines = [
    `*${item.title}*`,
    `Hari/Tanggal: ${day.fullDate || day.dayDate}`,
    `Waktu: ${item.time}`,
    item.venue ? `Lokasi: ${item.venue}` : '',
    `Info lengkap: ${origin}/agenda`,
  ].filter(Boolean)
  return `https://wa.me/?text=${encodeURIComponent(lines.join('\n'))}`
}

function getGoogleCalendarUrl(day: ScheduleDay, item: ScheduleItem): string {
  const { start, end } = parseScheduleRange(day.fullDate || day.dayDate, item.time)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: item.title || 'Agenda Rojabiyyah & Haul Abah Ke-5',
    dates: `${start}/${end}`,
    details: `${day.theme || 'Rangkaian Acara Panitia Rojabiyyah & Haul Abah Ke-5'}${item.leader ? ` • Pimpinan: ${item.leader}` : ''}`,
    location: item.venue || 'Pondok Pesantren Bumi Damai Al-Muhibbin, Tambakberas, Jombang',
    ctz: 'Asia/Jakarta',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function downloadIcs(day: ScheduleDay, item: ScheduleItem) {
  const { start, end } = parseScheduleRange(day.fullDate || day.dayDate, item.time)
  const uid = `agenda-${day.id}-${item.id || Date.now()}@panitiarojabiyyah.id`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Panitia Rojabiyyah//Agenda//ID',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTART;TZID=Asia/Jakarta:${start}`,
    `DTEND;TZID=Asia/Jakarta:${end}`,
    `SUMMARY:${(item.title || '').replace(/[\r\n]+/g, ' ')}`,
    `DESCRIPTION:${(day.theme || 'Panitia Rojabiyyah & Haul Abah Ke-5').replace(/[\r\n]+/g, ' ')}`,
    `LOCATION:${(item.venue || 'PP Bumi Damai Al-Muhibbin, Tambakberas, Jombang').replace(/[\r\n]+/g, ' ')}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(item.title || 'agenda-rojabiyyah').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="bg-white">
    <!-- Top Hero Banner (Screenshot 3) -->
    <div class="relative bg-[#fbfbfa] border-b border-slate-100 overflow-hidden min-h-[380px] sm:min-h-[440px] flex items-center">
      <!-- Stadium/Hall Plenary Image with White Fade Overlay -->
      <div class="absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-3/5 z-0 bg-gradient-to-br from-slate-100 to-emerald-50/40">
        <img
          v-if="settingsStore.settings.banner_agenda_url"
          :src="settingsStore.settings.banner_agenda_url"
          alt="Banner Agenda Acara"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover object-center opacity-80"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#fbfbfa] via-[#fbfbfa]/75 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#fbfbfa] via-transparent to-transparent"></div>
      </div>

      <!-- Banner Header Text -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10 w-full">
        <div v-reveal="{ y: 20, duration: 0.65 }" class="max-w-2xl space-y-4">
          <span class="inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-[#008f8a]">
            {{ settingsStore.settings.agenda_tag || 'JADWAL RESMI' }}
          </span>
          <h1 class="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            {{ settingsStore.settings.agenda_title || 'Agenda Acara' }}
          </h1>
          <p class="text-sm sm:text-base text-slate-600 font-normal leading-relaxed pt-1">
            {{ settingsStore.settings.agenda_subtitle || 'Rangkaian acara Panitia Rojabiyyah & Haul Abah Ke-5 di Pondok Pesantren Bumi Damai Al-Muhibbin, Tambakberas, Jombang.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Day Selector Pill Bar (Screenshots 3 & 6) -->
    <div class="border-b border-slate-100 bg-white sticky top-16 sm:top-20 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div class="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
          <button
            v-for="d in scheduleDays"
            :key="d.id"
            type="button"
            @click="activeDay = d.id"
            class="px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer border text-center"
            :class="[
              activeDay === d.id
                ? 'bg-slate-50 border-slate-300 text-slate-900 shadow-2xs font-bold'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            ]"
          >
            <span class="block leading-tight">{{ d.dayName }}</span>
            <span class="block text-[10px] text-slate-400 font-normal">{{ d.dayDate }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Timetable Section (Screenshot 6 Layout) -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20">
      <div
        v-for="d in scheduleDays"
        :key="d.id"
        v-show="activeDay === d.id"
        class="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start"
      >
        <!-- Left Column: Date & Title (Screenshot 6 left) -->
        <div class="md:col-span-4 relative md:sticky md:top-36 space-y-1.5 sm:space-y-2 mb-2 md:mb-0">
          <span class="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#008f8a] block">
            {{ (d.dayName ?? '').toUpperCase() }}
          </span>
          <h2 class="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-none">
            {{ d.fullDate }}
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 font-normal pt-0.5 sm:pt-1">
            {{ d.theme }}
          </p>
        </div>

        <!-- Right Column: Clean Timetable Cards (Screenshot 6 right) -->
        <div class="md:col-span-8 space-y-3">
          <div
            v-for="(item, idx) in (d.items || [])"
            :key="idx"
            v-reveal="{ y: 18, delay: (idx % 4) * 0.06 }"
            class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 transition-all shadow-2xs"
            :class="{ 'bg-slate-50/50': item.isOpen }"
          >
            <div
              @click="toggleAccordion(item)"
              class="flex items-start justify-between gap-3 cursor-pointer"
            >
              <div class="flex flex-col sm:flex-row sm:items-baseline gap-1.5 sm:gap-6 flex-1">
                <span class="text-xs sm:text-sm font-bold sm:font-semibold text-[#008f8a] sm:text-slate-900 shrink-0 sm:w-28">
                  {{ item.time }}
                </span>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {{ item.title }}
                  </h3>
                  <div v-if="item.venue || item.leader" class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span v-if="item.venue">Tempat: <strong>{{ item.venue }}</strong></span>
                    <span v-if="item.leader">Pimpinan: <strong>{{ item.leader }}</strong></span>
                  </div>

                  <!-- Quick Action: Share WhatsApp Only -->
                  <div class="flex flex-wrap items-center gap-2 mt-3" @click.stop>
                    <a
                      :href="getAgendaWhatsAppUrl(d, item)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/70 text-[11px] font-semibold transition-colors"
                    >
                      <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 fill-current" aria-hidden="true">
                        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .15 5.34.15 11.91c0 2.1.55 4.15 1.6 5.96L0 24l6.31-1.65a11.86 11.86 0 0 0 5.75 1.47h.01c6.57 0 11.91-5.34 11.91-11.91 0-3.18-1.24-6.17-3.46-8.43Zm-8.46 18.33h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.52-5.27c0-5.46 4.44-9.9 9.91-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.91 9.9Z"/>
                      </svg>
                      <span>Bagikan ke WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Accordion Arrow -->
              <button
                type="button"
                class="p-1 text-slate-400 hover:text-slate-700 shrink-0 cursor-pointer"
                aria-label="Toggle details"
              >
                <ChevronUp v-if="item.isOpen" class="w-4 h-4" />
                <ChevronDown v-else class="w-4 h-4" />
              </button>
            </div>

            <!-- Inner Rundown Accordion Content -->
            <div v-if="item.isOpen && item.subItems && item.subItems.length > 0" class="mt-4 pt-4 border-t border-slate-100 pl-0 sm:pl-34 space-y-3">
              <div
                v-for="(sub, sIdx) in item.subItems"
                :key="sIdx"
                class="text-xs space-y-0.5"
              >
                <div class="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                  <span class="font-mono text-[11px] text-slate-400 shrink-0 sm:w-24">{{ sub.time }}</span>
                  <span class="font-semibold text-slate-800">{{ sub.title }}</span>
                </div>
                <div v-if="sub.sub" class="sm:pl-27 text-[11px] text-[#008f8a]">
                  {{ sub.sub }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
