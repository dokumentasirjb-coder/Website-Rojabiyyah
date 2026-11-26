<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { 
  useTabarukanStore, 
  normalizeGoogleMapsEmbedUrl,
  type GuideInfoItem, 
  type TabarukanItem, 
  type SecretariatContact 
} from '@/stores/tabarukanStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { 
  ShoppingBag, 
  PhoneCall, 
  MapPin, 
  Navigation, 
  ExternalLink, 
  MessageCircle, 
  X, 
  Share2, 
  Info, 
  Mail, 
  Clock, 
  Bus, 
  Heart,
  CheckCircle2,
  Sparkles,
  Bed,
  Utensils,
  HeartPulse,
  Building2,
  BookOpen
} from 'lucide-vue-next'

const tabarukanStore = useTabarukanStore()
const settingsStore = useSettingsStore()

const activeTab = ref<'all' | 'panduan' | 'tabarukan' | 'cp' | 'lokasi'>('all')
const selectedGuideCategory = ref<string>('all')

// Modal Detail Tabarukan
const activeModalItem = ref<TabarukanItem | null>(null)
const isDetailModalOpen = ref(false)

function openDetailModal(item: TabarukanItem) {
  activeModalItem.value = item
  isDetailModalOpen.value = true
}

function closeDetailModal() {
  isDetailModalOpen.value = false
  activeModalItem.value = null
}

const guideCategories = computed(() => {
  return ['all', ...tabarukanStore.guideCategories]
})

const filteredGuides = computed(() => {
  if (selectedGuideCategory.value === 'all') return tabarukanStore.guideItems
  return tabarukanStore.guideItems.filter(g => g.category.toLowerCase() === selectedGuideCategory.value.toLowerCase())
})

function getGuideCategoryIcon(category: string) {
  const cat = (category || '').toLowerCase()
  if (cat.includes('inap') || cat.includes('asrama') || cat.includes('transit') || cat.includes('hotel') || cat.includes('wisma')) return Bed
  if (cat.includes('transport') || cat.includes('rute') || cat.includes('shuttle') || cat.includes('bus') || cat.includes('parkir')) return Bus
  if (cat.includes('medis') || cat.includes('sehat') || cat.includes('obat') || cat.includes('dokter')) return HeartPulse
  if (cat.includes('makan') || cat.includes('konsumsi') || cat.includes('dapur')) return Utensils
  if (cat.includes('lokasi') || cat.includes('posko') || cat.includes('titik') || cat.includes('peta')) return MapPin
  return Building2
}

function getGuideWhatsAppUrl(item: GuideInfoItem) {
  const phone = (item.contact_wa || '6281234567890').replace(/[^0-9]/g, '')
  const text = encodeURIComponent(`Assalamu'alaikum Panitia Rojabiyyah, saya ingin menanyakan panduan seputar [${item.category}]: "${item.title}". Mohon petunjuk informasinya. Terima kasih.`)
  return `https://wa.me/${phone}?text=${text}`
}

function getWhatsAppUrl(item: TabarukanItem) {
  const phone = (item.contact_wa || '6281234567890').replace(/[^0-9]/g, '')
  const text = encodeURIComponent(`Assalamu'alaikum Panitia Rojabiyyah, saya ingin menanyakan pemesanan tabarukan: "${item.title}". Mohon informasi ketersediaan. Terima kasih.`)
  return `https://wa.me/${phone}?text=${text}`
}

