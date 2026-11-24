<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <span class="font-serif text-7xl font-bold text-emerald-700">404</span>
    <h1 class="text-2xl font-bold text-slate-900 mt-4">Halaman Tidak Ditemukan</h1>
    <p class="text-slate-500 text-sm mt-2 max-w-md">
      Halaman yang Anda tuju tidak ditemukan atau tautan telah berpindah.
    </p>
    <RouterLink
      to="/"
      class="mt-6 px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-500 transition-colors shadow-sm"
    >
      Kembali ke Beranda
    </RouterLink>
  </div>
</template>
