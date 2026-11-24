<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useTabarukanStore, type TabarukanItem, type SecretariatContact } from '@/stores/tabarukanStore'
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
  Sparkles
} from 'lucide-vue-next'

const tabarukanStore = useTabarukanStore()
const settingsStore = useSettingsStore()

const activeTab = ref<'all' | 'tabarukan' | 'cp' | 'lokasi'>('all')
const selectedCategory = ref<string>('all')

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

const categories = computed(() => {
  return ['all', ...tabarukanStore.allCategories]
})

const filteredTabarukan = computed(() => {
  if (selectedCategory.value === 'all') return tabarukanStore.tabarukanItems
  return tabarukanStore.tabarukanItems.filter(item => item.category === selectedCategory.value)
})

function getWhatsAppUrl(item: TabarukanItem) {
  const phone = (item.contact_wa || '6281234567890').replace(/[^0-9]/g, '')
  const text = encodeURIComponent(`Assalamu'alaikum Panitia Rojabiyyah, saya ingin menanyakan informasi seputar [${item.category}]: "${item.title}". Mohon informasi selengkapnya. Terima kasih.`)
  return `https://wa.me/${phone}?text=${text}`
}

function getCPWhatsAppUrl(cp: SecretariatContact) {
  const phone = (cp.whatsapp || cp.phone || '6281234567890').replace(/[^0-9]/g, '')
  const text = encodeURIComponent(`Assalamu'alaikum ${cp.name} (${cp.role} Panitia Rojabiyyah), saya ingin menanyakan informasi seputar acara Haul & Rojabiyyah.`)
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
            Panduan resmi penyelenggaraan Haul Abah & Peringatan Rojabiyyah. Menampilkan cinderamata Tabarukan Khidmah, Narahubung Kesekretariatan, dan Peta Lokasi Acara.
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
      <!-- SECTION 1: KATALOG INFORMASI (FEED INSTAGRAM SQUARE SIZE) -->
      <!-- ============================================================ -->
      <section v-show="activeTab === 'all' || activeTab === 'tabarukan'" class="py-16 sm:py-20 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008f8a] mb-1.5">
                <ShoppingBag class="w-4 h-4" />
                <span>Katalog Informasi, Layanan & Tabarukan</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Informasi Acara, Penginapan & Tabarukan
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                Panduan resmi seputar penginapan jamaah, transportasi armada, lokasi acara, hingga cinderamata tabarukan berformat Feed Instagram.
              </p>
            </div>

            <!-- Kategori Filter (Dinamis & Dapat Disesuaikan) -->
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
              <button
                v-for="cat in categories"
                :key="cat"
                type="button"
                @click="selectedCategory = cat"
                :class="[
                  'px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer capitalize shadow-2xs',
                  selectedCategory === cat 
                    ? 'bg-[#008f8a] text-white shadow-md font-bold scale-102' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                ]"
              >
                {{ cat === 'all' ? 'Semua Informasi' : cat }}
              </button>
            </div>
          </div>

          <!-- Grid Feed Instagram (1:1 Square Format) -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              v-for="item in filteredTabarukan"
              :key="item.id"
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
                  <span class="text-[10px] text-slate-400 font-medium">
                    Feed IG
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredTabarukan.length === 0" class="py-12 text-center text-slate-400 text-xs">
            Tidak ada item tabarukan untuk kategori yang dipilih.
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 2: CP KESEKRETARIATAN (CONTACT PERSON) -->
      <!-- ============================================================ -->
      <section v-show="activeTab === 'all' || activeTab === 'cp'" class="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="pb-6 border-b border-slate-200">
            <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008f8a] mb-1.5">
              <PhoneCall class="w-4 h-4" />
              <span>Narahubung & Layanan Panitia</span>
            </div>
            <h2 class="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
              Contact Person Kesekretariatan
            </h2>
            <p class="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
              Informasi narahubung resmi panitia untuk konfirmasi kehadiran, akomodasi, tabarukan, dan kebutuhan jamaah.
            </p>
          </div>

          <!-- CP Cards Grid -->
          <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              v-for="cp in tabarukanStore.cpList"
              :key="cp.id"
              class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit mb-2">
                  {{ cp.division }}
                </span>
                <h3 class="font-bold text-base text-slate-900 leading-snug">
                  {{ cp.name }}
                </h3>
                <p class="text-xs text-slate-500 mt-0.5 font-medium">
                  {{ cp.role }}
                </p>
              </div>

              <div class="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div class="flex items-center gap-2">
                  <PhoneCall class="w-3.5 h-3.5 text-[#008f8a] shrink-0" />
                  <span class="font-mono">{{ cp.phone }}</span>
                </div>
                <div v-if="cp.email" class="flex items-center gap-2">
                  <Mail class="w-3.5 h-3.5 text-[#008f8a] shrink-0" />
                  <span class="truncate">{{ cp.email }}</span>
                </div>
              </div>

              <a
                :href="getCPWhatsAppUrl(cp)"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle class="w-4 h-4" />
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- SECTION 3: MAPS LOKASI ACARA -->
      <!-- ============================================================ -->
      <section v-show="activeTab === 'all' || activeTab === 'lokasi'" class="py-16 sm:py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#008f8a] mb-1.5">
                <MapPin class="w-4 h-4" />
                <span>Peta Penyelenggaraan</span>
              </div>
              <h2 class="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Peta & Lokasi Acara
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
                Pondok Pesantren Bumi Damai Al-Muhibbin, Bahrul 'Ulum Tambakberas, Jombang, Jawa Timur.
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Pondok+Pesantren+Bahrul+Ulum+Tambakberas+Jombang"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Navigation class="w-4 h-4" />
              <span>Buka Petunjuk di Google Maps</span>
              <ExternalLink class="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          <div class="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <!-- Google Maps Embed Card (7/12) -->
            <div class="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm p-4 sm:p-6 space-y-5">
              <div class="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <!-- Google Maps Interactive Iframe -->
                <iframe
                  title="Peta Lokasi Tambakberas Jombang"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  loading="lazy"
                  allowfullscreen
                  referrerpolicy="no-referrer-when-downgrade"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.3687352378956!2d112.22271877588045!3d-7.53472097436814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e783ff3cbbf8c4d%3A0x6b4efb415a786272!2sPondok%20Pesantren%20Bahrul%20Ulum%20Tambakberas!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                ></iframe>
              </div>

              <div class="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs text-slate-700">
                <MapPin class="w-5 h-5 text-[#008f8a] shrink-0 mt-0.5" />
                <div>
                  <strong class="text-slate-900 block font-bold">Titik Pusat Lokasi:</strong>
                  <span>Kompleks Pondok Pesantren Bahrul 'Ulum Tambakberas, Jl. KH. Wahab Chasbullah, Tambakrejo, Kec. Jombang, Kabupaten Jombang, Jawa Timur 61451.</span>
                </div>
              </div>
            </div>

            <!-- Petunjuk Rute & Transportasi (5/12) -->
            <div class="lg:col-span-5 space-y-4">
              <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div class="flex items-center gap-2.5 font-bold text-sm text-slate-900">
                  <Bus class="w-5 h-5 text-[#008f8a]" />
                  <span>Akses Dari Stasiun Jombang (JG)</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed font-normal">
                  Jarak sekitar 3,5 KM ke utara dari Stasiun Kereta Api Jombang. Waktu tempuh sekitar 10 menit menggunakan transportasi roda empat atau ojek online ke Kompleks Tambakberas.
                </p>
              </div>

              <div class="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div class="flex items-center gap-2.5 font-bold text-sm text-slate-900">
                  <Navigation class="w-5 h-5 text-[#008f8a]" />
                  <span>Akses Dari Gerbang Tol Jombang</span>
                </div>
                <p class="text-xs text-slate-600 leading-relaxed font-normal">
                  Keluar melalui Exit Tol Jombang (Tembelang). Lanjutkan perjalanan ke arah selatan melalui Jl. Raya Ploso–Jombang sekitar 15 menit menuju arena acara.
                </p>
              </div>

              <div class="p-5 rounded-2xl bg-[#02231c] text-white border border-emerald-950 space-y-2.5 shadow-sm">
                <div class="flex items-center gap-2 font-bold text-xs text-emerald-300">
                  <Clock class="w-4 h-4" />
                  <span>Pelayanan Parkir & Pengawalan</span>
                </div>
                <p class="text-xs text-emerald-100/90 leading-relaxed font-light">
                  Area kantong parkir disiapkan di beberapa titik strategis di sekitar pondok dengan petunjuk petugas keamanan panitia & Banser.
                </p>
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
                  {{ activeModalItem.category || 'Informasi Layanan' }}
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
                {{ activeModalItem.price_info || 'Layanan Resmi Panitia' }}
              </div>

              <p class="mt-3 text-xs text-slate-600 leading-relaxed">
                {{ activeModalItem.description }}
              </p>

              <div class="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-start gap-2 text-[11px] text-emerald-800">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Informasi dan layanan resmi peringatan Haul Abah & Rojabiyyah.</span>
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
                <span>Pesan / Tanya via WhatsApp</span>
              </a>
              <button
                type="button"
                @click="closeDetailModal"
                class="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-700 cursor-pointer text-center"
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
