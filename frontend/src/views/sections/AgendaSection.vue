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
