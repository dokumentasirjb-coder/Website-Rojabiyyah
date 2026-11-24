<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ArrowRight, BookOpen, Bell, Sparkles } from 'lucide-vue-next'
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-b from-emerald-900 to-slate-900 text-white py-20 lg:py-28">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles class="w-3.5 h-3.5" />
            Portal Resmi Rojabiyyah
          </div>
          <h1 class="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Kabar Terkini & Informasi Komunitas Rojabiyyah
          </h1>
          <p class="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed">
            Menghadirkan liputan kegiatan, artikel wawasan keilmuan, dan agenda acara penting secara aktual dan terpercaya.
          </p>
          <div class="mt-8 flex flex-wrap gap-4">
            <RouterLink
              to="/artikel"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-900/30"
            >
              <BookOpen class="w-4 h-4" />
              Jelajahi Artikel
            </RouterLink>
            <RouterLink
              to="/pengumuman"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm transition-all"
            >
              <Bell class="w-4 h-4" />
              Lihat Agenda
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Welcome Content Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Kartu Berita Terbaru -->
        <div class="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
            <BookOpen class="w-6 h-6" />
          </div>
          <h2 class="font-serif text-2xl font-bold text-slate-900 mb-3">
            Artikel & Kabar Kegiatan
          </h2>
          <p class="text-slate-600 text-sm leading-relaxed mb-6">
            Temukan tulisan informatif seputar kegiatan harian, pengajian, dan tulisan ilmiah dari para editor kami.
          </p>
          <RouterLink
            to="/artikel"
            class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Buka Arsip Artikel
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>

        <!-- Kartu Agenda & Pengumuman -->
        <div class="bg-white rounded-2xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
            <Bell class="w-6 h-6" />
          </div>
          <h2 class="font-serif text-2xl font-bold text-slate-900 mb-3">
            Pengumuman & Agenda Acara
          </h2>
          <p class="text-slate-600 text-sm leading-relaxed mb-6">
            Informasi penting terkait jadwal pengajian, tabligh akbar, kegiatan sosial, dan agenda penting lainnya.
          </p>
          <RouterLink
            to="/pengumuman"
            class="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Lihat Semua Jadwal
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
