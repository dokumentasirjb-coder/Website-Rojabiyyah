<script setup lang="ts">
import { DownloadCloud, FileText, Image as ImageIcon, Video, ExternalLink, Sparkles } from 'lucide-vue-next'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()

const downloadItems = [
  {
    title: 'Buku Panduan & Tata Tertib Muktamar ke-35 NU',
    type: 'PDF (Resmi)',
    size: '4.8 MB',
    date: 'Agustus 2026',
    category: 'Panduan'
  },
  {
    title: 'Materi Sidang Komisi Bahtsul Masail Waqi\'iyyah & Maudhu\'iyyah',
    type: 'PDF (Resmi)',
    size: '8.2 MB',
    date: 'Agustus 2026',
    category: 'Materi Komisi'
  },
  {
    title: 'Brand Asset Kit: Logo Resmi Muktamar 35 (Vector AI, SVG, PNG HD)',
    type: 'ZIP Bundle',
    size: '18.5 MB',
    date: 'Juli 2026',
    category: 'Asset Media'
  },
  {
    title: 'Rundown Lengkap & Jadwal Siaran Pers Media Center',
    type: 'PDF (Resmi)',
    size: '2.1 MB',
    date: 'Agustus 2026',
    category: 'Jadwal'
  }
]

const galleryMoments = [
  {
    title: 'Persiapan Arena Stadion Utama Tambakberas Jombang',
    category: 'Venue & Fasilitas',
    img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Silaturahmi Masyayikh & Alim Ulama Sepuh NU',
    category: 'Masyayikh',
    img: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Pusat Layanan Media Center & Siaran Pers',
    category: 'Media Center',
    img: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'
  }
]

function handleDownload(title: string) {
  uiStore.notify(`Mengunduh dokumen: "${title}". File sedang dipersiapkan.`, 'info')
}
</script>

<template>
  <section id="media-center-section" class="py-16 sm:py-20 bg-white border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="max-w-3xl mx-auto text-center space-y-3 mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f5ee] text-[#006432] text-xs font-bold uppercase tracking-wider">
          <DownloadCloud class="w-4 h-4 text-[#c59b27]" />
          Media Center & Pusat Publikasi
        </div>
        <h2 class="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
          Pusat Unduhan Dokumen & Galeri Muktamar
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 font-light">
          Akses buku panduan, materi persidangan komisi, aset logo resmi, dan dokumentasi terkini perhelatan akbar di Jombang.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Unduhan Dokumen (Left 6/12) -->
        <div class="lg:col-span-6 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 class="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText class="w-5 h-5 text-[#006432]" />
              Dokumen Resmi & Unduhan
            </h3>
            <span class="text-xs text-[#006432] font-semibold">4 Berkas Tersedia</span>
          </div>

          <div class="space-y-3">
            <div
              v-for="(doc, idx) in downloadItems"
              :key="idx"
              class="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#006432]/60 hover:bg-[#f8faf9] transition-all flex items-center justify-between gap-4 group"
            >
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-xl bg-white border border-slate-200 text-[#006432] flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs group-hover:bg-[#006432] group-hover:text-white transition-colors">
                  <FileText class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 leading-snug group-hover:text-[#006432] transition-colors">
                    {{ doc.title }}
                  </h4>
                  <div class="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                    <span class="px-2 py-0.5 rounded bg-slate-200/60 font-semibold text-slate-700">{{ doc.type }}</span>
                    <span>•</span>
                    <span>{{ doc.size }}</span>
                    <span>•</span>
                    <span>{{ doc.date }}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                @click="handleDownload(doc.title)"
                class="p-2.5 rounded-xl bg-white hover:bg-[#006432] text-[#006432] hover:text-white border border-slate-200 transition-all shadow-2xs shrink-0 cursor-pointer"
                :title="'Unduh ' + doc.title"
              >
                <DownloadCloud class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <!-- Galeri Dokumentasi (Right 6/12) -->
        <div class="lg:col-span-6 space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 class="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
              <ImageIcon class="w-5 h-5 text-[#c59b27]" />
              Dokumentasi & Galeri Foto
            </h3>
            <span class="text-xs text-slate-500">Update Harian</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Large Gallery Tile (Left) -->
            <div class="sm:col-span-2 relative h-48 sm:h-52 rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 shadow-sm">
              <img
                :src="galleryMoments[0].img"
                :alt="galleryMoments[0].title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-3 inset-x-3 text-white">
                <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#006432] text-white">
                  {{ galleryMoments[0].category }}
                </span>
                <h4 class="text-xs sm:text-sm font-semibold mt-1 line-clamp-1">
                  {{ galleryMoments[0].title }}
                </h4>
              </div>
            </div>

            <!-- 2 Small Gallery Tiles -->
            <div
              v-for="(item, idx) in galleryMoments.slice(1)"
              :key="idx"
              class="relative h-36 rounded-2xl overflow-hidden group cursor-pointer border border-slate-200 shadow-sm"
            >
              <img
                :src="item.img"
                :alt="item.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-2.5 inset-x-2.5 text-white">
                <span class="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#c59b27] text-[#022314]">
                  {{ item.category }}
                </span>
                <h4 class="text-[11px] font-semibold mt-1 line-clamp-1">
                  {{ item.title }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
