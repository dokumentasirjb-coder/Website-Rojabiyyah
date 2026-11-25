<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import ImageUploadInput from '@/components/ImageUploadInput.vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useUiStore } from '@/stores/uiStore'
import type { GalleryPhoto } from '@/types'
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  ExternalLink,
  ZoomIn
} from 'lucide-vue-next'

const settingsStore = useSettingsStore()
const uiStore = useUiStore()

const activeCategoryFilter = ref('semua')
const isModalOpen = ref(false)
const isEditing = ref(false)
const showToast = ref(false)
const toastMsg = ref('')

const form = ref<GalleryPhoto>({
  id: '',
  title: '',
  category: 'pembukaan',
  categoryLabel: 'Pembukaan',
  date: '',
  src: ''
})

const categories = [
  { value: 'pembukaan', label: 'Pembukaan' },
  { value: 'pleno', label: 'Sidang Pleno' },
  { value: 'bahtsul_masail', label: 'Bahtsul Masail' },
  { value: 'masyayikh', label: 'Masyayikh' },
  { value: 'umum', label: 'Dokumentasi Umum' },
]

const galleryList = computed(() => {
  return settingsStore.settings.gallery_items_json || []
})

const filteredGallery = computed(() => {
  if (activeCategoryFilter.value === 'semua') return galleryList.value
  return galleryList.value.filter(item => item.category === activeCategoryFilter.value)
})

onMounted(async () => {
  await settingsStore.fetchSettings()
})

function openAddModal() {
  isEditing.value = false
  form.value = {
    id: Date.now(),
    title: '',
    category: 'pembukaan',
    categoryLabel: 'Pembukaan',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    src: ''
  }
  isModalOpen.value = true
}

function openEditModal(photo: GalleryPhoto) {
  isEditing.value = true
  form.value = { ...photo }
  isModalOpen.value = true
}

async function savePhoto() {
  if (!form.value.title || !form.value.src) {
    uiStore.notify('Mohon isi judul foto dan URL gambar.', 'warning')
    return
  }

  // Update categoryLabel
  const foundCat = categories.find(c => c.value === form.value.category)
  form.value.categoryLabel = foundCat ? foundCat.label : 'Dokumentasi'

  const currentItems = [...galleryList.value]

  if (isEditing.value) {
    const idx = currentItems.findIndex(i => i.id === form.value.id)
    if (idx !== -1) {
      currentItems[idx] = { ...form.value }
    }
  } else {
    currentItems.unshift({ ...form.value, id: Date.now() })
  }

  await settingsStore.updateSettings({
    gallery_items_json: currentItems
  })

  isModalOpen.value = false
  toastMsg.value = isEditing.value ? 'Foto galeri berhasil diperbarui!' : 'Foto baru berhasil ditambahkan ke galeri!'
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

async function deletePhoto(photo: GalleryPhoto) {
  if (await uiStore.askConfirm(`Hapus foto "${photo.title}" dari galeri?`)) {
    const currentItems = galleryList.value.filter(i => i.id !== photo.id)
    await settingsStore.updateSettings({
      gallery_items_json: currentItems
    })
    toastMsg.value = 'Foto berhasil dihapus dari galeri!'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3500)
  }
}
</script>

