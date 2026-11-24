<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="border-b border-slate-200 pb-6 mb-8">
      <h1 class="font-serif text-3xl font-bold text-slate-900">Artikel & Berita</h1>
      <p class="text-slate-600 mt-2 text-sm">Kumpulan berita, liputan, dan tulisan edukatif seputar Rojabiyyah.</p>
    </div>

    <div class="bg-white rounded-2xl p-8 text-center border border-slate-200">
      <p class="text-slate-500 text-sm">Data artikel akan dimuat melalui API di Tahap 2.</p>
      <RouterLink to="/" class="mt-4 inline-block text-emerald-600 font-semibold text-sm hover:underline">
        Kembali ke Beranda
      </RouterLink>
    </div>
  </div>
</template>
