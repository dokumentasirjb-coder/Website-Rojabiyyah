<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Plus, Search, Edit3, Trash2, Calendar, MapPin,
  CheckCircle2, AlertCircle, Loader2, X, Pin
} from 'lucide-vue-next'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/lib/axios'
import type { Announcement } from '@/types'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
const announcements = ref<Announcement[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const filterType = ref('')

// Modal Form State
const isFormModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const formError = ref<string | null>(null)
const editingId = ref<number | null>(null)

// Form Fields
const formTitle = ref('')
const formContent = ref('')
const formType = ref<'announcement' | 'event' | 'agenda'>('agenda')
const formEventDate = ref('')
const formEventTime = ref('')
const formLocation = ref('')
const formIsActive = ref(true)
const formIsPinned = ref(false)

// Delete Dialog State
const isDeleteModalOpen = ref(false)
const deletingItem = ref<Announcement | null>(null)
const isDeleting = ref(false)

// Toast
const toastMessage = ref<string | null>(null)

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = null
  }, 3500)
}

async function fetchAnnouncements() {
  isLoading.value = true
  try {
    const params: Record<string, string | number> = { per_page: 15 }
    if (searchQuery.value) params.search = searchQuery.value
    if (filterType.value) params.type = filterType.value

    const res = await api.get<{ data: Announcement[] }>('/admin/announcements', { params })
    announcements.value = res.data.data || []
  } catch (err) {
    console.error('Gagal memuat pengumuman:', err)
  } finally {
    isLoading.value = false
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  formError.value = null

  formTitle.value = ''
  formContent.value = ''
  formType.value = 'agenda'
  formEventDate.value = ''
  formEventTime.value = ''
  formLocation.value = ''
  formIsActive.value = true
  formIsPinned.value = false

  isFormModalOpen.value = true
}

function openEditModal(item: Announcement) {
  isEditing.value = true
  editingId.value = item.id
  formError.value = null

  formTitle.value = item.title
  formContent.value = item.content
  formType.value = item.type
  formEventDate.value = item.event_date || ''
  formEventTime.value = item.event_time || ''
  formLocation.value = item.location || ''
  formIsActive.value = item.is_active
  formIsPinned.value = item.is_pinned

  isFormModalOpen.value = true
}

async function handleSave() {
  if (!formTitle.value || !formContent.value) {
    formError.value = 'Judul dan Konten pengumuman wajib diisi.'
    return
  }

  isSaving.value = true
  formError.value = null

  try {
    const payload = {
      title: formTitle.value,
      content: formContent.value,
      type: formType.value,
      event_date: formEventDate.value || null,
      event_time: formEventTime.value || null,
      location: formLocation.value || null,
      is_active: formIsActive.value,
      is_pinned: formIsPinned.value,
    }

    if (isEditing.value && editingId.value) {
      await api.put(`/admin/announcements/${editingId.value}`, payload)
      showToast('Pengumuman berhasil diperbarui!')
    } else {
      await api.post('/admin/announcements', payload)
      showToast('Pengumuman baru berhasil diterbitkan!')
    }

    isFormModalOpen.value = false
    fetchAnnouncements()
  } catch (err: any) {
    formError.value = err.response?.data?.message || 'Gagal menyimpan pengumuman.'
  } finally {
    isSaving.value = false
  }
}

function confirmDelete(item: Announcement) {
  deletingItem.value = item
  isDeleteModalOpen.value = true
}

async function handleDelete() {
  if (!deletingItem.value) return
  isDeleting.value = true
  try {
    await api.delete(`/admin/announcements/${deletingItem.value.id}`)
    showToast('Pengumuman berhasil dihapus.')
    isDeleteModalOpen.value = false
    deletingItem.value = null
    fetchAnnouncements()
  } catch (err: any) {
    uiStore.notify(err.response?.data?.message || 'Gagal menghapus pengumuman.', 'error')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  fetchAnnouncements()
})
</script>

<template>
  <AdminLayout>
    <!-- Page Header & Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="font-serif text-3xl font-bold text-[#0F3D3E]">
          Manajemen Pengumuman & Agenda
        </h1>
        <p class="text-xs text-[#5C645E] mt-1 font-sans">
          Kelola agenda kegiatan masjid, jadwal kajian, pengajian akbar, dan warta operasional.
        </p>
      </div>

      <button
        type="button"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F3D3E] text-white text-xs font-bold hover:bg-[#165354] transition-all shadow-sm cursor-pointer shrink-0"
      >
        <Plus class="w-4 h-4 text-[#D49B35]" />
        Tambah Pengumuman Baru
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white p-4 rounded-2xl border border-[#E5E0D8] mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
      <div class="relative w-full md:w-80">
        <input
          v-model="searchQuery"
          @keyup.enter="fetchAnnouncements"
          type="text"
          placeholder="Cari pengumuman atau lokasi..."
          class="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E5E0D8] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
        />
        <Search class="w-4 h-4 text-[#5C645E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <select
          v-model="filterType"
          @change="fetchAnnouncements"
          class="px-3 py-2 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
        >
          <option value="">Semua Jenis</option>
          <option value="agenda">Agenda Kegiatan</option>
          <option value="event">Acara / Tabligh</option>
          <option value="announcement">Pengumuman Umum</option>
        </select>
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden shadow-sm">
      <div v-if="isLoading" class="p-12 text-center text-xs text-[#5C645E] flex flex-col items-center justify-center gap-2">
        <Loader2 class="w-6 h-6 animate-spin text-[#0F3D3E]" />
        <span>Memuat pengumuman...</span>
      </div>

      <div v-else-if="announcements.length === 0" class="p-12 text-center text-xs text-[#5C645E]">
        Belum ada pengumuman yang sesuai.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-[#FDFBF7] border-b border-[#E5E0D8] text-[#5C645E] font-semibold uppercase tracking-wider text-[10px]">
              <th class="py-3.5 px-4">Pengumuman & Agenda</th>
              <th class="py-3.5 px-4">Jenis</th>
              <th class="py-3.5 px-4">Tanggal & Waktu</th>
              <th class="py-3.5 px-4">Lokasi</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E5E0D8]/60">
            <tr v-for="item in announcements" :key="item.id" class="hover:bg-[#FDFBF7] transition-colors">
              <!-- Judul -->
              <td class="py-3.5 px-4">
                <div class="flex items-center gap-2">
                  <Pin v-if="item.is_pinned" class="w-3.5 h-3.5 text-[#D49B35] shrink-0" />
                  <span class="font-serif font-bold text-sm text-[#1C1E1D] block">
                    {{ item.title }}
                  </span>
                </div>
                <p class="text-[11px] text-[#5C645E] line-clamp-1 mt-0.5 font-light">
                  {{ item.content }}
                </p>
              </td>

              <!-- Jenis -->
              <td class="py-3.5 px-4">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="[
                    item.type === 'event' ? 'bg-[#0F3D3E]/10 text-[#0F3D3E]' :
                    item.type === 'agenda' ? 'bg-[#D49B35]/20 text-[#D49B35]' : 'bg-slate-100 text-slate-700'
                  ]"
                >
                  {{ item.type_label }}
                </span>
              </td>

              <!-- Jadwal -->
              <td class="py-3.5 px-4 text-[#5C645E]">
                <div v-if="item.event_date_formatted" class="flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5 text-[#D96B43]" />
                  <span>{{ item.event_date_formatted }}</span>
                </div>
                <div v-if="item.event_time_formatted" class="text-[10px] text-[#5C645E] mt-0.5">
                  {{ item.event_time_formatted }}
                </div>
                <span v-if="!item.event_date_formatted" class="text-slate-400">-</span>
              </td>

              <!-- Lokasi -->
              <td class="py-3.5 px-4 text-[#5C645E]">
                <div v-if="item.location" class="flex items-center gap-1">
                  <MapPin class="w-3.5 h-3.5 text-[#5C645E]" />
                  <span>{{ item.location }}</span>
                </div>
                <span v-else class="text-slate-400">-</span>
              </td>

              <!-- Status Aktif -->
              <td class="py-3.5 px-4">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                  :class="[item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500']"
                >
                  {{ item.is_active ? 'Aktif' : 'Nonaktif' }}
                </span>
              </td>

              <!-- Aksi -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <button
                  type="button"
                  @click="openEditModal(item)"
                  class="p-1.5 rounded-lg text-[#0F3D3E] hover:bg-[#0F3D3E]/10 mr-1 cursor-pointer"
                  title="Ubah Pengumuman"
                >
                  <Edit3 class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  @click="confirmDelete(item)"
                  class="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Hapus Pengumuman"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ============================================================
         MODAL TAMBAH / UBAH PENGUMUMAN
         ============================================================ -->
    <Teleport to="body">
      <div
        v-if="isFormModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F3D3E]/60 backdrop-blur-sm"
        @click.self="isFormModalOpen = false"
      >
        <div class="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#E5E0D8] overflow-hidden flex flex-col">
          <div class="px-6 py-4 border-b border-[#E5E0D8] bg-[#FDFBF7] flex items-center justify-between shrink-0">
            <h3 class="font-serif text-lg font-bold text-[#0F3D3E]">
              {{ isEditing ? 'Ubah Pengumuman' : 'Buat Pengumuman / Agenda' }}
            </h3>
            <button type="button" @click="isFormModalOpen = false" class="p-1 rounded-lg text-[#5C645E] hover:bg-[#EDE8DF]">
              <X class="w-5 h-5" />
            </button>
          </div>

          <form @submit.prevent="handleSave" class="p-6 overflow-y-auto space-y-4 flex-1">
            <div v-if="formError" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
              <span>{{ formError }}</span>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Judul Pengumuman / Acara *</label>
              <input
                v-model="formTitle"
                type="text"
                required
                placeholder="Contoh: Kajian Rutin Malam Ahad..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] text-xs font-bold text-[#1C1E1D] focus:ring-2 focus:ring-[#0F3D3E] focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Jenis Informasi</label>
                <select
                  v-model="formType"
                  class="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs bg-white focus:ring-2 focus:ring-[#0F3D3E]"
                >
                  <option value="agenda">Agenda Kegiatan Rutin</option>
                  <option value="event">Acara / Tabligh Akbar</option>
                  <option value="announcement">Pengumuman Umum</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Tanggal Acara</label>
                <input
                  v-model="formEventDate"
                  type="date"
                  class="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs bg-white focus:ring-2 focus:ring-[#0F3D3E]"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Waktu / Jam (Opsional)</label>
                <input
                  v-model="formEventTime"
                  type="text"
                  placeholder="Contoh: 19:30 WIB"
                  class="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs focus:ring-2 focus:ring-[#0F3D3E]"
                />
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Lokasi Kegiatan</label>
                <input
                  v-model="formLocation"
                  type="text"
                  placeholder="Contoh: Masjid Jami Rojabiyyah"
                  class="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs focus:ring-2 focus:ring-[#0F3D3E]"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Deskripsi & Isi Pengumuman *</label>
              <textarea
                v-model="formContent"
                rows="4"
                required
                placeholder="Rincian informasi agenda atau pengumuman..."
                class="w-full px-3.5 py-2 rounded-xl border border-[#E5E0D8] text-xs focus:ring-2 focus:ring-[#0F3D3E]"
              ></textarea>
            </div>

            <div class="flex items-center gap-6 pt-2">
              <label class="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1C1E1D]">
                <input type="checkbox" v-model="formIsActive" class="rounded border-[#E5E0D8] text-[#0F3D3E]" />
                <span>Tampilkan (Aktif)</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1C1E1D]">
                <input type="checkbox" v-model="formIsPinned" class="rounded border-[#E5E0D8] text-[#D49B35]" />
                <span>Sematkan di Atas (Pin)</span>
              </label>
            </div>

            <div class="pt-4 border-t border-[#E5E0D8] flex items-center justify-end gap-2">
              <button
                type="button"
                @click="isFormModalOpen = false"
                class="px-4 py-2 rounded-xl border border-[#E5E0D8] text-xs font-medium text-[#5C645E]"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 rounded-xl bg-[#0F3D3E] text-white text-xs font-bold hover:bg-[#165354] disabled:opacity-50"
              >
                <Loader2 v-if="isSaving" class="w-3.5 h-3.5 animate-spin" />
                <span v-else>{{ isEditing ? 'Simpan Perubahan' : 'Terbitkan' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F3D3E]/60 backdrop-blur-sm"
      >
        <div class="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E0D8] text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Trash2 class="w-6 h-6" />
          </div>
          <h4 class="font-serif text-lg font-bold text-[#1C1E1D]">Hapus Pengumuman?</h4>
          <p class="text-xs text-[#5C645E]">
            Apakah Anda yakin ingin menghapus <strong>"{{ deletingItem?.title }}"</strong>?
          </p>
          <div class="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              @click="isDeleteModalOpen = false"
              class="px-4 py-2 rounded-xl border border-[#E5E0D8] text-xs font-medium text-[#5C645E]"
            >
              Batal
            </button>
            <button
              type="button"
              @click="handleDelete"
              :disabled="isDeleting"
              class="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50"
            >
              <Loader2 v-if="isDeleting" class="w-3.5 h-3.5 animate-spin" />
              <span v-else>Ya, Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast Notification -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="toastMessage"
          class="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-[#0F3D3E] text-white text-xs font-semibold shadow-xl flex items-center gap-2"
        >
          <CheckCircle2 class="w-4 h-4 text-[#D49B35]" />
          {{ toastMessage }}
        </div>
      </Transition>
    </Teleport>
  </AdminLayout>
</template>
