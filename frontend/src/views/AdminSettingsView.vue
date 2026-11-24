<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import ImageUploadInput from '@/components/ImageUploadInput.vue'
import { useSettingsStore, THEME_PRESETS, applyTheme, type ThemePreset } from '@/stores/settingsStore'
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Layout, 
  Type, 
  Share2, 
  MapPin, 
  Sparkles, 
  Loader2,
  ExternalLink,
  Image as ImageIcon,
  BookOpen,
  Palette,
  Check,
  Eye,
  Info
} from 'lucide-vue-next'
import SocialIcons from '@/components/SocialIcons.vue'

const settingsStore = useSettingsStore()

const activeTab = ref<'navbar' | 'theme' | 'banners' | 'hero' | 'footer' | 'social'>('navbar')
const showToast = ref(false)

const form = reactive({ ...settingsStore.settings })

onMounted(async () => {
  await settingsStore.fetchSettings()
  Object.assign(form, settingsStore.settings)
  applyTheme(form)
})

function selectPreset(preset: ThemePreset) {
  form.theme_preset = preset.id
  form.primary_color = preset.primary
  form.primary_hover_color = preset.primaryHover
  form.secondary_color = preset.secondary
  form.accent_color = preset.accent
  form.footer_bg_color = preset.footerBg
  form.footer_bottom_bg_color = preset.footerBottomBg
  form.navbar_bg_color = preset.navbarBg
  form.navbar_style = preset.navbarStyle
  applyTheme(form)
}

function onNavbarStyleChange(style: 'white' | 'primary' | 'dark') {
  form.navbar_style = style
  if (style === 'white') {
    form.navbar_bg_color = '#ffffff'
  } else if (style === 'primary') {
    form.navbar_bg_color = form.primary_color || '#008f8a'
  } else if (style === 'dark') {
    form.navbar_bg_color = form.footer_bg_color || '#042623'
  }
  applyTheme(form)
}

function onCustomColorChange() {
  form.theme_preset = 'custom'
  if (!form.primary_hover_color || form.primary_hover_color === '#007a75') {
    form.primary_hover_color = form.primary_color
  }
  if (form.navbar_style === 'primary') {
    form.navbar_bg_color = form.primary_color
  } else if (form.navbar_style === 'dark') {
    form.navbar_bg_color = form.footer_bg_color
  }
  applyTheme(form)
}

async function handleSave() {
  const res = await settingsStore.updateSettings(form)
  if (res.success) {
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3500)
  }
}

