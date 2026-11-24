<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import GaleriSection from '@/views/sections/GaleriSection.vue'
import Footer from '@/components/Footer.vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  settingsStore.fetchSettings()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
    <Navbar />
    <main class="flex-1">
      <GaleriSection />
    </main>
    <Footer />
  </div>
</template>
