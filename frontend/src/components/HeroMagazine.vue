<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Clock, 
  Calendar, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  DownloadCloud
} from 'lucide-vue-next'
import { useNewsStore } from '@/stores/newsStore'
import type { Article } from '@/types'

const newsStore = useNewsStore()

// Countdown target: 27 Agustus 2026 08:00 WIB
const targetDate = new Date('2026-08-27T08:00:00+07:00').getTime()
const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)
let timerInterval: any = null

function updateCountdown() {
  const now = new Date().getTime()
  const distance = targetDate - now

  if (distance > 0) {
    days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
  } else {
    days.value = 0
    hours.value = 0
    minutes.value = 0
    seconds.value = 0
  }
}

function handleArticleClick(article: Article) {
  newsStore.openArticle(article)
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(() => {
  updateCountdown()
  timerInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<template>
  <section id="hero-section" class="relative overflow-hidden bg-gradient-to-b from-[#022314] via-[#053b22] to-[#022314] text-white pt-8 pb-16 lg:pb-24">
    <!-- Subtle Background Pattern & Glow Elements -->
    <div class="absolute inset-0 opacity-15 islamic-pattern pointer-events-none"></div>
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-[#c59b27]/20 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute top-1/2 -left-40 w-96 h-96 bg-[#0b7c43]/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Top Pill & Official Badge -->
      <div class="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#c59b27]/40 text-[#f3e5ab] text-xs font-semibold tracking-wide uppercase shadow-sm">
          <Sparkles class="w-3.5 h-3.5 text-[#c59b27]" />
          <span>Portal Resmi Muktamar ke-35 Nahdlatul Ulama 2026</span>
        </div>

        <!-- Grand Theme Title (Official Tagline) -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-white drop-shadow-md">
          “Menjaga Marwah, Memperkaya Khidmah<br class="hidden sm:block" />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#fef08a]">
            untuk Kemaslahatan Bangsa”
          </span>
        </h1>

        <!-- Venue & Date Subtitle -->
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-emerald-100 font-light pt-2">
          <span class="inline-flex items-center gap-1.5 bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/10">
            <Calendar class="w-4 h-4 text-[#c59b27]" />
            27 – 31 Agustus 2026
          </span>
          <span class="inline-flex items-center gap-1.5 bg-black/30 px-3.5 py-1.5 rounded-xl border border-white/10">
            <MapPin class="w-4 h-4 text-[#c59b27]" />
            PP. Bahrul Ulum Tambakberas, Jombang, Jawa Timur
          </span>
        </div>

        <!-- Live Countdown Timer -->
        <div class="pt-6 w-full max-w-2xl">
          <div class="p-4 sm:p-6 rounded-2xl bg-black/35 backdrop-blur-md border border-[#c59b27]/40 shadow-xl">
            <div class="text-[11px] font-semibold uppercase tracking-widest text-[#f3e5ab] mb-3 text-center">
              Menuju Pembukaan Muktamar ke-35 NU
            </div>
            <div class="grid grid-cols-4 gap-2 sm:gap-4 text-center">
              <div class="p-2 sm:p-3 rounded-xl bg-white/10 border border-white/10">
                <span class="block text-2xl sm:text-4xl font-extrabold text-[#f3e5ab] font-mono leading-none">
                  {{ days }}
                </span>
                <span class="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider font-medium mt-1 block">Hari</span>
              </div>
              <div class="p-2 sm:p-3 rounded-xl bg-white/10 border border-white/10">
                <span class="block text-2xl sm:text-4xl font-extrabold text-[#f3e5ab] font-mono leading-none">
                  {{ hours.toString().padStart(2, '0') }}
                </span>
                <span class="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider font-medium mt-1 block">Jam</span>
              </div>
              <div class="p-2 sm:p-3 rounded-xl bg-white/10 border border-white/10">
                <span class="block text-2xl sm:text-4xl font-extrabold text-[#f3e5ab] font-mono leading-none">
                  {{ minutes.toString().padStart(2, '0') }}
                </span>
                <span class="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider font-medium mt-1 block">Menit</span>
              </div>
              <div class="p-2 sm:p-3 rounded-xl bg-white/10 border border-white/10">
                <span class="block text-2xl sm:text-4xl font-extrabold text-[#f3e5ab] font-mono leading-none">
                  {{ seconds.toString().padStart(2, '0') }}
                </span>
                <span class="text-[10px] sm:text-xs text-emerald-200 uppercase tracking-wider font-medium mt-1 block">Detik</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            type="button"
            @click="scrollToSection('berita-muktamar')"
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c59b27] to-[#d4af37] text-[#022314] font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c59b27]/30 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            Jelajahi Warta & Liputan <ArrowRight class="w-4 h-4" />
          </button>
          <button
            type="button"
            @click="scrollToSection('agenda-section')"
            class="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider border border-white/20 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <Calendar class="w-4 h-4 text-[#c59b27]" />
            Jadwal Rangkaian Acara
          </button>
          <button
            type="button"
            @click="scrollToSection('cek-registrasi-section')"
            class="px-6 py-3 rounded-xl bg-[#006432] hover:bg-[#0b7c43] text-emerald-100 font-semibold text-xs uppercase tracking-wider border border-[#c59b27]/40 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
          >
            <ShieldCheck class="w-4 h-4 text-[#f3e5ab]" />
            Cek Keaslian ID Card
          </button>
        </div>
      </div>

      <!-- Featured Story / News Showcase (Hero Cover & Highlights) -->
      <div class="mt-14 pt-10 border-t border-white/15">
        <div class="text-center mb-6">
          <span class="text-[11px] font-bold tracking-widest uppercase text-[#f3e5ab]">
            Liputan Khusus & Warta Utama
          </span>
          <h2 class="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
            Kabar Terkini Dari Meja Redaksi Muktamar
          </h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <!-- Main Hero Cover Article (Left 7/12) -->
          <div class="lg:col-span-7 flex flex-col">
            <div v-if="newsStore.isLoadingHome" class="h-96 rounded-2xl bg-white/10 animate-pulse"></div>
            <div
              v-else-if="newsStore.homeData.hero"
              @click="handleArticleClick(newsStore.homeData.hero)"
              class="group relative h-full min-h-[380px] lg:min-h-[460px] rounded-2xl overflow-hidden border border-[#c59b27]/30 bg-[#022314] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-end p-6 sm:p-8"
            >
              <img
                :src="newsStore.homeData.hero.cover_image"
                :alt="newsStore.homeData.hero.title"
                class="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#022314] via-[#022314]/75 to-transparent"></div>

              <div class="relative z-10 space-y-3">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-[#c59b27] text-[#022314] shadow-xs">
                    {{ newsStore.homeData.hero.category?.name || 'Utama' }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-[11px] text-emerald-200">
                    <Clock class="w-3.5 h-3.5 text-[#c59b27]" />
                    {{ newsStore.homeData.hero.reading_time }}
                  </span>
                </div>

                <h3 class="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug group-hover:text-[#f3e5ab] transition-colors">
                  {{ newsStore.homeData.hero.title }}
                </h3>

                <p class="text-xs sm:text-sm text-emerald-100 line-clamp-2 font-light leading-relaxed">
                  {{ newsStore.homeData.hero.excerpt }}
                </p>

                <div class="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-emerald-200">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-[#c59b27] text-[#022314] flex items-center justify-center font-bold text-xs uppercase">
                      {{ newsStore.homeData.hero.author?.name?.charAt(0) || 'M' }}
                    </div>
                    <span>{{ newsStore.homeData.hero.author?.name || 'Media Center Muktamar' }}</span>
                  </div>
                  <span class="inline-flex items-center gap-1 font-semibold text-[#f3e5ab] group-hover:translate-x-1 transition-transform">
                    Baca Liputan <ArrowRight class="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Highlight Articles (Right 5/12) -->
          <div class="lg:col-span-5 flex flex-col justify-between gap-4">
            <template v-if="newsStore.isLoadingHome">
              <div class="h-52 rounded-2xl bg-white/10 animate-pulse"></div>
              <div class="h-52 rounded-2xl bg-white/10 animate-pulse"></div>
            </template>
            <template v-else-if="newsStore.homeData.highlights && newsStore.homeData.highlights.length > 0">
              <article
                v-for="item in newsStore.homeData.highlights.slice(0, 2)"
                :key="item.id"
                @click="handleArticleClick(item)"
                class="group bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 hover:border-[#c59b27]/50 p-4 sm:p-5 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:bg-white/15"
              >
                <div class="flex gap-4">
                  <div class="w-24 sm:w-28 h-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-black/40">
                    <img
                      :src="item.cover_image"
                      :alt="item.title"
                      class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center gap-2 text-[10px] text-emerald-300 mb-1">
                      <span class="text-[#f3e5ab] font-semibold">{{ item.category?.name || 'Warta' }}</span>
                      <span>•</span>
                      <span>{{ item.reading_time }}</span>
                    </div>
                    <h4 class="font-serif text-sm sm:text-base font-bold text-white group-hover:text-[#f3e5ab] line-clamp-2 leading-snug transition-colors">
                      {{ item.title }}
                    </h4>
                    <p class="text-[11px] text-emerald-100 line-clamp-2 mt-1 font-light">
                      {{ item.excerpt }}
                    </p>
                  </div>
                </div>

                <div class="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-emerald-300">
                  <span>{{ item.published_at_formatted || 'Baru dirilis' }}</span>
                  <span class="inline-flex items-center gap-1 font-semibold text-[#f3e5ab] group-hover:translate-x-1 transition-transform">
                    Selengkapnya <ArrowRight class="w-3 h-3" />
                  </span>
                </div>
              </article>
            </template>

            <!-- Quick Info Box -->
            <div class="p-4 rounded-2xl bg-gradient-to-r from-[#c59b27]/20 to-[#006432]/40 border border-[#c59b27]/40 flex items-center justify-between gap-3">
              <div>
                <span class="text-xs font-bold text-[#f3e5ab] block">Media Center & Pusat Informasi</span>
                <span class="text-[11px] text-emerald-100">Layanan siaran pers, dokumentasi & live streaming resmi.</span>
              </div>
              <button
                type="button"
                @click="scrollToSection('media-center-section')"
                class="px-3 py-1.5 rounded-lg bg-[#c59b27] text-[#022314] font-bold text-[10px] uppercase hover:brightness-110 shrink-0 cursor-pointer"
              >
                Unduh Kit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