function handleReset() {
  if (confirm('Apakah Anda yakin ingin mengembalikan semua teks, tema warna, banner, konten tentang, footer, dan medsos ke pengaturan bawaan awal?')) {
    settingsStore.resetToDefault()
    Object.assign(form, settingsStore.settings)
    applyTheme(form)
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3500)
  }
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#143d30]">
        <div>
          <div class="flex items-center gap-2 text-[11px] text-slate-400 font-medium mb-1">
            <span>Dashboard</span>
            <span class="text-slate-600">/</span>
            <span class="text-emerald-400">Pengaturan Tampilan</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Pengaturan Tampilan Situs
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Kelola identitas website, icon, favicon, banner tiap halaman, konten halaman Tentang, footer, dan media sosial secara terpusat.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="handleReset"
            class="px-4 py-2.5 rounded-xl border border-[#143d30] bg-[#0d261e] hover:bg-[#13352a] text-slate-300 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw class="w-3.5 h-3.5 text-slate-400" />
            Reset Standar
          </button>

          <button
            type="button"
            @click="handleSave"
            :disabled="settingsStore.isSaving"
            class="px-6 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Loader2 v-if="settingsStore.isSaving" class="w-4 h-4 animate-spin" />
            <Save v-else class="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>

      <!-- Success Toast Alert -->
      <div
        v-if="showToast"
        class="p-4 rounded-2xl bg-[#0d3326] border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in"
      >
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
          <span class="font-medium">{{ settingsStore.successMessage || 'Pengaturan berhasil disimpan dan langsung aktif di seluruh website!' }}</span>
        </div>
        <a
          href="/"
          target="_blank"
          class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
        >
          Lihat Website <ExternalLink class="w-3 h-3" />
        </a>
      </div>

      <!-- Settings Layout (Tabs + Form) -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Navigation Tabs (3/12) -->
        <div class="lg:col-span-3 space-y-1.5 bg-[#0b211a] p-3 rounded-2xl border border-[#143d30]">
          <button
            type="button"
            @click="activeTab = 'navbar'"
            class="w-full px-4 py-3 rounded-xl text-left text-xs font-semibold transition-all flex items-center gap-3 cursor-pointer"
            :class="[activeTab === 'navbar' ? 'bg-[#008f8a] text-white shadow-sm font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white']"
          >
            <Layout class="w-4 h-4" />
            <span>Navbar, Logo & Icon</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'theme'"
            class="w-full px-4 py-3 rounded-xl text-left text-xs font-semibold transition-all flex items-center gap-3 cursor-pointer"
            :class="[activeTab === 'theme' ? 'bg-[#008f8a] text-white shadow-sm font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white']"
          >
            <Palette class="w-4 h-4" />
            <span>Tema & Palet Warna</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'banners'"
            class="w-full px-4 py-3 rounded-xl text-left text-xs font-semibold transition-all flex items-center gap-3 cursor-pointer"
            :class="[activeTab === 'banners' ? 'bg-[#008f8a] text-white shadow-sm font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white']"
          >
            <ImageIcon class="w-4 h-4" />
            <span>Foto Banner Halaman</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'hero'"
            class="w-full px-4 py-3 rounded-xl text-left text-xs font-semibold transition-all flex items-center gap-3 cursor-pointer"
            :class="[activeTab === 'hero' ? 'bg-[#008f8a] text-white shadow-sm font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white']"
          >
            <Type class="w-4 h-4" />
            <span>Headline & Beranda</span>
          </button>


          <button
            type="button"
            @click="activeTab = 'footer'"
            class="w-full px-4 py-3 rounded-xl text-left text-xs font-semibold transition-all flex items-center gap-3 cursor-pointer"
            :class="[activeTab === 'footer' ? 'bg-[#008f8a] text-white shadow-sm font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white']"
          >
            <MapPin class="w-4 h-4" />
            <span>Footer & Kontak</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'social'"
            class="w-full px-4 py-3 rounded-xl text-left text-xs font-semibold transition-all flex items-center gap-3 cursor-pointer"
            :class="[activeTab === 'social' ? 'bg-[#008f8a] text-white shadow-sm font-bold' : 'text-slate-200 hover:bg-white/10 hover:text-white']"
          >
            <Share2 class="w-4 h-4" />
            <span>Media Sosial & Icon Link</span>
          </button>
        </div>

        <!-- Right Form Fields (9/12) -->
        <div class="lg:col-span-9 bg-[#0b211a] p-6 sm:p-8 rounded-3xl border border-[#143d30] space-y-6">

          <!-- TAB 2: TEMA & PALET WARNA WEBSITE (BARU) -->
          <div v-show="activeTab === 'theme'" class="space-y-6">
            <div class="border-b border-[#143d30] pb-4 flex items-center justify-between">
              <div>
                <h3 class="text-base font-bold text-white flex items-center gap-2">
                  <Palette class="w-5 h-5 text-emerald-400" />
                  <span>Tema & Palet Warna Website Publik</span>
                </h3>
                <p class="text-xs text-slate-300 mt-0.5">
                  Pilih template palet warna siap pakai atau tentukan warna kustom Anda sendiri. Semua komponen di halaman publik (tombol, badge kategori, link aktif, border, aksen, dan navbar) akan berubah secara otomatis.
                </p>
              </div>
            </div>

            <!-- Bagian 1: Template Siap Pakai -->
            <div class="space-y-3">
              <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles class="w-3.5 h-3.5" />
                <span>1. Template Tema Warna Siap Pakai</span>
              </h4>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div
                  v-for="preset in THEME_PRESETS"
                  :key="preset.id"
                  @click="selectPreset(preset)"
                  class="p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 group relative overflow-hidden"
                  :class="[
                    form.theme_preset === preset.id
                      ? 'border-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-400 shadow-md'
                      : 'border-[#143d30] bg-[#071913] hover:border-emerald-500/40 hover:bg-[#071913]/90'
                  ]"
                >
                  <div>
                    <!-- 4 Color Swatch Bar -->
                    <div class="flex items-center gap-1.5 mb-3">
                      <span
                        v-for="(col, idx) in preset.previewColors"
                        :key="idx"
                        class="w-5 h-5 rounded-full border border-black/20 shadow-2xs"
                        :style="{ backgroundColor: col }"
                      ></span>
                    </div>

                    <div class="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {{ preset.name }}
                    </div>
                    <p class="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {{ preset.description }}
                    </p>
                  </div>

                  <!-- Selected Indicator -->
                  <div class="flex items-center justify-between pt-2 border-t border-[#143d30]/60 text-[11px]">
                    <span class="text-slate-500 font-mono text-[10px]">{{ preset.primary }}</span>
                    <span
                      v-if="form.theme_preset === preset.id"
                      class="px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 flex items-center gap-1 text-[10px]"
                    >
                      <Check class="w-3 h-3" />
                      <span>Aktif</span>
                    </span>
                    <span v-else class="text-slate-500 group-hover:text-slate-300 text-[10px]">
                      Gunakan Tema
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bagian 2: Kustomisasi Warna Bebas -->
            <div class="space-y-3 pt-4 border-t border-[#143d30]">
              <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Settings class="w-3.5 h-3.5" />
                <span>2. Kustomisasi Warna Bebas (Palet Kustom)</span>
              </h4>
              <p class="text-xs text-slate-300">
                Ubah kode warna hex atau klik kotak warna untuk memilih warna secara manual sesuai identitas brand / yayasan Anda.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                <!-- Warna Utama -->
                <div class="p-3.5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                  <label class="block text-xs font-bold text-white">
                    Warna Utama (Primary)
                  </label>
                  <p class="text-[10px] text-slate-400 leading-tight">
                    Digunakan untuk tombol utama, link navbar aktif, dan badge utama.
                  </p>
                  <div class="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      v-model="form.primary_color"
                      @input="onCustomColorChange"
                      class="w-10 h-10 rounded-xl bg-transparent border border-[#143d30] cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      v-model="form.primary_color"
                      @input="onCustomColorChange"
                      placeholder="#008f8a"
                      class="flex-1 px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <!-- Warna Sekunder -->
                <div class="p-3.5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                  <label class="block text-xs font-bold text-white">
                    Warna Sekunder (Secondary)
                  </label>
                  <p class="text-[10px] text-slate-400 leading-tight">
                    Digunakan untuk gradasi latar belakang dan teks judul sekunder.
                  </p>
                  <div class="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      v-model="form.secondary_color"
                      @input="onCustomColorChange"
                      class="w-10 h-10 rounded-xl bg-transparent border border-[#143d30] cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      v-model="form.secondary_color"
                      @input="onCustomColorChange"
                      placeholder="#006432"
                      class="flex-1 px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <!-- Warna Aksen -->
                <div class="p-3.5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                  <label class="block text-xs font-bold text-white">
                    Warna Aksen (Accent Gold)
                  </label>
                  <p class="text-[10px] text-slate-400 leading-tight">
                    Digunakan untuk ornamen garis tepi, sorotan tanggal, dan emblem.
                  </p>
                  <div class="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      v-model="form.accent_color"
                      @input="onCustomColorChange"
                      class="w-10 h-10 rounded-xl bg-transparent border border-[#143d30] cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      v-model="form.accent_color"
                      @input="onCustomColorChange"
                      placeholder="#b38856"
                      class="flex-1 px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <!-- Warna Box Footer -->
                <div class="p-3.5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                  <label class="block text-xs font-bold text-white">
                    Warna Latar Box Footer
                  </label>
                  <p class="text-[10px] text-slate-400 leading-tight">
                    Warna latar belakang box footer bawah pada halaman publik.
                  </p>
                  <div class="flex items-center gap-2 pt-1">
                    <input
                      type="color"
                      v-model="form.footer_bg_color"
                      @input="onCustomColorChange"
                      class="w-10 h-10 rounded-xl bg-transparent border border-[#143d30] cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      v-model="form.footer_bg_color"
                      @input="onCustomColorChange"
                      placeholder="#042623"
                      class="flex-1 px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <!-- Gaya & Warna Box Navbar -->
                <div class="p-3.5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2.5 sm:col-span-2">
                  <label class="block text-xs font-bold text-white">
                    Gaya & Warna Latar Box Navbar
                  </label>
                  <p class="text-[10px] text-slate-400 leading-tight">
                    Pilih bagaimana box navigasi atas (Navbar) ditampilkan di halaman publik:
                  </p>
                  
                  <!-- Pilihan Mode Cepat -->
                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      @click="onNavbarStyleChange('white')"
                      class="p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between"
                      :class="[form.navbar_style === 'white' ? 'border-emerald-400 bg-emerald-500/10 text-white' : 'border-[#143d30] bg-[#04120e] text-slate-300 hover:border-slate-500']"
                    >
                      <div>
                        <span class="block text-xs font-bold">Putih Bersih (Default)</span>
                        <span class="text-[10px] text-slate-400">Aksen garis warna tema</span>
                      </div>
                      <Check v-if="form.navbar_style === 'white'" class="w-4 h-4 text-emerald-400 shrink-0" />
                    </button>

                    <button
                      type="button"
                      @click="onNavbarStyleChange('primary')"
                      class="p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between"
                      :class="[form.navbar_style === 'primary' ? 'border-emerald-400 bg-emerald-500/10 text-white' : 'border-[#143d30] bg-[#04120e] text-slate-300 hover:border-slate-500']"
                    >
                      <div>
                        <span class="block text-xs font-bold">Warna Tema Solid</span>
                        <span class="text-[10px] text-slate-400">Seluruh bar berwarna tema</span>
                      </div>
                      <Check v-if="form.navbar_style === 'primary'" class="w-4 h-4 text-emerald-400 shrink-0" />
                    </button>

                    <button
                      type="button"
                      @click="onNavbarStyleChange('dark')"
                      class="p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between"
                      :class="[form.navbar_style === 'dark' ? 'border-emerald-400 bg-emerald-500/10 text-white' : 'border-[#143d30] bg-[#04120e] text-slate-300 hover:border-slate-500']"
                    >
                      <div>
                        <span class="block text-xs font-bold">Gelap Elegan</span>
                        <span class="text-[10px] text-slate-400">Selaras dengan Box Footer</span>
                      </div>
                      <Check v-if="form.navbar_style === 'dark'" class="w-4 h-4 text-emerald-400 shrink-0" />
                    </button>
                  </div>

                  <!-- Color Picker Kustom untuk Navbar -->
                  <div class="flex items-center gap-2 pt-1.5">
                    <span class="text-[11px] text-slate-400 font-medium">Warna Latar Kustom:</span>
                    <input
                      type="color"
                      v-model="form.navbar_bg_color"
                      @input="onCustomColorChange"
                      class="w-8 h-8 rounded-lg bg-transparent border border-[#143d30] cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      v-model="form.navbar_bg_color"
                      @input="onCustomColorChange"
                      placeholder="#ffffff"
                      class="w-32 px-3 py-1.5 rounded-lg bg-[#04120e] border border-[#143d30] text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Bagian 3: Pratinjau Komponen Langsung (Live Preview) -->
            <div class="p-5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-3">
              <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Eye class="w-3.5 h-3.5" />
                <span>3. Pratinjau Komponen Halaman Publik (Live Preview)</span>
              </h4>
              <p class="text-[11px] text-slate-400">
                Berikut adalah simulasi tampilan komponen website dengan warna yang sedang dipilih saat ini:
              </p>

              <div class="rounded-xl border border-slate-700/60 overflow-hidden shadow-sm space-y-0">
                <!-- 1. Simulasi Box Navbar -->
                <div 
                  class="p-3.5 border-t-4 transition-colors duration-200 flex items-center justify-between gap-3"
                  :style="{
                    backgroundColor: form.navbar_bg_color || (form.navbar_style === 'primary' ? form.primary_color : form.navbar_style === 'dark' ? form.footer_bg_color : '#ffffff'),
                    borderTopColor: form.primary_color || '#008f8a',
                    borderBottom: '1px solid rgba(0,0,0,0.06)'
                  }"
                >
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-7 h-7 rounded-full border flex items-center justify-center font-black text-[10px]"
                      :style="{ borderColor: form.primary_color || '#008f8a', color: form.primary_color || '#008f8a' }"
                    >
                      35
                    </div>
                    <div>
                      <span 
                        class="text-[9px] uppercase font-bold block leading-tight"
                        :class="[form.navbar_style === 'primary' || form.navbar_style === 'dark' ? 'text-white/80' : 'text-slate-500']"
                      >
                        Muktamar Ke-35
                      </span>
                      <span 
                        class="text-xs font-extrabold block leading-none"
                        :class="[form.navbar_style === 'primary' || form.navbar_style === 'dark' ? 'text-white' : 'text-slate-900']"
                      >
                        Nahdlatul Ulama
                      </span>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span 
                      class="px-2.5 py-1 rounded-md text-[11px] font-bold"
                      :style="form.navbar_style === 'primary' || form.navbar_style === 'dark' ? { backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff' } : { color: form.primary_color || '#008f8a', borderBottom: `2px solid ${form.primary_color || '#008f8a'}` }"
                    >
                      Beranda
                    </span>
                    <span 
                      class="text-[11px] font-medium hidden sm:inline"
                      :class="[form.navbar_style === 'primary' || form.navbar_style === 'dark' ? 'text-white/80' : 'text-slate-600']"
                    >
                      Tentang
                    </span>
                    <span 
                      class="text-[11px] font-medium hidden sm:inline"
                      :class="[form.navbar_style === 'primary' || form.navbar_style === 'dark' ? 'text-white/80' : 'text-slate-600']"
                    >
                      Berita
                    </span>
                  </div>
                </div>

                <!-- 2. Simulasi Konten Halaman Publik -->
                <div class="p-4 bg-white text-slate-800 space-y-4">
                  <!-- Preview Headline, Quote & Buttons -->
                  <div class="space-y-2">
                    <div class="flex items-center justify-between">
                      <span
                        class="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white"
                        :style="{ backgroundColor: form.secondary_color || '#006432' }"
                      >
                        Kategori Berita
                      </span>
                      <span class="text-[10px] text-slate-400 font-medium">Simulasi Tampilan Body</span>
                    </div>

                    <h5
                      class="text-base font-extrabold tracking-tight"
                      :style="{ color: form.secondary_color || '#006432' }"
                    >
                      Contoh Judul Utama Berita & Artikel Muktamar
                    </h5>
                    <p class="text-xs text-slate-600 leading-relaxed pl-3 border-l-2" :style="{ borderColor: form.accent_color || '#b38856' }">
                      Kutipan artikel dan garis aksen pembatas warna {{ form.accent_color || '#b38856' }}. Komponen teks dan informasi resmi.
                    </p>
                  </div>

                  <!-- Preview Action Buttons -->
                  <div class="flex flex-wrap items-center gap-2.5 pt-1">
                    <button
                      type="button"
                      class="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                      :style="{ backgroundColor: form.primary_color || '#008f8a' }"
                    >
                      <span>Tombol Aksi Utama</span>
                      <ExternalLink class="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      class="px-4 py-2 rounded-xl text-xs font-bold border"
                      :style="{ color: form.primary_color || '#008f8a', borderColor: form.primary_color || '#008f8a' }"
                    >
                      Tombol Sekunder (Outline)
                    </button>
                  </div>
                </div>

                <!-- 3. Simulasi Box Footer -->
                <div 
                  class="p-4 transition-colors duration-200 border-t"
                  :style="{
                    backgroundColor: form.footer_bg_color || '#042623',
                    borderColor: 'rgba(255,255,255,0.1)'
                  }"
                >
                  <div class="flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-300">
                    <div>
                      <span class="text-xs font-bold text-white block">Simulasi Box Footer</span>
                      <span class="text-[11px] text-slate-400 block">Warna latar box footer langsung serasi dengan tema pilihan.</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span 
                        class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-xs"
                        :style="{ backgroundColor: form.primary_color || '#008f8a' }"
                      >
                        ✓
                      </span>
                      <span class="text-[10px] text-slate-300 font-mono">{{ form.footer_bg_color || '#042623' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Save Button for Theme Tab -->
            <div class="pt-4 border-t border-[#143d30] flex items-center justify-end gap-3">
              <button
                type="button"
                @click="handleSave"
                :disabled="settingsStore.isSaving"
                class="px-8 py-3 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Loader2 v-if="settingsStore.isSaving" class="w-4 h-4 animate-spin" />
                <Save v-else class="w-4 h-4" />
                <span>Simpan & Terapkan Tema Warna</span>
              </button>
            </div>
          </div>

          <!-- TAB 1: NAVBAR, LOGO & ICON -->
          <div v-show="activeTab === 'navbar'" class="space-y-6">
            <div class="border-b border-[#143d30] pb-4">
              <h3 class="text-base font-bold text-white">Pengaturan Navbar, Logo & Favicon</h3>
              <p class="text-xs text-slate-300 mt-0.5">Atur teks logo, emblem lingkaran, icon website (favicon), serta info tanggal dan lokasi di bagian atas.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Teks Baris Atas Logo
                </label>
                <input
                  v-model="form.site_title"
                  type="text"
                  placeholder="Contoh: Muktamar Ke-35"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Teks Baris Bawah Logo
                </label>
                <input
                  v-model="form.site_subtitle"
                  type="text"
                  placeholder="Contoh: Nahdlatul Ulama"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Angka / Teks di Dalam Emblem Logo
                </label>
                <input
                  v-model="form.navbar_badge"
                  type="text"
                  placeholder="Contoh: 35"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div class="sm:col-span-2">
                <ImageUploadInput
                  v-model="form.favicon_url"
                  label="Icon Favicon Website (Unggah dari Komputer)"
                  description="Icon tab browser yang muncul di samping judul tab."
                  aspect="square"
                  :maxDimension="256"
                />
              </div>

              <div class="sm:col-span-2">
                <ImageUploadInput
                  v-model="form.logo_image_url"
                  label="Gambar Logo Kustom (Unggah dari Komputer, Format PNG / SVG Transparan)"
                  description="Unggah file logo PNG atau SVG transparan. Logo akan otomatis tampil presisi, proporsional, dan transparan di Navbar publik dan Sidebar Admin."
                  aspect="wide"
                  :maxDimension="600"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Tanggal Pelaksanaan (Sub-label Atas)
                </label>
                <input
                  v-model="form.topbar_date"
                  type="text"
                  placeholder="Contoh: 27–31 AGUSTUS 2026"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Lokasi Pelaksanaan (Sub-label Atas)
                </label>
                <input
                  v-model="form.topbar_location"
                  type="text"
                  placeholder="Contoh: JOMBANG, JAWA TIMUR"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>
          </div>

          <!-- TAB 2: FOTO BANNER HALAMAN -->
          <div v-show="activeTab === 'banners'" class="space-y-6">
            <div class="border-b border-[#143d30] pb-4">
              <h3 class="text-base font-bold text-white">Foto Banner & Slidebar Latar Halaman</h3>
              <p class="text-xs text-slate-300 mt-0.5">Unggah foto latar belakang langsung dari komputer untuk setiap halaman utama. Efek fade putih artistik akan otomatis diterapkan secara anggun.</p>
            </div>

            <div class="space-y-5">
              <!-- Banner Beranda -->
              <div class="p-4 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                <ImageUploadInput
                  v-model="form.banner_beranda_url"
                  label="1. Banner Latar Beranda (Hero Utama)"
                  description="Pilih foto langsung dari komputer Anda untuk halaman Beranda (/)."
                />
              </div>

              <!-- Banner Tentang -->
              <div class="p-4 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                <ImageUploadInput
                  v-model="form.banner_tentang_url"
                  label="2. Banner Halaman Tentang"
                  description="Pilih foto ulama langsung dari komputer Anda untuk halaman Tentang (/tentang)."
                />
              </div>

              <!-- Banner Agenda -->
              <div class="p-4 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                <ImageUploadInput
                  v-model="form.banner_agenda_url"
                  label="3. Banner Halaman Agenda"
                  description="Pilih foto suasana sidang/arena langsung dari komputer Anda untuk halaman Agenda (/agenda)."
                />
              </div>

              <!-- Banner Berita -->
              <div class="p-4 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                <ImageUploadInput
                  v-model="form.banner_berita_url"
                  label="4. Banner Halaman Berita & Liputan"
                  description="Pilih foto jurnalis/pers langsung dari komputer Anda untuk halaman Berita (/berita)."
                />
              </div>

              <!-- Banner Galeri -->
              <div class="p-4 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                <ImageUploadInput
                  v-model="form.banner_galeri_url"
                  label="5. Banner Halaman Galeri Foto"
                  description="Pilih foto dokumentasi langsung dari komputer Anda untuk halaman Galeri (/galeri)."
                />
              </div>

              <!-- Banner Informasi Umum -->
              <div class="p-4 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
                <ImageUploadInput
                  v-model="form.banner_informasi_url"
                  label="6. Banner Halaman Informasi Umum"
                  description="Pilih foto langsung dari komputer Anda untuk latar belakang hero halaman Informasi Umum (/informasi)."
                />
              </div>
            </div>
          </div>

          <!-- TAB 3: HEADLINE & BERANDA -->
          <div v-show="activeTab === 'hero'" class="space-y-6">
            <div class="border-b border-[#143d30] pb-4">
              <h3 class="text-base font-bold text-white">Pengaturan Judul & Tagline Beranda</h3>
              <p class="text-xs text-slate-300 mt-0.5">Ubah teks headline besar dan semboyan utama di halaman depan.</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Judul Baris 1
                </label>
                <input
                  v-model="form.hero_headline_1"
                  type="text"
                  placeholder="Contoh: Muktamar"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Judul Baris 2
                </label>
                <input
                  v-model="form.hero_headline_2"
                  type="text"
                  placeholder="Contoh: Nahdlatul Ulama"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Judul Baris 3 (Teks Aksen Emas / Sub-judul)
                </label>
                <input
                  v-model="form.hero_headline_3"
                  type="text"
                  placeholder="Contoh: Ke-35"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Tagline / Motto Resmi
                </label>
                <textarea
                  v-model="form.hero_tagline"
                  rows="3"
                  placeholder="Contoh: Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                ></textarea>
              </div>
            </div>
          </div>


          <!-- TAB 5: FOOTER & KONTAK -->
          <div v-show="activeTab === 'footer'" class="space-y-6">
            <div class="border-b border-[#143d30] pb-4">
              <h3 class="text-base font-bold text-white">Pengaturan Footer & Sekretariat</h3>
              <p class="text-xs text-slate-300 mt-0.5">Kelola deskripsi institusi, alamat kantor, kontak, dan jam buka di bagian paling bawah website.</p>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Deskripsi Singkat Footer
                </label>
                <textarea
                  v-model="form.footer_description"
                  rows="3"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-white mb-1.5">
                    Kutipan Motto Footer
                  </label>
                  <input
                    v-model="form.footer_quote"
                    type="text"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-white mb-1.5">
                    Teks Nama Hak Cipta
                  </label>
                  <input
                    v-model="form.footer_copyright"
                    type="text"
                    placeholder="Contoh: Perkumpulan Nahdlatul Ulama"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Alamat Lengkap Sekretariat
                </label>
                <textarea
                  v-model="form.contact_address"
                  rows="2"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-white mb-1.5">
                    Email Resmi
                  </label>
                  <input
                    v-model="form.contact_email"
                    type="email"
                    placeholder="muktamar@nu.id"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-white mb-1.5">
                    Telepon / Hotline
                  </label>
                  <input
                    v-model="form.contact_phone"
                    type="text"
                    placeholder="+62 (0321) 8899-7700"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <div>
                  <label class="block text-xs font-bold text-white mb-1.5">
                    Jam Layanan
                  </label>
                  <input
                    v-model="form.contact_hours"
                    type="text"
                    placeholder="Pelayanan: 24 Jam selama Muktamar"
                    class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- TAB 6: MEDIA SOSIAL & ICON LINK -->
          <div v-show="activeTab === 'social'" class="space-y-6">
            <div class="border-b border-[#143d30] pb-4">
              <h3 class="text-base font-bold text-white">Pengaturan Tautan & Icon Media Sosial</h3>
              <p class="text-xs text-slate-300 mt-0.5">Tautan ini akan langsung aktif pada tombol ikon medsos di footer website.</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                  <SocialIcons name="instagram" :size="15" class="text-pink-400" />
                  <span>URL Instagram</span>
                </label>
                <input
                  v-model="form.social_instagram"
                  type="url"
                  placeholder="https://instagram.com/akun-anda"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                  <SocialIcons name="youtube" :size="15" class="text-red-400" />
                  <span>URL Channel YouTube</span>
                </label>
                <input
                  v-model="form.social_youtube"
                  type="url"
                  placeholder="https://youtube.com/@channel-anda"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                  <SocialIcons name="facebook" :size="15" class="text-blue-400" />
                  <span>URL Halaman Facebook</span>
                </label>
                <input
                  v-model="form.social_facebook"
                  type="url"
                  placeholder="https://facebook.com/halaman-anda"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                  <SocialIcons name="twitter" :size="15" class="text-white" />
                  <span>URL Akun X / Twitter</span>
                </label>
                <input
                  v-model="form.social_twitter"
                  type="url"
                  placeholder="https://twitter.com/akun-anda"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                  <SocialIcons name="tiktok" :size="15" class="text-white" />
                  <span>URL Akun TikTok</span>
                </label>
                <input
                  v-model="form.social_tiktok"
                  type="url"
                  placeholder="https://tiktok.com/@akun-anda"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5 flex items-center gap-2">
                  <SocialIcons name="whatsapp" :size="15" class="text-emerald-400" />
                  <span>Tautan WhatsApp Hotline</span>
                </label>
                <input
                  v-model="form.social_whatsapp"
                  type="url"
                  placeholder="https://wa.me/6281234567890"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>
          </div>

          <!-- Bottom Save Actions -->
          <div class="pt-6 border-t border-[#143d30] flex items-center justify-end gap-3">
            <button
              type="button"
              @click="handleSave"
              :disabled="settingsStore.isSaving"
              class="px-8 py-3 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Loader2 v-if="settingsStore.isSaving" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              <span>Simpan & Terapkan Perubahan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
