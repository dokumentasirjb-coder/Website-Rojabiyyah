<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="border-b border-slate-200 pb-6 mb-8">
      <h1 class="font-serif text-3xl font-bold text-slate-900">Kategori: {{ route.params.slug }}</h1>
    </div>

    <div class="bg-white rounded-2xl p-8 text-center border border-slate-200">
      <p class="text-slate-500 text-sm">Artikel pada kategori ini akan ditampilkan di sini.</p>
      <RouterLink to="/artikel" class="mt-4 inline-block text-emerald-600 font-semibold text-sm hover:underline">
        Lihat Semua Artikel
      </RouterLink>
    </div>
  </div>
</template>
