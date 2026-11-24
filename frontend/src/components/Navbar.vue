<script setup lang="ts">
import { ref, computed } from 'vue'
import { Shield, Menu, X } from 'lucide-vue-next'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useSettingsStore } from '@/stores/settingsStore'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const isMobileMenuOpen = ref(false)

const currentTab = computed(() => {
  const p = route.path
  if (p === '/tentang') return 'tentang'
  if (p === '/agenda') return 'agenda'
  if (p === '/berita' || p.startsWith('/artikel/')) return 'berita'
  if (p === '/galeri') return 'galeri'
  if (p === '/informasi') return 'informasi'
  return 'beranda'
})

const isDarkNavbar = computed(() => {
  const style = settingsStore.settings.navbar_style || 'white'
  if (style === 'primary' || style === 'dark') return true
  const hex = settingsStore.settings.navbar_bg_color
  if (!hex || hex === '#ffffff') return false
  const c = hex.replace('#', '')
  if (c.length === 6) {
    const r = parseInt(c.substring(0, 2), 16)
    const g = parseInt(c.substring(2, 4), 16)
    const b = parseInt(c.substring(4, 6), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness < 150
  }
  return false
})

const navbarBackground = computed(() => {
  const style = settingsStore.settings.navbar_style || 'white'
  if (style === 'primary') return 'var(--site-primary, #008f8a)'
  if (style === 'dark') return settingsStore.settings.footer_bg_color || 'var(--site-footer-bg, #042623)'
  return settingsStore.settings.navbar_bg_color || '#ffffff'
})

function navigateTo(targetPath: string) {
  isMobileMenuOpen.value = false
  if (route.path === targetPath) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    router.push(targetPath)
  }
}
</script>

