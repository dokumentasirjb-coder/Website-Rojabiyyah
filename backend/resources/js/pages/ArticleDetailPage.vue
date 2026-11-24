<script setup lang="ts">
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <RouterLink to="/artikel" class="text-emerald-700 text-sm font-medium hover:underline mb-6 inline-block">
      &larr; Kembali ke daftar artikel
    </RouterLink>
    <article class="bg-white rounded-2xl p-8 border border-slate-200">
      <h1 class="font-serif text-3xl font-bold text-slate-900 mb-4">
        Detail Artikel: {{ route.params.slug }}
      </h1>
      <p class="text-slate-600 text-sm">Konten artikel lengkap akan diintegrasikan dengan API Laravel di Tahap 2.</p>
    </article>
  </div>
</template>
