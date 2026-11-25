<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Plus, Search, Edit3, Trash2, Eye, Image as ImageIcon,
  CheckCircle2, XCircle, AlertCircle, Loader2, X, Calendar, Clock
} from 'lucide-vue-next'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/lib/axios'
import type { Article, Category } from '@/types'
import { useUiStore } from '@/stores/uiStore'

const uiStore = useUiStore()
const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
const isLoading = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const filterCategory = ref('')

// Pagination
const currentPage = ref(1)
const lastPage = ref(1)
const totalArticles = ref(0)

// Modal Form State (Create / Edit)
const isFormModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const formError = ref<string | null>(null)
const editingId = ref<number | null>(null)

// Form Fields
const formTitle = ref('')
const formCategoryId = ref<number | ''>('')
const formStatus = ref<'draft' | 'published' | 'archived'>('published')
const formIsFeatured = ref(false)
const formExcerpt = ref('')
const formContent = ref('')
const formCoverFile = ref<File | null>(null)
const coverPreviewUrl = ref<string | null>(null)

// Delete Dialog State
const isDeleteModalOpen = ref(false)
const deletingArticle = ref<Article | null>(null)
const isDeleting = ref(false)

// Toast notification
const toastMessage = ref<string | null>(null)

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = null
  }, 3500)
}

async function fetchCategories() {
  try {
    const res = await api.get<{ data: Category[] }>('/categories')
    categories.value = res.data.data || []
  } catch (err) {
    console.error('Gagal memuat kategori:', err)
  }
}

async function fetchArticles(page = 1) {
  isLoading.value = true
  try {
    const params: Record<string, string | number> = { page, per_page: 10 }
    if (searchQuery.value) params.search = searchQuery.value
    if (filterStatus.value) params.status = filterStatus.value
    if (filterCategory.value) params.category_id = filterCategory.value

    const res = await api.get<{ data: Article[]; meta?: { current_page: number; last_page: number; total: number } }>('/admin/articles', { params })
    articles.value = res.data.data || []
    if (res.data.meta) {
      currentPage.value = res.data.meta.current_page
      lastPage.value = res.data.meta.last_page
      totalArticles.value = res.data.meta.total
    }
  } catch (err) {
    console.error('Gagal memuat artikel:', err)
  } finally {
    isLoading.value = false
  }
}

function openCreateModal() {
  isEditing.value = false
  editingId.value = null
  formError.value = null

  formTitle.value = ''
  formCategoryId.value = categories.value[0]?.id || ''
  formStatus.value = 'published'
  formIsFeatured.value = false
  formExcerpt.value = ''
  formContent.value = ''
  formCoverFile.value = null
  coverPreviewUrl.value = null

  isFormModalOpen.value = true
}

function openEditModal(article: Article) {
  isEditing.value = true
  editingId.value = article.id
  formError.value = null

  formTitle.value = article.title
  formCategoryId.value = article.category?.id || ''
  formStatus.value = article.status
  formIsFeatured.value = article.is_featured
  formExcerpt.value = article.excerpt || ''
  formContent.value = article.content || ''
  formCoverFile.value = null
  coverPreviewUrl.value = article.cover_image || null

  isFormModalOpen.value = true
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validasi ukuran <= 2MB
  if (file.size > 2 * 1024 * 1024) {
    formError.value = 'Ukuran gambar maksimal adalah 2MB.'
    return
  }

  formError.value = null
  formCoverFile.value = file
  coverPreviewUrl.value = URL.createObjectURL(file)
}