<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#008f8a]/10 text-[#008f8a] text-xs font-bold uppercase tracking-wider mb-2">
            <ImageIcon class="w-3.5 h-3.5" />
            Manajemen Dokumentasi Visual
          </div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Kelola Galeri Muktamar
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Tambah, edit, ganti foto dokumentasi, dan kelola kategori foto yang tampil di halaman Galeri.
          </p>
        </div>

        <button
          type="button"
          @click="openAddModal"
          class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#006432] to-[#008f8a] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus class="w-4 h-4" />
          <span>Tambah Foto Baru</span>
        </button>
      </div>

      <!-- Success Toast -->
      <div
        v-if="showToast"
        class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3 shadow-xs"
      >
        <div class="flex items-center gap-2 font-semibold">
          <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{{ toastMsg }}</span>
        </div>
        <a href="/galeri" target="_blank" class="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1">
          Lihat Galeri <ExternalLink class="w-3 h-3" />
        </a>
      </div>

      <!-- Filter Categories -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        <button
          type="button"
          @click="activeCategoryFilter = 'semua'"
          class="px-4 py-2 rounded-xl font-semibold transition-all border shrink-0 cursor-pointer"
          :class="[activeCategoryFilter === 'semua' ? 'bg-[#008f8a] text-white border-[#008f8a] shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300']"
        >
          Semua Foto ({{ galleryList.length }})
        </button>
        <button
          v-for="cat in categories"
          :key="cat.value"
          type="button"
          @click="activeCategoryFilter = cat.value"
          class="px-4 py-2 rounded-xl font-semibold transition-all border shrink-0 cursor-pointer"
          :class="[activeCategoryFilter === cat.value ? 'bg-[#008f8a] text-white border-[#008f8a] shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300']"
        >
          {{ cat.label }}
        </button>
      </div>

      <!-- Photos Grid -->
      <div v-if="filteredGallery.length === 0" class="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <ImageIcon class="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 class="font-bold text-slate-700 text-base">Belum Ada Foto di Kategori Ini</h3>
        <p class="text-xs text-slate-400 mt-1">Klik tombol "Tambah Foto Baru" untuk menambahkan foto dokumentasi.</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="photo in filteredGallery"
          :key="photo.id"
          class="group rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
        >
          <div class="relative aspect-[4/3] bg-slate-100 overflow-hidden">
            <img
              :src="photo.src"
              :alt="photo.title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#008f8a] backdrop-blur-xs shadow-xs">
              {{ photo.categoryLabel }}
            </span>
          </div>

          <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
            <div>
              <span class="text-[10px] text-slate-400 font-medium block mb-1 flex items-center gap-1">
                <Calendar class="w-3 h-3" />
                {{ photo.date }}
              </span>
              <h3 class="font-bold text-sm text-slate-900 leading-snug line-clamp-2">
                {{ photo.title }}
              </h3>
            </div>

            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                @click="openEditModal(photo)"
                class="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#008f8a] text-slate-600 hover:text-[#008f8a] text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit3 class="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                type="button"
                @click="deletePhoto(photo)"
                class="px-3 py-1.5 rounded-lg border border-rose-100 hover:border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form Tambah / Edit Foto -->
    <Teleport to="body">
      <div
        v-if="isModalOpen"
        class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        @click.self="isModalOpen = false"
      >
        <div class="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 class="font-bold text-base text-slate-900">
              {{ isEditing ? 'Edit Foto Galeri' : 'Tambah Foto Galeri Baru' }}
            </h3>
            <button
              type="button"
              @click="isModalOpen = false"
              class="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="savePhoto" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-800 mb-1.5">Judul / Keterangan Foto</label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Contoh: Upacara Pembukaan Akbar di Arena Utama"
                class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008f8a]"
              />
            </div>

            <!-- Upload Foto dari Komputer -->
            <ImageUploadInput
              v-model="form.src"
              label="Unggah File Foto dari Komputer *"
              description="Pilih foto dokumentasi langsung dari laptop atau komputer Anda."
              aspect="wide"
            />

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1.5">Kategori Foto</label>
                <select
                  v-model="form.category"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008f8a] bg-white"
                >
                  <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                    {{ cat.label }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-800 mb-1.5">Tanggal Dokumentasi</label>
                <input
                  v-model="form.date"
                  type="text"
                  placeholder="Contoh: 27 Agustus 2026"
                  class="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008f8a]"
                />
              </div>
            </div>

            <div class="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                @click="isModalOpen = false"
                class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#006432] to-[#008f8a] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:brightness-110 cursor-pointer"
              >
                Simpan Foto
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </AdminLayout>
</template>
