<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import BeritaSection from '@/views/sections/BeritaSection.vue'
import Footer from '@/components/Footer.vue'
import { useNewsStore } from '@/stores/newsStore'
import { useSettingsStore } from '@/stores/settingsStore'

const newsStore = useNewsStore()
const settingsStore = useSettingsStore()

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  settingsStore.fetchSettings()
  newsStore.fetchArticles()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
    <Navbar />
    <main class="flex-1">
      <BeritaSection />
    </main>
    <Footer />
  </div>
</template>