async function handleSaveArticle() {
  if (!formTitle.value || !formCategoryId.value || !formContent.value) {
    formError.value = 'Judul, Kategori, dan Konten artikel wajib diisi.'
    return
  }

  isSaving.value = true
  formError.value = null

  try {
    const formData = new FormData()
    formData.append('title', formTitle.value)
    formData.append('category_id', String(formCategoryId.value))
    formData.append('status', formStatus.value)
    formData.append('is_featured', formIsFeatured.value ? '1' : '0')
    formData.append('content', formContent.value)
    if (formExcerpt.value) formData.append('excerpt', formExcerpt.value)
    if (formCoverFile.value) formData.append('cover_image', formCoverFile.value)

    if (isEditing.value && editingId.value) {
      // Laravel route update dengan multipart form-data via _method PUT
      formData.append('_method', 'PUT')
      await api.post(`/admin/articles/${editingId.value}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      showToast('Artikel berhasil diperbarui!')
    } else {
      await api.post('/admin/articles', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      showToast('Artikel baru berhasil diterbitkan!')
    }

    isFormModalOpen.value = false
    fetchArticles(currentPage.value)
  } catch (err: any) {
    formError.value = err.response?.data?.message || 'Gagal menyimpan artikel. Periksa isian form.'
  } finally {
    isSaving.value = false
  }
}

function confirmDelete(article: Article) {
  deletingArticle.value = article
  isDeleteModalOpen.value = true
}

async function handleDeleteArticle() {
  if (!deletingArticle.value) return
  isDeleting.value = true
  try {
    await api.delete(`/admin/articles/${deletingArticle.value.id}`)
    showToast('Artikel berhasil dihapus.')
    isDeleteModalOpen.value = false
    deletingArticle.value = null
    fetchArticles(currentPage.value)
  } catch (err: any) {
    uiStore.notify(err.response?.data?.message || 'Gagal menghapus artikel.', 'error')
  } finally {
    isDeleting.value = false
  }
}

onMounted(async () => {
  await fetchCategories()
  await fetchArticles()
})
</script>

<template>
  <AdminLayout>
    <!-- Page Header & Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="font-serif text-3xl font-bold text-[#0F3D3E]">
          Manajemen Berita & Warta
        </h1>
        <p class="text-xs text-[#5C645E] mt-1 font-sans">
          Kelola seluruh artikel, draft tulisan, liputan kegiatan, dan rubrikasi editorial.
        </p>
      </div>

      <button
        type="button"
        @click="openCreateModal"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F3D3E] text-white text-xs font-bold hover:bg-[#165354] transition-all shadow-sm cursor-pointer shrink-0"
      >
        <Plus class="w-4 h-4 text-[#D49B35]" />
        Tambah Warta Baru
      </button>
    </div>

    <!-- Filter & Search Bar -->
    <div class="bg-white p-4 rounded-2xl border border-[#E5E0D8] mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-2xs">
      <div class="relative w-full md:w-80">
        <input
          v-model="searchQuery"
          @keyup.enter="fetchArticles(1)"
          type="text"
          placeholder="Cari judul artikel..."
          class="w-full pl-9 pr-3 py-2 rounded-xl bg-[#FDFBF7] border border-[#E5E0D8] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
        />
        <Search class="w-4 h-4 text-[#5C645E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <!-- Filter Status -->
        <select
          v-model="filterStatus"
          @change="fetchArticles(1)"
          class="px-3 py-2 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
        >
          <option value="">Semua Status</option>
          <option value="published">Terbit (Published)</option>
          <option value="draft">Draf (Draft)</option>
          <option value="archived">Diarsipkan (Archived)</option>
        </select>

        <!-- Filter Kategori -->
        <select
          v-model="filterCategory"
          @change="fetchArticles(1)"
          class="px-3 py-2 rounded-xl border border-[#E5E0D8] bg-[#FDFBF7] text-xs text-[#1C1E1D] focus:outline-none focus:ring-2 focus:ring-[#0F3D3E]"
        >
          <option value="">Semua Kategori</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Articles Table Card -->
    <div class="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden shadow-sm">
      <div v-if="isLoading" class="p-12 text-center text-xs text-[#5C645E] flex flex-col items-center justify-center gap-2">
        <Loader2 class="w-6 h-6 animate-spin text-[#0F3D3E]" />
        <span>Memuat data artikel...</span>
      </div>

      <div v-else-if="articles.length === 0" class="p-12 text-center text-xs text-[#5C645E]">
        Belum ada artikel yang cocok dengan pencarian atau filter Anda.
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-[#FDFBF7] border-b border-[#E5E0D8] text-[#5C645E] font-semibold uppercase tracking-wider text-[10px]">
              <th class="py-3.5 px-4">Artikel</th>
              <th class="py-3.5 px-4">Rubrik</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-4">Sorotan</th>
              <th class="py-3.5 px-4">Penulis</th>
              <th class="py-3.5 px-4">Pembaca</th>
              <th class="py-3.5 px-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#E5E0D8]/60">
            <tr v-for="item in articles" :key="item.id" class="hover:bg-[#FDFBF7] transition-colors">
              <!-- Judul & Thumbnail -->
              <td class="py-3.5 px-4 flex items-center gap-3">
                <div class="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-[#E5E0D8]">
                  <img :src="item.cover_image" :alt="item.title" class="w-full h-full object-cover" />
                </div>
                <div class="max-w-xs sm:max-w-sm truncate">
                  <span class="font-serif font-bold text-sm text-[#1C1E1D] block truncate">
                    {{ item.title }}
                  </span>
                  <span class="text-[11px] text-[#5C645E]">
                    {{ item.published_at_formatted || 'Draf' }}
                  </span>
                </div>
              </td>

              <!-- Kategori -->
              <td class="py-3.5 px-4">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0F3D3E]/10 text-[#0F3D3E]">
                  {{ item.category?.name || '-' }}
                </span>
              </td>

              <!-- Status -->
              <td class="py-3.5 px-4">
                <span
                  class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  :class="[
                    item.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                  ]"
                >
                  {{ item.status }}
                </span>
              </td>

              <!-- Sorotan / Featured -->
              <td class="py-3.5 px-4">
                <span v-if="item.is_featured" class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D49B35]/20 text-[#D49B35]">
                  Utama
                </span>
                <span v-else class="text-[#5C645E]">-</span>
              </td>

              <!-- Penulis -->
              <td class="py-3.5 px-4 text-[#5C645E]">
                {{ item.author?.name || 'Redaksi' }}
              </td>

              <!-- View Count -->
              <td class="py-3.5 px-4 text-[#5C645E] font-medium">
                {{ item.view_count }}
              </td>

              <!-- Aksi -->
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <button
                  type="button"
                  @click="openEditModal(item)"
                  class="p-1.5 rounded-lg text-[#0F3D3E] hover:bg-[#0F3D3E]/10 mr-1 cursor-pointer"
                  title="Ubah Artikel"
                >
                  <Edit3 class="w-4 h-4" />
                </button>
                <button
                  type="button"
                  @click="confirmDelete(item)"
                  class="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                  title="Hapus Artikel"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="lastPage > 1" class="p-4 border-t border-[#E5E0D8] bg-[#FDFBF7] flex items-center justify-between text-xs text-[#5C645E]">
        <span>Menampilkan halaman {{ currentPage }} dari {{ lastPage }} (Total: {{ totalArticles }} artikel)</span>
        <div class="flex items-center gap-1">
          <button
            type="button"
            @click="fetchArticles(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-2.5 py-1 rounded-lg border border-[#E5E0D8] bg-white disabled:opacity-40"
          >
            Sebelumnya
          </button>
          <button
            type="button"
            @click="fetchArticles(currentPage + 1)"
            :disabled="currentPage === lastPage"
            class="px-2.5 py-1 rounded-lg border border-[#E5E0D8] bg-white disabled:opacity-40"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================
         MODAL TAMBAH / UBAH ARTIKEL
         ============================================================ -->
    <Teleport to="body">
      <div
        v-if="isFormModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F3D3E]/60 backdrop-blur-sm"
        @click.self="isFormModalOpen = false"
      >
        <div class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#E5E0D8] overflow-hidden flex flex-col">
          <!-- Header Modal -->
          <div class="px-6 py-4 border-b border-[#E5E0D8] bg-[#FDFBF7] flex items-center justify-between shrink-0">
            <h3 class="font-serif text-lg font-bold text-[#0F3D3E]">
              {{ isEditing ? 'Perbarui Warta Artikel' : 'Tulis Warta Artikel Baru' }}
            </h3>
            <button type="button" @click="isFormModalOpen = false" class="p-1 rounded-lg text-[#5C645E] hover:bg-[#EDE8DF]">
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Body Form Scrollable -->
          <form @submit.prevent="handleSaveArticle" class="p-6 overflow-y-auto space-y-4 flex-1">
            <!-- Alert Error -->
            <div v-if="formError" class="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle class="w-4 h-4 text-rose-600 shrink-0" />
              <span>{{ formError }}</span>
            </div>

            <!-- Judul -->
            <div>
              <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Judul Artikel *</label>
              <input
                v-model="formTitle"
                type="text"
                required
                placeholder="Masukkan judul artikel yang memikat..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] text-xs font-serif font-bold text-[#1C1E1D] focus:ring-2 focus:ring-[#0F3D3E] focus:outline-none"
              />
            </div>

            <!-- Rubrik & Status & Featured Row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Rubrik / Kategori *</label>
                <select
                  v-model="formCategoryId"
                  required
                  class="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs bg-white focus:ring-2 focus:ring-[#0F3D3E] focus:outline-none"
                >
                  <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                    {{ cat.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Status Publikasi</label>
                <select
                  v-model="formStatus"
                  class="w-full px-3 py-2 rounded-xl border border-[#E5E0D8] text-xs bg-white focus:ring-2 focus:ring-[#0F3D3E] focus:outline-none"
                >
                  <option value="published">Terbitkan Langsung</option>
                  <option value="draft">Simpan Sebagai Draf</option>
                  <option value="archived">Arsipkan</option>
                </select>
              </div>

              <div class="flex items-center pt-5">
                <label class="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1C1E1D]">
                  <input
                    type="checkbox"
                    v-model="formIsFeatured"
                    class="rounded border-[#E5E0D8] text-[#0F3D3E] focus:ring-[#0F3D3E]"
                  />
                  <span>Jadikan Berita Utama</span>
                </label>
              </div>
            </div>

            <!-- Upload Cover Image -->
            <div>
              <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Gambar Sampul (Maks. 2MB, JPG/PNG/WebP)</label>
              <div class="flex items-center gap-4">
                <div v-if="coverPreviewUrl" class="w-24 h-16 rounded-xl overflow-hidden bg-slate-100 border border-[#E5E0D8] shrink-0">
                  <img :src="coverPreviewUrl" alt="Preview Cover" class="w-full h-full object-cover" />
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  @change="handleFileChange"
                  class="text-xs text-[#5C645E] file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#0F3D3E]/10 file:text-[#0F3D3E] hover:file:bg-[#0F3D3E]/20"
                />
              </div>
            </div>

            <!-- Excerpt -->
            <div>
              <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Ringkasan Singkat (Excerpt)</label>
              <textarea
                v-model="formExcerpt"
                rows="2"
                placeholder="Ringkasan 1-2 kalimat untuk preview pembaca..."
                class="w-full px-3.5 py-2 rounded-xl border border-[#E5E0D8] text-xs text-[#1C1E1D] focus:ring-2 focus:ring-[#0F3D3E] focus:outline-none"
              ></textarea>
            </div>

            <!-- Konten Lengkap -->
            <div>
              <label class="block text-xs font-semibold text-[#1C1E1D] mb-1">Isi Konten Artikel * (Mendukung HTML & Paragraf)</label>
              <textarea
                v-model="formContent"
                rows="8"
                required
                placeholder="Tuliskan naskah warta secara lengkap..."
                class="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E0D8] text-xs font-sans text-[#1C1E1D] focus:ring-2 focus:ring-[#0F3D3E] focus:outline-none"
              ></textarea>
            </div>

            <!-- Footer Action Buttons -->
            <div class="pt-4 border-t border-[#E5E0D8] flex items-center justify-end gap-2">
              <button
                type="button"
                @click="isFormModalOpen = false"
                class="px-4 py-2 rounded-xl border border-[#E5E0D8] text-xs font-medium text-[#5C645E] hover:bg-[#EDE8DF]"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 rounded-xl bg-[#0F3D3E] text-white text-xs font-bold hover:bg-[#165354] shadow-sm flex items-center gap-1.5 disabled:opacity-50"
              >
                <Loader2 v-if="isSaving" class="w-3.5 h-3.5 animate-spin text-[#D49B35]" />
                <span>{{ isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- ============================================================
         MODAL KONFIRMASI HAPUS
         ============================================================ -->
    <Teleport to="body">
      <div
        v-if="isDeleteModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F3D3E]/60 backdrop-blur-sm"
      >
        <div class="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-[#E5E0D8] text-center space-y-4">
          <div class="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <Trash2 class="w-6 h-6" />
          </div>
          <h4 class="font-serif text-lg font-bold text-[#1C1E1D]">Hapus Artikel?</h4>
          <p class="text-xs text-[#5C645E]">
            Apakah Anda yakin ingin menghapus artikel <strong>"{{ deletingArticle?.title }}"</strong>? Tindakan ini dapat dipulihkan melalui soft delete di database.
          </p>
          <div class="flex items-center justify-center gap-2 pt-2">
            <button
              type="button"
              @click="isDeleteModalOpen = false"
              class="px-4 py-2 rounded-xl border border-[#E5E0D8] text-xs font-medium text-[#5C645E] hover:bg-[#EDE8DF]"
            >
              Batal
            </button>
            <button
              type="button"
              @click="handleDeleteArticle"
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