function getCPWhatsAppUrl(cp: SecretariatContact) {
  const phone = (cp.whatsapp || cp.phone || '6281234567890').replace(/[^0-9]/g, '')
  const text = encodeURIComponent(`Assalamu'alaikum ${cp.name} (${cp.role} Panitia Rojabiyyah), saya ingin menanyakan informasi seputar kegiatan Haul & Rojabiyyah.`)
  return `https://wa.me/${phone}?text=${text}`
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  settingsStore.fetchSettings()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#fbfdfc] text-slate-800 font-sans selection:bg-[#008f8a] selection:text-white">
    <Navbar />

    <main class="flex-1">
      <!-- ============================================================ -->
      <!-- HERO HEADER: INFORMASI UMUM -->
      <!-- ============================================================ -->
      <section class="relative bg-slate-950 text-white pt-32 pb-20 sm:pt-36 sm:pb-24 overflow-hidden border-b border-emerald-950">
        <!-- Background Photo Container with Overlays -->
        <div class="absolute inset-0 z-0">
          <img
            :src="settingsStore.settings.banner_informasi_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=2000&q=80'"
            alt="Latar Belakang Informasi Umum"
            class="w-full h-full object-cover object-center"
          />
          <!-- Dark Islamic green overlay for readability and branding consistency -->
          <div class="absolute inset-0 bg-[#02231c]/75 backdrop-blur-[1px]"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#02231c] via-[#02231c]/60 to-[#02231c]/80"></div>
          <div class="absolute inset-0 opacity-15 bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md shadow-xs">
            <Sparkles class="w-3.5 h-3.5 text-emerald-400" />
            <span>Pusat Layanan Jamaah & Santri</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-tight">
            Informasi Umum
          </h1>

          <p class="mt-4 text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto font-light leading-relaxed">
            Panduan resmi penyelenggaraan Haul Abah & Peringatan Rojabiyyah. Menampilkan info penginapan, transportasi, lokasi acara, narahubung kesekretariatan, dan cinderamata Tabarukan Khidmah.
          </p>

          <!-- Quick Navigation Pill Tabs -->
          <div class="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              @click="activeTab = 'all'"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs',
                activeTab === 'all' 
                  ? 'bg-white text-emerald-900 shadow-md scale-105' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              ]"
            >
              <span>Semua Informasi</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'panduan'"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs',
                activeTab === 'panduan' 
                  ? 'bg-white text-emerald-900 shadow-md scale-105' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              ]"
            >
              <Building2 class="w-3.5 h-3.5 text-emerald-400" />
              <span>Panduan & Fasilitas</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'tabarukan'"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs',
                activeTab === 'tabarukan' 
                  ? 'bg-white text-emerald-900 shadow-md scale-105' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              ]"
            >
              <ShoppingBag class="w-3.5 h-3.5 text-emerald-400" />
              <span>Tabarukan (Feed IG)</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'cp'"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs',
                activeTab === 'cp' 
                  ? 'bg-white text-emerald-900 shadow-md scale-105' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              ]"
            >
              <PhoneCall class="w-3.5 h-3.5 text-emerald-400" />
              <span>CP Kesekretariatan</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'lokasi'"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs',
                activeTab === 'lokasi' 
                  ? 'bg-white text-emerald-900 shadow-md scale-105' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
              ]"
            >
              <MapPin class="w-3.5 h-3.5 text-emerald-400" />
              <span>Peta & Lokasi Acara</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 1: PANDUAN & FASILITAS ACARA (PENGINAPAN, TRANSPORT, MEDIS) -->
      <!-- ============================================================ -->
      <section v-show="activeTab === 'all' || activeTab === 'panduan'" class="py-16 sm:py-20 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header Judul & Deskripsi -->
          <div v-reveal="{ y: 20, duration: 0.65 }" class="max-w-3xl pb-6 border-b border-slate-200">
            <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008f8a] mb-2">
              <Sparkles class="w-4 h-4 text-[#008f8a]" />
              <span>Panduan Layanan & Fasilitas Jamaah</span>
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 leading-snug">
              Penginapan, Transportasi & Fasilitas Acara
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
              Panduan resmi seputar fasilitas asrama penginapan santri, armada transportasi shuttle, posko kesehatan, dan layanan jamaah selama kegiatan Haul & Rojabiyyah.
            </p>
          </div>

          <!-- Kategori Filter Panduan -->
          <div class="mt-6 flex items-center gap-2 bg-slate-50/90 p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 overflow-x-auto sm:flex-wrap no-scrollbar">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline-block shrink-0">
              Kategori:
            </span>
            <button
              v-for="cat in guideCategories"
              :key="cat"
              type="button"
              @click="selectedGuideCategory = cat"
              :class="[
                'px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer capitalize shadow-2xs shrink-0',
                selectedGuideCategory === cat 
                  ? 'bg-[#008f8a] text-white shadow-sm font-bold scale-102' 
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/70'
              ]"
            >
              {{ cat === 'all' ? 'Semua Panduan' : cat }}
            </button>
          </div>

          <!-- Grid Kartu Panduan Berbasis Teks & Ikon (Tidak Wajib Foto Feed IG!) -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="(guide, idx) in filteredGuides"
              :key="guide.id"
              v-reveal="{ y: 24, delay: (idx % 3) * 0.08 }"
              class="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group hover:border-[#008f8a]/40"
            >
              <div class="space-y-4">
                <!-- Top Row: Category Badge + Icon -->
                <div class="flex items-center justify-between">
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-[11px] font-bold tracking-wide uppercase">
                    <component :is="getGuideCategoryIcon(guide.category)" class="w-3.5 h-3.5 text-[#008f8a]" />
                    <span>{{ guide.category }}</span>
                  </div>
                </div>

                <!-- Judul Panduan -->
                <h3 class="text-lg font-serif font-bold text-slate-900 group-hover:text-[#008f8a] transition-colors leading-snug">
                  {{ guide.title }}
                </h3>

                <!-- Catatan Lokasi / Titik -->
                <div v-if="guide.location_note" class="flex items-start gap-2 text-xs font-medium text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <MapPin class="w-4 h-4 text-[#008f8a] shrink-0 mt-0.5" />
                  <span class="line-clamp-2">{{ guide.location_note }}</span>
                </div>

                <!-- Penjelasan / Deskripsi Lengkap -->
                <p class="text-xs text-slate-600 leading-relaxed font-normal">
                  {{ guide.description }}
                </p>

                <!-- Opsional Foto jika diunggah -->
                <div v-if="guide.image_url" class="relative rounded-2xl overflow-hidden aspect-video bg-slate-100 mt-2 border border-slate-100">
                  <img :src="guide.image_url" :alt="guide.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              </div>

              <!-- Tombol Hubungi Narahubung via WA -->
              <div class="pt-5 mt-5 border-t border-slate-100">
                <a
                  :href="getGuideWhatsAppUrl(guide)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#008f8a] text-slate-700 hover:text-white border border-slate-200 hover:border-transparent font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
                >
                  <MessageCircle class="w-4 h-4 text-[#008f8a] group-hover:text-white transition-colors" />
                  <span>Tanya Info via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 2: KATALOG TABARUKAN KHIDMAH (FORMAT FEED IG 1:1) -->
      <!-- ============================================================ -->
      <section v-show="activeTab === 'all' || activeTab === 'tabarukan'" class="py-16 sm:py-20 border-b border-slate-100 bg-[#f9fbfb]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <!-- Header Judul & Deskripsi -->
          <div v-reveal="{ y: 20, duration: 0.65 }" class="max-w-3xl pb-6 border-b border-slate-200">
            <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008f8a] mb-2">
              <ShoppingBag class="w-4 h-4 text-[#008f8a]" />
              <span>Cinderamata & Berkah Khidmah</span>
            </div>
            <h2 class="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-slate-900 leading-snug">
              Tabbarukan Haul &amp; Marchedise Haul
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
              Produk dan cinderamata resmi panitia berformat Feed Instagram persegi 1:1. Seluruh infaq dialokasikan untuk khidmah peringatan Haul Abah & Rojabiyyah.
            </p>
          </div>

          <!-- Grid Feed Instagram (1:1 Square Format) -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              v-for="(item, idx) in tabarukanStore.tabarukanItems"
              :key="item.id"
              v-reveal="{ y: 24, delay: (idx % 4) * 0.07 }"
              @click="openDetailModal(item)"
              class="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
            >
              <!-- Foto Ukuran Feed IG (Square 1:1 Aspect Ratio) -->
              <div class="relative aspect-square w-full bg-slate-100 overflow-hidden">
                <img
                  :src="item.image_url"
                  :alt="item.title"
                  class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  loading="lazy"
                />

                <!-- Category Badge -->
                <div class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase">
                  {{ item.category }}
                </div>

                <!-- Hover Overlay Instagram Style -->
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white">
                  <div class="flex items-center gap-1.5 font-bold text-xs bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-xs">
                    <Info class="w-4 h-4 text-emerald-400" />
                    <span>Lihat Rincian</span>
                  </div>
                </div>
              </div>

              <!-- Card Body / Info -->
              <div class="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 class="font-bold text-sm text-slate-900 group-hover:text-[#008f8a] transition-colors line-clamp-1 leading-snug">
                    {{ item.title }}
                  </h3>
                  <p class="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {{ item.description }}
                  </p>
                </div>

                <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span class="text-xs font-bold text-[#008f8a]">
                    {{ item.price_info || 'Infaq Tabarukan' }}
                  </span>
                  <span class="text-[11px] text-slate-400 group-hover:text-[#008f8a] font-medium flex items-center gap-1">
                    Detail <span class="text-xs">&rarr;</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 3: KONTAK PERSON (CP) KESEKRETARIATAN PANITIA -->
      <!-- ============================================================ -->
      <section v-show="activeTab === 'all' || activeTab === 'cp'" class="py-16 sm:py-20 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl mb-12">
            <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008f8a] mb-2">
              <PhoneCall class="w-4 h-4 text-[#008f8a]" />
              <span>Layanan Jamaah & Narahubung</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Kontak Person Kesekretariatan
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
              Hubungi narahubung resmi panitia sesuai dengan kebutuhan Anda untuk konfirmasi kafilah, perizinan, dan akomodasi.
            </p>
          </div>

          <!-- Grid Kontak Panitia -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="(cp, idx) in tabarukanStore.cpList"
              :key="cp.id"
              v-reveal="{ y: 24, delay: (idx % 4) * 0.07 }"
              class="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between group hover:border-[#008f8a]/40"
            >
              <div>
                <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-[#008f8a] flex items-center justify-center font-bold mb-4 group-hover:scale-110 transition-transform">
                  <PhoneCall class="w-5 h-5" />
                </div>

                <div class="text-[10px] font-bold text-[#008f8a] uppercase tracking-wider mb-1">
                  {{ cp.division }}
                </div>

                <h3 class="font-bold text-base text-slate-900 group-hover:text-[#008f8a] transition-colors">
                  {{ cp.name }}
                </h3>

                <p class="text-xs text-slate-500 mt-1">
                  {{ cp.role }}
                </p>

                <div class="mt-4 pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 font-medium">
                  <div class="flex items-center gap-2">
                    <PhoneCall class="w-3.5 h-3.5 text-emerald-600" />
                    <span>{{ cp.phone }}</span>
                  </div>
                  <div v-if="cp.email" class="flex items-center gap-2 text-slate-400">
                    <Mail class="w-3.5 h-3.5" />
                    <span class="truncate">{{ cp.email }}</span>
                  </div>
                </div>
              </div>

              <div class="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <a
                  :href="getCPWhatsAppUrl(cp)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <MessageCircle class="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
                <a
                  :href="`tel:${cp.phone.replace(/[^0-9+]/g, '')}`"
                  class="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  title="Panggilan Telepon"
                >
                  <PhoneCall class="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 4: PETA & LOKASI ACARA -->
      <!-- ============================================================ -->
      <section v-show="activeTab === 'all' || activeTab === 'lokasi'" class="py-16 sm:py-20 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="max-w-2xl mb-12">
            <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008f8a] mb-2">
              <MapPin class="w-4 h-4 text-[#008f8a]" />
              <span>Panduan Rute &amp; Transportasi</span>
            </div>
            <h2 class="text-2xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              {{ tabarukanStore.locationConfig.section_title || 'Peta Lokasi Penyelenggaraan Acara' }}
            </h2>
            <p class="text-xs sm:text-sm text-slate-600 mt-2 font-normal leading-relaxed">
              {{ tabarukanStore.locationConfig.section_subtitle }}
            </p>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Google Maps Iframe Container (7/12) -->
            <div class="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm space-y-4 p-4">
              <div class="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden bg-slate-200">
                <iframe
                  :title="tabarukanStore.locationConfig.main_map_title || 'Peta Lokasi Acara'"
                  :src="normalizeGoogleMapsEmbedUrl(tabarukanStore.locationConfig.google_maps_embed_url, tabarukanStore.locationConfig.main_address)"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen="false"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  class="w-full h-full"
                ></iframe>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
                <div class="flex items-start gap-2 text-xs text-slate-600">
                  <MapPin class="w-4 h-4 text-[#008f8a] shrink-0 mt-0.5" />
                  <div>
                    <strong class="text-slate-900 block font-bold">{{ tabarukanStore.locationConfig.main_map_title || 'Titik Pusat Lokasi:' }}</strong>
                    <span>{{ tabarukanStore.locationConfig.main_address }}</span>
                  </div>
                </div>
                <a
                  v-if="tabarukanStore.locationConfig.google_maps_link_url"
                  :href="tabarukanStore.locationConfig.google_maps_link_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <Navigation class="w-3.5 h-3.5" />
                  <span>Buka Google Maps</span>
                </a>
              </div>
            </div>

            <!-- Bagan Titik-Titik Lokasi Acara (5/12) -->
            <div class="lg:col-span-5 space-y-4">
              <div
                v-for="point in tabarukanStore.locationPoints"
                :key="point.id"
                :class="[
                  'p-5 rounded-2xl border transition-all',
                  point.is_dark
                    ? 'bg-[#02231c] text-white border-emerald-950 shadow-sm'
                    : 'bg-white border-slate-200 shadow-2xs hover:border-[#008f8a]/40'
                ]"
              >
                <div class="flex items-start gap-4">
                  <!-- Foto kecil sesuai box jika diunggah -->
                  <div
                    v-if="point.image_url"
                    :class="[
                      'w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border',
                      point.is_dark ? 'border-emerald-500/30 bg-emerald-950/60' : 'border-slate-200 bg-slate-100'
                    ]"
                  >
                    <img
                      :src="point.image_url"
                      :alt="point.title"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <!-- Info Teks & Link Maps -->
                  <div class="flex-1 min-w-0 space-y-2">
                    <div class="flex items-start justify-between gap-2">
                      <div class="flex items-center gap-2 font-bold text-sm" :class="point.is_dark ? 'text-emerald-300' : 'text-slate-900'">
                        <MapPin class="w-4 h-4 shrink-0" :class="point.is_dark ? 'text-emerald-400' : 'text-[#008f8a]'" />
                        <span>{{ point.title }}</span>
                      </div>
                      <span
                        v-if="point.badge"
                        :class="[
                          'px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0',
                          point.is_dark
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-slate-100 text-slate-600'
                        ]"
                      >
                        {{ point.badge }}
                      </span>
                    </div>
                    <p
                      class="text-xs leading-relaxed"
                      :class="point.is_dark ? 'text-emerald-100/90 font-light' : 'text-slate-600 font-normal'"
                    >
                      {{ point.address }}
                    </p>
                    <div v-if="point.maps_url" class="pt-0.5">
                      <a
                        :href="point.maps_url"
                        target="_blank"
                        rel="noopener noreferrer"
                        :class="[
                          'inline-flex items-center gap-1.5 text-xs font-bold hover:underline',
                          point.is_dark ? 'text-emerald-300' : 'text-[#008f8a]'
                        ]"
                      >
                        <Navigation class="w-3.5 h-3.5" />
                        <span>Buka Titik di Google Maps &rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- ============================================================ -->
    <!-- MODAL DETAIL TABARUKAN (FEED IG STYLE DIALOG) -->
    <!-- ============================================================ -->
    <Teleport to="body">
      <div
        v-if="isDetailModalOpen && activeModalItem"
        class="fixed inset-0 bg-black/80 backdrop-blur-xs z-[9999] flex items-center justify-center p-4"
        @click.self="closeDetailModal"
      >
        <div class="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
          <!-- Image Section (Square Feed IG) -->
          <div class="md:w-1/2 bg-slate-900 flex items-center justify-center relative aspect-square">
            <img
              :src="activeModalItem.image_url"
              :alt="activeModalItem.title"
              class="w-full h-full object-cover"
            />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 text-[10px] font-bold text-white uppercase tracking-wider">
              {{ activeModalItem.category }}
            </span>
          </div>

          <!-- Content Section -->
          <div class="md:w-1/2 p-6 flex flex-col justify-between space-y-4 overflow-y-auto">
            <div>
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <span class="text-[11px] font-bold text-[#008f8a] uppercase tracking-wider">
                  {{ activeModalItem.category || 'Cinderamata Tabarukan' }}
                </span>
                <button
                  type="button"
                  @click="closeDetailModal"
                  class="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
                >
                  <X class="w-5 h-5" />
                </button>
              </div>

              <h3 class="font-serif font-bold text-lg text-slate-900 mt-3 leading-snug">
                {{ activeModalItem.title }}
              </h3>

              <div class="mt-2 text-sm font-bold text-[#008f8a]">
                {{ activeModalItem.price_info || 'Infaq Tabarukan Khidmah' }}
              </div>

              <p class="mt-3 text-xs text-slate-600 leading-relaxed">
                {{ activeModalItem.description }}
              </p>

              <div class="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2 text-[11px] text-emerald-800">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Hasil tabarukan diperuntukkan bagi syiar dan khidmah peringatan Haul Abah & Rojabiyyah.</span>
              </div>
            </div>

            <div class="pt-3 border-t border-slate-100 space-y-2">
              <a
                :href="getWhatsAppUrl(activeModalItem)"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-3 px-4 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <MessageCircle class="w-4 h-4" />
                <span>Pesan Tabarukan via WhatsApp</span>
              </a>
              <button
                type="button"
                @click="closeDetailModal"
                class="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Footer />
  </div>
</template>
