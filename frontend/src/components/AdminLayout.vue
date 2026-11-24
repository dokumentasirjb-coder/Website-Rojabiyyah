<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { 
  LayoutDashboard, 
  Layers, 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Bell, 
  User, 
  Menu, 
  X,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useSettingsStore } from '@/stores/settingsStore'

const authStore = useAuthStore()
const settingsStore = useSettingsStore()
const router = useRouter()
const route = useRoute()

const isMobileSidebarOpen = ref(false)

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-[#071913] text-slate-100 flex font-sans antialiased selection:bg-[#008f8a] selection:text-white">
    <!-- Mobile Backdrop -->
    <div
      v-if="isMobileSidebarOpen"
      class="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
      @click="isMobileSidebarOpen = false"
    ></div>

    <!-- LEFT SIDEBAR -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-[#051510] border-r border-[#0e2c22] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0"
      :class="[isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0']"
    >
      <!-- Top Section (Brand & Nav) -->
      <div class="flex-1 overflow-y-auto py-5 px-4 space-y-6">
        <!-- Brand Header -->
        <div class="flex items-center justify-between px-2">
          <RouterLink to="/admin/content" class="flex items-center gap-3 group">
            <!-- Custom Uploaded Logo (Synchronized with Public Site) -->
            <div
              v-if="settingsStore.settings.logo_image_url"
              class="h-10 max-h-10 flex items-center justify-center shrink-0"
            >
              <img
                :src="settingsStore.settings.logo_image_url"
                :alt="settingsStore.settings.site_title || 'Logo'"
                class="h-full w-auto max-w-[110px] object-contain drop-shadow-sm"
              />
            </div>
            <!-- Fallback Badge Emblem (When no custom logo is uploaded) -->
            <div
              v-else
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#008f8a] to-[#005a40] text-white flex items-center justify-center font-bold text-sm shadow-md ring-1 ring-white/10 shrink-0"
            >
              <span class="font-serif">{{ settingsStore.settings.navbar_badge || 'NU' }}</span>
            </div>

            <div class="min-w-0">
              <span class="block text-xs font-bold text-white tracking-tight leading-tight truncate group-hover:text-emerald-400 transition-colors">
                {{ settingsStore.settings.site_title || 'Muktamar NU' }}
              </span>
              <span class="block text-[10px] text-emerald-400/80 font-medium truncate mt-0.5">
                {{ authStore.user?.role || 'Super Admin' }}
              </span>
            </div>
          </RouterLink>

          <!-- Mobile Close Button -->
          <button
            type="button"
            @click="isMobileSidebarOpen = false"
            class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 lg:hidden"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Sidebar Navigation Groups -->
        <nav class="space-y-6 text-xs">
          <!-- GROUP 1: RINGKASAN -->
          <div class="space-y-1.5">
            <span class="px-3 text-[10px] font-bold tracking-wider uppercase text-slate-300">
              RINGKASAN
            </span>
            <RouterLink
              to="/admin/content"
              @click="isMobileSidebarOpen = false"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all group"
              :class="[
                route.path === '/admin' || (route.path === '/admin/content' && (!route.query.tab || route.query.tab === 'ringkasan'))
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              ]"
            >
              <LayoutDashboard 
                class="w-4 h-4 transition-colors" 
                :class="[route.path === '/admin' || (route.path === '/admin/content' && (!route.query.tab || route.query.tab === 'ringkasan')) ? 'text-[#008f8a]' : 'text-slate-300 group-hover:text-white']" 
              />
              <span>Dashboard</span>
            </RouterLink>
          </div>

          <!-- GROUP 2: KONTEN & PENGATURAN -->
          <div class="space-y-1.5">
            <span class="px-3 text-[10px] font-bold tracking-wider uppercase text-emerald-300/80">
              KONTEN & PENGATURAN
            </span>

            <RouterLink
              to="/admin/content"
              @click="isMobileSidebarOpen = false"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all group"
              :class="[
                route.path === '/admin/content' && (!route.query.tab || route.query.tab === 'ringkasan')
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              ]"
            >
              <Layers 
                class="w-4 h-4 transition-colors" 
                :class="[route.path === '/admin/content' && (!route.query.tab || route.query.tab === 'ringkasan') ? 'text-[#008f8a]' : 'text-slate-300 group-hover:text-white']" 
              />
              <span class="flex-1">Konten Situs</span>
            </RouterLink>

            <RouterLink
              to="/admin/content?tab=berita"
              @click="isMobileSidebarOpen = false"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all group"
              :class="[
                route.query.tab === 'berita' || route.path.startsWith('/admin/articles')
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              ]"
            >
              <Newspaper 
                class="w-4 h-4 transition-colors" 
                :class="[route.query.tab === 'berita' || route.path.startsWith('/admin/articles') ? 'text-[#008f8a]' : 'text-slate-300 group-hover:text-white']" 
              />
              <span>Berita & Liputan</span>
            </RouterLink>

            <RouterLink
              to="/admin/content?tab=agenda"
              @click="isMobileSidebarOpen = false"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all group"
              :class="[
                route.query.tab === 'agenda' || route.path.startsWith('/admin/announcements')
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              ]"
            >
              <Calendar 
                class="w-4 h-4 transition-colors" 
                :class="[route.query.tab === 'agenda' || route.path.startsWith('/admin/announcements') ? 'text-[#008f8a]' : 'text-slate-300 group-hover:text-white']" 
              />
              <span>Agenda Acara</span>
            </RouterLink>

            <RouterLink
              to="/admin/content?tab=galeri"
              @click="isMobileSidebarOpen = false"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all group"
              :class="[
                route.query.tab === 'galeri' || route.path.startsWith('/admin/gallery')
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              ]"
            >
              <ImageIcon 
                class="w-4 h-4 transition-colors" 
                :class="[route.query.tab === 'galeri' || route.path.startsWith('/admin/gallery') ? 'text-[#008f8a]' : 'text-slate-300 group-hover:text-white']" 
              />
              <span>Galeri Foto</span>
            </RouterLink>

            <RouterLink
              to="/admin/content?tab=informasi"
              @click="isMobileSidebarOpen = false"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all group"
              :class="[
                route.query.tab === 'informasi'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              ]"
            >
              <Info 
                class="w-4 h-4 transition-colors" 
                :class="[route.query.tab === 'informasi' ? 'text-[#008f8a]' : 'text-slate-300 group-hover:text-white']" 
              />
              <span>Informasi Umum</span>
            </RouterLink>

            <RouterLink
              to="/admin/settings"
              @click="isMobileSidebarOpen = false"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all group"
              :class="[
                route.path.startsWith('/admin/settings')
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              ]"
            >
              <Settings 
                class="w-4 h-4 transition-colors" 
                :class="[route.path.startsWith('/admin/settings') ? 'text-[#008f8a]' : 'text-slate-300 group-hover:text-white']" 
              />
              <span>Pengaturan Tampilan</span>
            </RouterLink>
          </div>
        </nav>
      </div>

      <!-- Bottom User Section -->
      <div class="p-4 border-t border-[#0e2c22] bg-[#04120e]">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0">
              {{ authStore.user?.name?.charAt(0) || 'S' }}
            </div>
            <div class="min-w-0">
              <span class="block text-xs font-bold text-white truncate">
                {{ authStore.user?.name || 'Super Admin' }}
              </span>
              <span class="block text-[10px] text-emerald-400/70 truncate capitalize">
                {{ authStore.user?.role || 'Superadmin' }}
              </span>
            </div>
          </div>

          <button
            type="button"
            @click="handleLogout"
            class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5 transition-colors cursor-pointer"
            title="Keluar"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>

    <!-- MAIN WRAPPER (Offset by sidebar width on lg) -->
    <div class="flex-1 flex flex-col min-w-0 lg:pl-64">
      <!-- TOP HEADER BAR (Matching reference) -->
      <header class="h-16 bg-[#051510]/80 backdrop-blur-md border-b border-[#0e2c22] sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8">
        <!-- Left Greeting & Mobile Toggle -->
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="isMobileSidebarOpen = true"
            class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 lg:hidden cursor-pointer"
          >
            <Menu class="w-5 h-5" />
          </button>

          <div>
            <h2 class="text-xs sm:text-sm font-semibold text-white tracking-tight">
              Assalamu'alaikum, {{ authStore.user?.name || 'Super Admin' }}
            </h2>
            <p class="text-[10px] sm:text-xs text-emerald-400/80 capitalize">
              {{ authStore.user?.role || 'Superadmin' }}
            </p>
          </div>
        </div>

        <!-- Right Action Items -->
        <div class="flex items-center gap-3">
          <!-- Notification Icon -->
          <button
            type="button"
            class="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Notifikasi"
          >
            <Bell class="w-4 h-4" />
          </button>

          <!-- Akun Pill Button -->
          <div class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
            <User class="w-3.5 h-3.5 text-emerald-400" />
            <span>Akun</span>
          </div>

          <!-- View Website External Link -->
          <RouterLink
            to="/"
            target="_blank"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/20 transition-colors"
          >
            <span>Lihat Website</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </RouterLink>
        </div>
      </header>

      <!-- PAGE CONTENT AREA -->
      <main class="flex-1 p-4 sm:p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>