<template>
  <header 
    class="w-full backdrop-blur-md border-b sticky top-0 z-50 transition-colors duration-300 border-t-3 sm:border-t-4"
    :style="{
      backgroundColor: navbarBackground,
      borderTopColor: 'var(--site-primary, #008f8a)',
      borderBottomColor: isDarkNavbar ? 'rgba(255, 255, 255, 0.1)' : '#f1f5f9'
    }"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 sm:h-20 gap-3">
        <!-- Logo & Title (Responsive: never wraps awkwardly) -->
        <RouterLink 
          to="/"
          @click="isMobileMenuOpen = false" 
          class="flex items-center gap-2.5 sm:gap-3 group cursor-pointer min-w-0"
        >
          <!-- Custom Uploaded Logo (Transparent & Precise) -->
          <div
            v-if="settingsStore.settings.logo_image_url"
            class="h-9 sm:h-10 max-h-10 flex items-center justify-center shrink-0"
          >
            <img
              :src="settingsStore.settings.logo_image_url"
              :alt="settingsStore.settings.site_title || 'Logo'"
              class="h-full w-auto max-w-[140px] object-contain drop-shadow-xs"
            />
          </div>

          <!-- Fallback Badge Emblem (When no custom logo is uploaded) -->
          <div
            v-else
            class="w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center p-0.5 shrink-0 shadow-2xs overflow-hidden"
            :class="[isDarkNavbar ? 'border-white/20 bg-white/10' : 'border-slate-200 bg-white']"
          >
            <svg viewBox="0 0 100 100" class="w-full h-full">
              <circle cx="50" cy="50" r="46" :fill="isDarkNavbar ? '#0f172a' : '#f8fafc'" stroke="#008f8a" stroke-width="4" stroke-dasharray="180 50" />
              <circle cx="50" cy="50" r="36" fill="none" stroke="#b38856" stroke-width="3" />
              <text x="50" y="58" font-family="sans-serif" font-size="28" font-weight="900" fill="#008f8a" text-anchor="middle">
                {{ settingsStore.settings.navbar_badge || '35' }}
              </text>
            </svg>
          </div>

          <div class="flex flex-col min-w-0">
            <span 
              class="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold leading-tight truncate transition-colors"
              :class="[isDarkNavbar ? 'text-white/80' : 'text-slate-500']"
            >
              {{ settingsStore.settings.site_title || 'Muktamar Ke-35' }}
            </span>
            <span 
              class="font-bold text-sm sm:text-base lg:text-lg tracking-tight leading-tight transition-colors truncate"
              :class="[isDarkNavbar ? 'text-white' : 'text-slate-900 group-hover:text-[#008f8a]']"
            >
              {{ settingsStore.settings.site_subtitle || 'Nahdlatul Ulama' }}
            </span>
          </div>
        </RouterLink>

        <!-- Desktop Navigation Menu (Direct Page Navigation) -->
        <nav 
          class="hidden md:flex items-center gap-5 lg:gap-7 text-[13px] font-medium transition-colors"
          :class="[isDarkNavbar ? 'text-white/80' : 'text-slate-700']"
        >
          <button
            type="button"
            @click="navigateTo('/')"
            class="transition-colors pb-1 cursor-pointer"
            :class="[
              currentTab === 'beranda'
                ? (isDarkNavbar ? 'text-white font-bold border-b-2 border-white' : 'text-[#008f8a] font-semibold border-b-2 border-[#008f8a]')
                : (isDarkNavbar ? 'hover:text-white' : 'hover:text-[#008f8a]')
            ]"
          >
            Beranda
          </button>

          <button
            type="button"
            @click="navigateTo('/tentang')"
            class="transition-colors pb-1 cursor-pointer"
            :class="[
              currentTab === 'tentang'
                ? (isDarkNavbar ? 'text-white font-bold border-b-2 border-white' : 'text-[#008f8a] font-semibold border-b-2 border-[#008f8a]')
                : (isDarkNavbar ? 'hover:text-white' : 'hover:text-[#008f8a]')
            ]"
          >
            Tentang
          </button>

          <button
            type="button"
            @click="navigateTo('/agenda')"
            class="transition-colors pb-1 cursor-pointer"
            :class="[
              currentTab === 'agenda'
                ? (isDarkNavbar ? 'text-white font-bold border-b-2 border-white' : 'text-[#008f8a] font-semibold border-b-2 border-[#008f8a]')
                : (isDarkNavbar ? 'hover:text-white' : 'hover:text-[#008f8a]')
            ]"
          >
            Agenda
          </button>

          <button
            type="button"
            @click="navigateTo('/berita')"
            class="transition-colors pb-1 cursor-pointer"
            :class="[
              currentTab === 'berita'
                ? (isDarkNavbar ? 'text-white font-bold border-b-2 border-white' : 'text-[#008f8a] font-semibold border-b-2 border-[#008f8a]')
                : (isDarkNavbar ? 'hover:text-white' : 'hover:text-[#008f8a]')
            ]"
          >
            Berita
          </button>

          <button
            type="button"
            @click="navigateTo('/galeri')"
            class="transition-colors pb-1 cursor-pointer"
            :class="[
              currentTab === 'galeri'
                ? (isDarkNavbar ? 'text-white font-bold border-b-2 border-white' : 'text-[#008f8a] font-semibold border-b-2 border-[#008f8a]')
                : (isDarkNavbar ? 'hover:text-white' : 'hover:text-[#008f8a]')
            ]"
          >
            Galeri
          </button>

          <button
            type="button"
            @click="navigateTo('/informasi')"
            class="transition-colors pb-1 cursor-pointer"
            :class="[
              currentTab === 'informasi'
                ? (isDarkNavbar ? 'text-white font-bold border-b-2 border-white' : 'text-[#008f8a] font-semibold border-b-2 border-[#008f8a]')
                : (isDarkNavbar ? 'hover:text-white' : 'hover:text-[#008f8a]')
            ]"
          >
            Informasi Umum
          </button>

          <RouterLink
            to="/admin/settings"
            class="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ml-2"
            :class="[isDarkNavbar ? 'text-white/85 hover:text-white bg-white/15 px-2.5 py-1 rounded-lg' : 'text-slate-400 hover:text-[#008f8a]']"
            title="Kelola Konten di CMS"
          >
            <Shield class="w-3.5 h-3.5" />
            <span>CMS</span>
          </RouterLink>
        </nav>

        <!-- Mobile Hamburger Button -->
        <div class="flex items-center gap-2 md:hidden">
          <RouterLink
            to="/admin/settings"
            class="p-2 rounded-xl transition-colors"
            :class="[isDarkNavbar ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-[#008f8a]']"
            title="CMS"
          >
            <Shield class="w-4 h-4" />
          </RouterLink>

          <button
            type="button"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="p-2 rounded-xl transition-colors cursor-pointer"
            :class="[isDarkNavbar ? 'text-white hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100']"
            aria-label="Buka Menu"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6 text-[#008f8a]" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Menu (Navigates to Individual Pages) -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden border-b px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200"
      :style="{
        backgroundColor: navbarBackground,
        borderBottomColor: isDarkNavbar ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0'
      }"
    >
      <button
        type="button"
        @click="navigateTo('/')"
        class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between"
        :class="[
          currentTab === 'beranda'
            ? (isDarkNavbar ? 'bg-white/20 text-white' : 'bg-[#008f8a]/10 text-[#008f8a]')
            : (isDarkNavbar ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50')
        ]"
      >
        <span>Beranda</span>
        <span v-if="currentTab === 'beranda'" class="w-1.5 h-1.5 rounded-full" :class="[isDarkNavbar ? 'bg-white' : 'bg-[#008f8a]']"></span>
      </button>

      <button
        type="button"
        @click="navigateTo('/tentang')"
        class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between"
        :class="[
          currentTab === 'tentang'
            ? (isDarkNavbar ? 'bg-white/20 text-white' : 'bg-[#008f8a]/10 text-[#008f8a]')
            : (isDarkNavbar ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50')
        ]"
      >
        <span>Tentang</span>
        <span v-if="currentTab === 'tentang'" class="w-1.5 h-1.5 rounded-full" :class="[isDarkNavbar ? 'bg-white' : 'bg-[#008f8a]']"></span>
      </button>

      <button
        type="button"
        @click="navigateTo('/agenda')"
        class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between"
        :class="[
          currentTab === 'agenda'
            ? (isDarkNavbar ? 'bg-white/20 text-white' : 'bg-[#008f8a]/10 text-[#008f8a]')
            : (isDarkNavbar ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50')
        ]"
      >
        <span>Agenda</span>
        <span v-if="currentTab === 'agenda'" class="w-1.5 h-1.5 rounded-full" :class="[isDarkNavbar ? 'bg-white' : 'bg-[#008f8a]']"></span>
      </button>

      <button
        type="button"
        @click="navigateTo('/berita')"
        class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between"
        :class="[
          currentTab === 'berita'
            ? (isDarkNavbar ? 'bg-white/20 text-white' : 'bg-[#008f8a]/10 text-[#008f8a]')
            : (isDarkNavbar ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50')
        ]"
      >
        <span>Berita</span>
        <span v-if="currentTab === 'berita'" class="w-1.5 h-1.5 rounded-full" :class="[isDarkNavbar ? 'bg-white' : 'bg-[#008f8a]']"></span>
      </button>

      <button
        type="button"
        @click="navigateTo('/galeri')"
        class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between"
        :class="[
          currentTab === 'galeri'
            ? (isDarkNavbar ? 'bg-white/20 text-white' : 'bg-[#008f8a]/10 text-[#008f8a]')
            : (isDarkNavbar ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50')
        ]"
      >
        <span>Galeri</span>
        <span v-if="currentTab === 'galeri'" class="w-1.5 h-1.5 rounded-full" :class="[isDarkNavbar ? 'bg-white' : 'bg-[#008f8a]']"></span>
      </button>

      <button
        type="button"
        @click="navigateTo('/informasi')"
        class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between"
        :class="[
          currentTab === 'informasi'
            ? (isDarkNavbar ? 'bg-white/20 text-white' : 'bg-[#008f8a]/10 text-[#008f8a]')
            : (isDarkNavbar ? 'text-white/80 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-50')
        ]"
      >
        <span>Informasi Umum</span>
        <span v-if="currentTab === 'informasi'" class="w-1.5 h-1.5 rounded-full" :class="[isDarkNavbar ? 'bg-white' : 'bg-[#008f8a]']"></span>
      </button>

      <div 
        class="pt-3 border-t flex items-center justify-between px-2 text-xs"
        :class="[isDarkNavbar ? 'border-white/10 text-white/70' : 'border-slate-100 text-slate-500']"
      >
        <RouterLink
          to="/admin/settings"
          @click="isMobileMenuOpen = false"
          class="inline-flex items-center gap-1.5 font-bold"
          :class="[isDarkNavbar ? 'text-white hover:underline' : 'text-[#008f8a]']"
        >
          <Shield class="w-4 h-4" />
          <span>Panel Admin CMS</span>
        </RouterLink>
        <span>Jombang 2026</span>
      </div>
    </div>
  </header>
</template>
