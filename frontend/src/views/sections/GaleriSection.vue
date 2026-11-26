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
      <div class="absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-3/5 z-0 bg-gradient-to-br from-slate-100 to-emerald-50/40">
        <img
          v-if="settingsStore.settings.banner_galeri_url"
          :src="settingsStore.settings.banner_galeri_url"
          alt="Galeri Dokumentasi"
          loading="lazy"
          decoding="async"
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

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <article
          v-for="photo in filteredPhotos"
          :key="photo.id"
          v-reveal
          @click="selectedPhoto = photo"
          class="group rounded-2xl overflow-hidden bg-white cursor-pointer border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#008f8a]/40 transition-all flex flex-col"
        >
          <div class="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <img
              :src="photo.src"
              :alt="photo.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              decoding="async"
            />
            <span class="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 text-white flex items-center justify-center opacity-90 group-hover:bg-[#008f8a] transition-colors">
              <ZoomIn class="w-4 h-4" />
            </span>
          </div>

          <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-2">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-[#008f8a] border border-emerald-100">
                  {{ photo.albumTitle }}
                </span>
                <span v-if="photo.created_at" class="text-[11px] text-slate-400 shrink-0">
                  {{ photo.created_at }}
                </span>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#008f8a] transition-colors line-clamp-2 leading-snug">
                {{ photo.title }}
              </h3>
              <p v-if="photo.description" class="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
                {{ photo.description }}
              </p>
            </div>
          </div>
        </article>
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
