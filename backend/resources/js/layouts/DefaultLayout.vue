<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { Newspaper, Bell, BookOpen, Menu, X } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
    <!-- Header / Navbar -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <RouterLink to="/" class="flex items-center gap-3 group">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              R
            </div>
            <div>
              <span class="font-serif text-xl font-bold tracking-tight text-slate-900 block leading-tight">
                Rojabiyyah
              </span>
              <span class="text-xs text-slate-500 block">Portal Berita & Informasi</span>
            </div>
          </RouterLink>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <RouterLink
              to="/"
              class="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              active-class="text-emerald-700 bg-emerald-50 font-semibold"
            >
              Beranda
            </RouterLink>
            <RouterLink
              to="/artikel"
              class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              active-class="text-emerald-700 bg-emerald-50 font-semibold"
            >
              <BookOpen class="w-4 h-4" />
              Artikel
            </RouterLink>
            <RouterLink
              to="/pengumuman"
              class="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
              active-class="text-emerald-700 bg-emerald-50 font-semibold"
            >
              <Bell class="w-4 h-4" />
              Pengumuman & Agenda
            </RouterLink>
          </nav>

          <!-- Mobile Hamburger -->
          <div class="flex md:hidden">
            <button
              type="button"
              @click="isMobileMenuOpen = !isMobileMenuOpen"
              class="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Menu"
            >
              <component :is="isMobileMenuOpen ? X : Menu" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Dropdown -->
      <div v-show="isMobileMenuOpen" class="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
        <RouterLink
          to="/"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          active-class="text-emerald-700 bg-emerald-50 font-semibold"
        >
          Beranda
        </RouterLink>
        <RouterLink
          to="/artikel"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          active-class="text-emerald-700 bg-emerald-50 font-semibold"
        >
          Artikel
        </RouterLink>
        <RouterLink
          to="/pengumuman"
          @click="isMobileMenuOpen = false"
          class="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
          active-class="text-emerald-700 bg-emerald-50 font-semibold"
        >
          Pengumuman & Agenda
        </RouterLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="font-serif text-xl font-bold text-white mb-3">Rojabiyyah</h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              Portal berita dan informasi umum resmi Rojabiyyah. Menyajikan kabar terkini, artikel edukatif, dan agenda kegiatan komunitas.
            </p>
          </div>
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Tautan Cepat</h4>
            <ul class="space-y-2 text-sm">
              <li><RouterLink to="/" class="hover:text-emerald-400 transition-colors">Beranda</RouterLink></li>
              <li><RouterLink to="/artikel" class="hover:text-emerald-400 transition-colors">Artikel & Berita</RouterLink></li>
              <li><RouterLink to="/pengumuman" class="hover:text-emerald-400 transition-colors">Pengumuman Kegiatan</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">Informasi</h4>
            <p class="text-sm text-slate-400">
              Dibangun dengan Laravel 11, Vue 3, TypeScript, dan TailwindCSS 4.
            </p>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {{ new Date().getFullYear() }} Rojabiyyah. Hak Cipta Dilindungi.
        </div>
      </div>
    </footer>
  </div>
</template>
