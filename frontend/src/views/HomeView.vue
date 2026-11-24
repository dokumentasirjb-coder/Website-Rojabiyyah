<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNewsStore } from '@/stores/newsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import Navbar from '@/components/Navbar.vue'
import BerandaSection from '@/views/sections/BerandaSection.vue'
import TentangSection from '@/views/sections/TentangSection.vue'
import AgendaSection from '@/views/sections/AgendaSection.vue'
import BeritaSection from '@/views/sections/BeritaSection.vue'
import GaleriSection from '@/views/sections/GaleriSection.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()
const settingsStore = useSettingsStore()

const activeSection = ref('beranda')
const sectionIds = ['beranda', 'tentang', 'agenda', 'berita', 'galeri']
let observer: IntersectionObserver | null = null

function scrollToSection(id: string) {
  activeSection.value = id
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    // Update hash without jumping
    history.replaceState(null, '', `#${id}`)
  }
}

function setupScrollspy() {
  const options = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  }

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id
      }
    })
  }, options)

  sectionIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el && observer) {
      observer.observe(el)
    }
  })
}

onMounted(() => {
  settingsStore.fetchSettings()
  newsStore.fetchHome()
  newsStore.fetchArticles()

  nextTick(() => {
    setupScrollspy()

    // Handle initial hash or route path
    const path = route.path.replace('/', '')
    const hash = window.location.hash.replace('#', '')
    const target = hash || path

    if (target && sectionIds.includes(target)) {
      setTimeout(() => {
        scrollToSection(target)
      }, 100)
    }
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
    <!-- Navbar with Active Section Sync -->
    <Navbar :active-section="activeSection" @navigate="scrollToSection" />

    <!-- Main View: All 5 sections connected seamlessly for scrolling -->
    <main class="flex-1">
      <!-- 1. Beranda -->
      <section id="beranda" class="scroll-mt-20">
        <BerandaSection @scroll-to="scrollToSection" />
      </section>

      <!-- 2. Tentang -->
      <section id="tentang" class="scroll-mt-20">
        <TentangSection />
      </section>

      <!-- 3. Agenda -->
      <section id="agenda" class="scroll-mt-20">
        <AgendaSection />
      </section>

      <!-- 4. Berita -->
      <section id="berita" class="scroll-mt-20">
        <BeritaSection />
      </section>

      <!-- 5. Galeri -->
      <section id="galeri" class="scroll-mt-20">
        <GaleriSection />
      </section>
    </main>

    <!-- Minimalist Footer -->
    <Footer />
  </div>
</template>
