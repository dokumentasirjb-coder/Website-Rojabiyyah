<script setup lang="ts">
import { ref, computed } from 'vue'
import { X, ZoomIn, Images } from 'lucide-vue-next'
import { useSettingsStore, DEFAULT_GALLERY_ALBUMS } from '@/stores/settingsStore'
import type { GalleryAlbum, GalleryPhotoItem } from '@/types'

const settingsStore = useSettingsStore()
const activeFilter = ref('semua')
const selectedPhoto = ref<any>(null)

// Published Albums sorted by sort_order
const publishedAlbums = computed<GalleryAlbum[]>(() => {
  const albums = settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS
  return (albums || [])
    .filter(a => a.status === 'published')
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
})

// All Published Photos across published albums
const allPublishedPhotos = computed(() => {
  const list: (GalleryPhotoItem & { albumTitle: string; albumSlug: string })[] = []
  for (const album of publishedAlbums.value) {
    for (const photo of (album.photos || [])) {
      if (photo.status === 'published') {
        list.push({
          ...photo,
          albumTitle: album.title,
          albumSlug: album.slug
        })
      }
    }
  }
  return list.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
})

// Filtered Photos based on active album filter
const filteredPhotos = computed(() => {
  if (activeFilter.value === 'semua') {
    return allPublishedPhotos.value
  }
  return allPublishedPhotos.value.filter(p => p.albumSlug === activeFilter.value || p.albumId === activeFilter.value)
})
</script>

<template>
  <div class="bg-white">
    <!-- Top Hero Banner -->
    <div class="relative bg-[#fbfbfa] border-b border-slate-100 overflow-hidden min-h-[280px] sm:min-h-[440px] flex items-center">
      <div class="absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-3/5 z-0">
        <img
          :src="settingsStore.settings.banner_galeri_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80'"
          alt="Galeri Muktamar"
          class="w-full h-full object-cover object-center opacity-85"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#fbfbfa] via-[#fbfbfa]/75 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#fbfbfa] via-transparent to-transparent"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 relative z-10 w-full">
        <div v-reveal="{ y: 20, duration: 0.65 }" class="max-w-2xl space-y-3 sm:space-y-4">
          <span class="inline-block text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#008f8a]">
            {{ settingsStore.settings.gallery_tag || 'DOKUMENTASI RESMI' }}
          </span>
          <h1 class="text-2xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            {{ settingsStore.settings.gallery_title || 'Galeri Dokumentasi' }}
          </h1>
          <p class="text-xs sm:text-base text-slate-600 font-normal leading-relaxed pt-0.5 sm:pt-1">
            {{ settingsStore.settings.gallery_subtitle || 'Dokumentasi visual rangkaian peristiwa, kebersamaan para santri, ulama, dan momen bersejarah.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Filter Pills Bar (Dynamic Albums from Admin) -->
    <div class="border-b border-slate-100 bg-white sticky top-16 sm:top-20 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            @click="activeFilter = 'semua'"
            class="px-4 py-2 rounded-full font-semibold transition-all shrink-0 cursor-pointer border"
            :class="[activeFilter === 'semua' ? 'bg-slate-900 text-white border-slate-900 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300']"
          >
            Semua Foto ({{ allPublishedPhotos.length }})
          </button>

          <button
            v-for="album in publishedAlbums"
            :key="album.id"
            type="button"
            @click="activeFilter = album.slug"
            class="px-4 py-2 rounded-full font-semibold transition-all shrink-0 cursor-pointer border"
            :class="[activeFilter === album.slug ? 'bg-slate-900 text-white border-slate-900 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300']"
          >
            {{ album.title }} ({{ (album.photos || []).filter(p => p.status === 'published').length }})
          </button>
        </div>
      </div>
    </div>

    <!-- Gallery Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div v-if="filteredPhotos.length === 0" class="py-16 text-center max-w-md mx-auto">
        <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Images class="w-7 h-7" />
        </div>
        <h3 class="text-lg font-bold text-slate-800">Belum Ada Foto</h3>
        <p class="text-xs text-slate-500 mt-1">Belum ada foto dokumentasi yang diunggah untuk album ini.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="(photo, idx) in filteredPhotos"
          :key="photo.id"
          v-reveal="{ y: 24, delay: (idx % 3) * 0.08 }"
          @click="selectedPhoto = photo"
          class="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 cursor-pointer border border-slate-200 shadow-2xs"
        >
          <img
            :src="photo.src"
            :alt="photo.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
            <span class="text-[10px] font-bold uppercase tracking-wider text-[#008f8a] bg-white px-2 py-0.5 rounded-full w-max mb-1.5">
              {{ photo.albumTitle }}
            </span>
            <h3 class="text-xs sm:text-sm font-semibold line-clamp-2">
              {{ photo.title }}
            </h3>
            <p v-if="photo.description" class="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
              {{ photo.description }}
            </p>
            <span v-if="photo.created_at" class="text-[10px] text-slate-400 mt-1">{{ photo.created_at }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="selectedPhoto"
        class="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
        @click.self="selectedPhoto = null"
      >
        <div class="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <button
            type="button"
            @click="selectedPhoto = null"
            class="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
          >
            <X class="w-5 h-5" />
          </button>
          <img
            :src="selectedPhoto.src"
            :alt="selectedPhoto.title"
            class="w-full max-h-[75vh] object-contain bg-black"
          />
          <div class="p-6 text-white space-y-1.5 bg-slate-900">
            <div class="flex items-center gap-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#008f8a] bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                {{ selectedPhoto.albumTitle }}
              </span>
              <span v-if="selectedPhoto.created_at" class="text-[11px] text-slate-400">
                {{ selectedPhoto.created_at }}
              </span>
            </div>
            <h3 class="text-base sm:text-lg font-bold">
              {{ selectedPhoto.title }}
            </h3>
            <p v-if="selectedPhoto.description" class="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {{ selectedPhoto.description }}
            </p>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
