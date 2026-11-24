<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { X, Calendar, Clock, Eye, Share2, Check, ArrowRight, BookOpen } from 'lucide-vue-next'
import { useNewsStore } from '@/stores/newsStore'
import type { Article } from '@/types'

const newsStore = useNewsStore()
const modalContentRef = ref<HTMLElement | null>(null)
const readingProgress = ref(0)
const showToast = ref(false)
let toastTimer: any = null

function handleScroll() {
  const el = modalContentRef.value
  if (!el) return
  const scrollTop = el.scrollTop
  const scrollHeight = el.scrollHeight - el.clientHeight
  if (scrollHeight > 0) {
    readingProgress.value = Math.min(100, Math.max(0, Math.round((scrollTop / scrollHeight) * 100)))
  } else {
    readingProgress.value = 0
  }
}

async function copyArticleLink() {
  const url = window.location.origin + '/artikel/' + (newsStore.selectedArticle?.slug || '')
  try {
    await navigator.clipboard.writeText(url)
    showToast.value = true
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      showToast.value = false
    }, 3000)
  } catch {
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    showToast.value = true
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}

function handleRelatedClick(article: Article) {
  newsStore.openArticle(article)
  nextTick(() => {
    if (modalContentRef.value) {
      modalContentRef.value.scrollTop = 0
    }
  })
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && newsStore.isModalOpen) {
    newsStore.closeArticleModal()
  }
}

watch(
  () => newsStore.isModalOpen,
  (open) => {
    if (open) {
      document.body.style.overflow = 'hidden'
      nextTick(() => {
        if (modalContentRef.value) {
          modalContentRef.value.scrollTop = 0
          readingProgress.value = 0
        }
      })
    } else {
      document.body.style.overflow = ''
    }
  }
)

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
  if (toastTimer) clearTimeout(toastTimer)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="newsStore.isModalOpen && newsStore.selectedArticle"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F3D3E]/60 backdrop-blur-md"
        @click.self="newsStore.closeArticleModal"
      >
        <div class="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-[#E5E0D8] overflow-hidden flex flex-col animate-fade-in">
          <!-- Reading Progress Bar -->
          <div class="h-1.5 w-full bg-[#E5E0D8]/60 shrink-0 relative">
            <div
              class="h-full bg-gradient-to-r from-[#D96B43] via-[#D49B35] to-[#0F3D3E] transition-all duration-150"
              :style="{ width: `${readingProgress}%` }"
            ></div>
          </div>

          <!-- Header Modal -->
          <div class="px-6 py-3.5 border-b border-[#E5E0D8] bg-[#FDFBF7] flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0F3D3E] text-white">
                {{ newsStore.selectedArticle.category?.name || 'Warta' }}
              </span>
              <span class="text-xs text-[#5C645E] hidden sm:inline">
                • {{ readingProgress }}% selesai membaca
              </span>
            </div>

            <div class="flex items-center gap-2">
              <button
                type="button"
                @click="copyArticleLink"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E0D8] bg-white text-xs font-semibold text-[#1C1E1D] hover:bg-[#EDE8DF] transition-colors cursor-pointer"
                title="Salin Tautan Artikel"
              >
                <Share2 class="w-3.5 h-3.5 text-[#D96B43]" />
                <span class="hidden sm:inline">Salin Tautan</span>
              </button>

              <button
                type="button"
                @click="newsStore.closeArticleModal"
                class="p-1.5 rounded-xl text-[#5C645E] hover:text-[#1C1E1D] hover:bg-[#EDE8DF] transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Toast Salin Tautan -->
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-2"
          >
            <div
              v-if="showToast"
              class="absolute top-14 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-xl bg-[#0F3D3E] text-white text-xs font-semibold flex items-center gap-2 shadow-lg"
            >
              <Check class="w-4 h-4 text-[#D49B35]" />
              Tautan artikel berhasil disalin ke clipboard!
            </div>
          </Transition>

          <!-- Scrollable Content -->
          <div ref="modalContentRef" @scroll="handleScroll" class="flex-1 overflow-y-auto px-6 sm:px-10 py-8 space-y-6">
            <h1 class="font-serif text-2xl sm:text-4xl font-bold text-[#1C1E1D] leading-tight">
              {{ newsStore.selectedArticle.title }}
            </h1>

            <div class="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#5C645E] pb-5 border-b border-[#E5E0D8] font-light">
              <span class="font-medium text-[#0F3D3E] flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-[#0F3D3E]/10 text-[#0F3D3E] flex items-center justify-center font-bold text-[10px]">
                  {{ newsStore.selectedArticle.author?.name?.charAt(0) || 'R' }}
                </span>
                {{ newsStore.selectedArticle.author?.name || 'Redaksi Rojabiyyah' }}
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <Calendar class="w-3.5 h-3.5 text-[#D96B43]" />
                {{ newsStore.selectedArticle.published_at_formatted || 'Baru saja' }}
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <Clock class="w-3.5 h-3.5 text-[#D49B35]" />
                {{ newsStore.selectedArticle.reading_time }}
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <Eye class="w-3.5 h-3.5 text-[#5C645E]" />
                {{ newsStore.selectedArticle.view_count }} pembaca
              </span>
            </div>

            <div class="rounded-2xl overflow-hidden bg-slate-100 border border-[#E5E0D8]">
              <img
                :src="newsStore.selectedArticle.cover_image"
                :alt="newsStore.selectedArticle.title"
                class="w-full max-h-[380px] object-cover object-center"
              />
            </div>

            <div
              class="font-serif text-base sm:text-lg text-[#1C1E1D]/90 leading-relaxed space-y-4 pt-2"
              v-html="newsStore.selectedArticle.content"
            ></div>

            <div
              v-if="newsStore.selectedArticle.author"
              class="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E5E0D8] flex items-center gap-4 mt-8"
            >
              <div class="w-12 h-12 rounded-full bg-[#0F3D3E] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0">
                {{ newsStore.selectedArticle.author.name?.charAt(0) }}
              </div>
              <div>
                <span class="text-[11px] font-bold uppercase tracking-wider text-[#D96B43]">Tentang Penulis</span>
                <h4 class="font-serif text-base font-bold text-[#1C1E1D]">
                  {{ newsStore.selectedArticle.author.name }}
                </h4>
                <p class="text-xs text-[#5C645E] mt-0.5">
                  {{ newsStore.selectedArticle.author.bio || 'Redaktur warta dan kajian di portal resmi Rojabiyyah.' }}
                </p>
              </div>
            </div>

            <!-- Bacaan Terkait -->
            <div v-if="newsStore.relatedArticles.length > 0" class="pt-8 border-t border-[#E5E0D8] space-y-4">
              <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F3D3E]">
                <BookOpen class="w-4 h-4 text-[#D49B35]" />
                Bacaan Terkait dalam Rubrik Ini
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div
                  v-for="rel in newsStore.relatedArticles"
                  :key="rel.id"
                  @click="handleRelatedClick(rel)"
                  class="group p-3 rounded-xl bg-[#FDFBF7] border border-[#E5E0D8] hover:border-[#D49B35] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div class="h-24 rounded-lg overflow-hidden mb-2 bg-slate-100">
                    <img :src="rel.cover_image" :alt="rel.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h5 class="font-serif text-xs font-bold text-[#1C1E1D] group-hover:text-[#0F3D3E] line-clamp-2 leading-snug">
                    {{ rel.title }}
                  </h5>
                  <div class="mt-2 text-[10px] text-[#D96B43] flex items-center gap-1 font-semibold">
                    Baca <ArrowRight class="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
