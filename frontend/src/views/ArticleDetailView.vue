<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import type { Article } from '@/types'
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Check, 
  User, 
  BookOpen, 
  Eye, 
  Sparkles,
  ChevronRight,
  MessageCircle,
  Facebook,
  Twitter,
  Send,
  Tag
} from 'lucide-vue-next'
import { useNewsStore } from '@/stores/newsStore'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const copiedToast = ref(false)
let copyTimer: any = null

const currentSlug = computed(() => route.params.slug as string)

const isAdmin = computed(() => {
  return typeof window !== 'undefined' && !!localStorage.getItem('admin_token')
})

const currentArticle = computed<Article | null>(() => {
  if (newsStore.selectedArticle && newsStore.selectedArticle.slug === currentSlug.value) {
    return newsStore.selectedArticle
  }
  if (newsStore.currentArticle && newsStore.currentArticle.slug === currentSlug.value) {
    return newsStore.currentArticle
  }
  const found = newsStore.articles.find(a => a.slug === currentSlug.value)
  return found ?? null
})

const isAccessible = computed(() => {
  if (!currentArticle.value) return false
  // Draft articles are hidden from the public unless logged in as admin
  if (currentArticle.value.status === 'draft' && !isAdmin.value) return false
  return true
})

const otherArticles = computed(() => {
  if (newsStore.relatedArticles && newsStore.relatedArticles.length > 0) {
    return newsStore.relatedArticles.filter(a => a.slug !== currentSlug.value).slice(0, 3)
  }
  if (newsStore.articles && newsStore.articles.length > 0) {
    return newsStore.articles.filter(a => a.slug !== currentSlug.value && a.status === 'published').slice(0, 3)
  }
  return []
})

const parsedTags = computed<string[]>(() => {
  if (!currentArticle.value?.tags) return []
  if (Array.isArray(currentArticle.value.tags)) return currentArticle.value.tags
  return currentArticle.value.tags
    .split(',')
    .map(t => t.trim().replace(/^#/, ''))
    .filter(Boolean)
})

const currentUrl = computed(() => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return ''
})

const shareUrls = computed(() => {
  const url = encodeURIComponent(currentUrl.value)
  const title = encodeURIComponent(currentArticle.value?.title || 'Panitia Rojabiyyah & Haul Abah Ke-5')
  return {
    whatsapp: `https://api.whatsapp.com/send?text=${title}%20${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
    telegram: `https://t.me/share/url?url=${url}&text=${title}`
  }
})

function formatContent(raw: string, mediaMap?: Record<string, string>): string {
  if (!raw) return ''

  let text = raw.trim()

  // Replace Markdown images: ![alt](url)
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, (_match, alt, src) => {
    let actualSrc = src.trim()
    if (mediaMap && mediaMap[actualSrc]) {
      actualSrc = mediaMap[actualSrc]
    }
    const cap = alt ? `<figcaption class="text-center text-xs text-slate-500 py-2.5 px-4 font-medium italic border-t border-slate-100 bg-white/70">📷 ${alt}</figcaption>` : ''
    return `<figure class="my-8 rounded-2xl overflow-hidden border border-slate-200/80 bg-slate-50/50 shadow-xs"><img src="${actualSrc}" alt="${alt || 'Foto Berita'}" class="w-full object-cover max-h-[550px]" />${cap}</figure>`
  })

  // Replace Banner Links: [[banner:url|title|subtitle]]
  text = text.replace(/\[\[banner:(.*?)\|(.*?)(?:\|(.*?))?\]\]/g, (_match, url, title, subtitle) => {
    const isExt = url.startsWith('http://') || url.startsWith('https://')
    const target = isExt ? 'target="_blank" rel="noopener noreferrer"' : ''
    const sub = subtitle ? `<p class="text-xs sm:text-sm text-slate-600 mt-1.5 font-normal leading-relaxed">${subtitle.trim()}</p>` : ''
    return `<div class="banner-link-card my-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/60 to-white border-2 border-emerald-500/25 shadow-sm hover:border-emerald-500/60 hover:shadow-md transition-all"><div class="flex items-center gap-2 mb-2"><span class="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold tracking-wider uppercase">BACA JUGA / TAUTAN TERKAIT</span></div><a href="${url.trim()}" ${target} class="group block text-decoration-none"><h4 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors flex items-center justify-between gap-3"><span>${title.trim()}</span><span class="shrink-0 text-emerald-600 font-semibold text-xs sm:text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">Buka Tautan &rarr;</span></h4>${sub}</a></div>`
  })

  // Replace standard Markdown links: [text](url)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, (_match, linkText, url) => {
    const isExt = url.startsWith('http://') || url.startsWith('https://')
    const target = isExt ? 'target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${url.trim()}" ${target} class="text-[#008f8a] hover:text-[#006e6a] font-semibold underline decoration-2 underline-offset-4 decoration-[#008f8a]/40 hover:decoration-[#008f8a] transition-all">${linkText}</a>`
  })

  // Replace Markdown headings
  text = text.replace(/^### (.*$)/gim, '<h3 class="text-xl sm:text-2xl font-bold text-slate-900 mt-8 mb-3 tracking-tight">$1</h3>')
  text = text.replace(/^## (.*$)/gim, '<h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">$1</h2>')
  text = text.replace(/^# (.*$)/gim, '<h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mt-10 mb-4 tracking-tight">$1</h2>')

  // Replace Markdown blockquotes: > quote
  text = text.replace(/^\> (.*$)/gim, '<blockquote class="p-6 my-8 rounded-2xl bg-[#fbfbfa] border-l-4 border-[#008f8a] text-slate-800 italic font-medium leading-relaxed">$1</blockquote>')

  // Replace bold and italics
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')

  // If already contains HTML paragraphs or headings
  if (text.includes('<p') || text.includes('<h2') || text.includes('<h3') || text.includes('<figure') || text.includes('banner-link-card')) {
    const blocks = text.split(/\n\s*\n/)
    return blocks.map(block => {
      block = block.trim()
      if (!block) return ''
      if (block.startsWith('<p') || block.startsWith('<h2') || block.startsWith('<h3') || block.startsWith('<figure') || block.startsWith('<blockquote') || block.startsWith('<ul') || block.startsWith('<ol') || block.startsWith('<div class="banner-link-card')) {
        return block
      }
      return `<p class="mb-6 leading-relaxed text-slate-700 text-base sm:text-lg font-normal">${block.replace(/\n/g, '<br/>')}</p>`
    }).join('\n')
  }

  // Plain text: split by double newlines into clean paragraphs
  const paragraphs = text.split(/\n\s*\n/)
  return paragraphs.map(p => {
    p = p.trim()
    if (!p) return ''
    return `<p class="mb-6 leading-relaxed text-slate-700 text-base sm:text-lg font-normal">${p.replace(/\n/g, '<br/>')}</p>`
  }).join('\n')
}

async function copyLink() {
  const url = window.location.href
  try {
    await navigator.clipboard.writeText(url)
  } catch {
    const input = document.createElement('input')
    input.value = url
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
  }
  copiedToast.value = true
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copiedToast.value = false
  }, 3000)
}

function handleNavTo(sectionId: string) {
  router.push('/#' + sectionId)
}

// SEO & View Count
watch(() => currentArticle.value, (art) => {
  if (art) {
    document.title = (art.metaTitle || art.title) + ' — Panitia Rojabiyyah & Haul Abah Ke-5'
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute('content', art.metaDescription || art.excerpt || art.title)
  }
}, { immediate: true })

onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  if (currentSlug.value) {
    newsStore.incrementViewCount(currentSlug.value)
    await newsStore.fetchArticleBySlug(currentSlug.value)
  }
})

watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    newsStore.incrementViewCount(newSlug as string)
    await newsStore.fetchArticleBySlug(newSlug as string)
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
    <!-- Navbar -->
    <Navbar active-section="berita" @navigate="handleNavTo" />

    <!-- Main Full Page Content -->
    <main class="flex-1 pb-20">
      <!-- Breadcrumb Bar -->
      <div class="border-b border-slate-100 bg-[#fbfbfa]">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between text-xs">
          <RouterLink
            to="/#berita"
            class="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-[#008f8a] transition-colors"
          >
            <ArrowLeft class="w-4 h-4" />
            <span>Kembali ke Berita & Liputan</span>
          </RouterLink>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="newsStore.isLoadingDetail" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 animate-pulse">
        <div class="flex items-center gap-3 mb-4">
          <div class="h-6 w-24 rounded-full bg-slate-200"></div>
          <div class="h-4 w-32 rounded bg-slate-200"></div>
        </div>
        <div class="h-10 sm:h-12 w-3/4 rounded-xl bg-slate-200 mb-3"></div>
        <div class="h-10 sm:h-12 w-1/2 rounded-xl bg-slate-200 mb-8"></div>
        <div class="aspect-[16/9] sm:aspect-[2/1] rounded-3xl bg-slate-200 mb-10"></div>
        <div class="space-y-4">
          <div class="h-4 w-full rounded bg-slate-200"></div>
          <div class="h-4 w-11/12 rounded bg-slate-200"></div>
          <div class="h-4 w-4/5 rounded bg-slate-200"></div>
        </div>
      </div>

      <!-- Article Header & Body Container -->
      <article v-else-if="currentArticle && isAccessible" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        <!-- Draft Mode Banner for Admin -->
        <div
          v-if="currentArticle.status === 'draft'"
          class="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs flex items-center justify-between gap-3 shadow-xs"
        >
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase">
              DRAF
            </span>
            <span class="font-medium">
              Mode Pratinjau Administrator: Berita ini masih berstatus DRAF dan tidak terlihat oleh publik umum.
            </span>
          </div>
          <RouterLink to="/admin/content?tab=berita" class="text-[11px] font-bold text-amber-700 hover:underline shrink-0">
            Kelola di Admin &rarr;
          </RouterLink>
        </div>

        <!-- Category & Date Metadata -->
        <div class="flex flex-wrap items-center gap-3 text-xs mb-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full bg-[#008f8a]/10 text-[#008f8a] font-bold tracking-wider uppercase text-[11px]">
            {{ currentArticle.category?.name || 'LIPUTAN' }}
          </span>
          <span class="text-slate-400">•</span>
          <span class="inline-flex items-center gap-1 text-slate-500">
            <Calendar class="w-3.5 h-3.5 text-slate-400" />
            {{ currentArticle.published_at_formatted || currentArticle.created_at_formatted || '' }}
          </span>
          <span class="text-slate-400">•</span>
          <span class="inline-flex items-center gap-1.5 text-slate-500 font-medium">
            <Eye class="w-3.5 h-3.5 text-slate-400" />
            <span>{{ currentArticle.view_count || 0 }} dilihat</span>
          </span>
        </div>

        <!-- Big Article Title -->
        <h1 class="text-2xl sm:text-4xl lg:text-[2.75rem] font-bold text-slate-900 leading-tight sm:leading-[1.2] mb-6">
          {{ currentArticle.title }}
        </h1>

        <!-- Author Byline -->
        <div class="flex items-center gap-3 pb-8 mb-8 border-b border-slate-100">
          <div class="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-xs text-[#008f8a] uppercase shadow-2xs">
            {{ (currentArticle.author_name || currentArticle.author?.name || 'A').charAt(0) }}
          </div>
          <div>
            <span class="block text-xs sm:text-sm font-bold text-slate-900">
              {{ currentArticle.author_name || currentArticle.author?.name || 'Admin Redaksi' }}
            </span>
            <span class="block text-[11px] text-slate-500 font-normal">
              {{ currentArticle.author_role || currentArticle.author?.role || 'Redaktur' }}
            </span>
          </div>
        </div>

        <!-- Full Width Featured Cover Image -->
        <div class="relative aspect-[16/9] sm:aspect-[2/1] rounded-3xl overflow-hidden mb-10 bg-slate-100 border border-slate-100 shadow-sm">
          <img
            :src="currentArticle.cover_image || currentArticle.cover_image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80'"
            :alt="currentArticle.title"
            class="w-full h-full object-cover"
          />
        </div>

        <!-- Article Body Text (Proper Paragraphs & Headings Formatting) -->
        <div
          class="prose prose-slate max-w-none text-slate-800 leading-relaxed font-normal"
          v-html="formatContent(currentArticle.content, currentArticle.mediaMap)"
        ></div>

        <!-- Tags Section -->
        <div v-if="parsedTags.length > 0" class="mt-10 pt-6 border-t border-slate-100">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
              TAG:
            </span>
            <button
              v-for="t in parsedTags"
              :key="t"
              type="button"
              @click="router.push({ path: '/berita', query: { tag: t } })"
              class="px-3 py-1 rounded-full bg-[#008f8a]/10 text-[#008f8a] hover:bg-[#008f8a]/20 text-xs font-medium transition-colors cursor-pointer"
            >
              #{{ t }}
            </button>
          </div>
        </div>

        <!-- Bottom Share Section: Compact 1-Row Horizontal Bar -->
        <div class="mt-8 py-4 border-y border-dashed border-slate-200 flex flex-wrap items-center justify-between gap-3 relative">
          <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#008f8a]" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>BAGIKAN</span>
          </div>

          <div class="flex items-center gap-2.5">
            <!-- WhatsApp -->
            <a
              :href="shareUrls.whatsapp"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bagikan ke WhatsApp"
              title="Bagikan ke WhatsApp"
              class="w-10 h-10 rounded-full bg-[#22C55E] hover:opacity-90 text-white flex items-center justify-center transition-opacity shadow-2xs"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .15 5.34.15 11.91c0 2.1.55 4.15 1.6 5.96L0 24l6.31-1.65a11.86 11.86 0 0 0 5.75 1.47h.01c6.57 0 11.91-5.34 11.91-11.91 0-3.18-1.24-6.17-3.46-8.43Zm-8.46 18.33h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.52-5.27c0-5.46 4.44-9.9 9.91-9.9 2.65 0 5.14 1.03 7.01 2.9a9.84 9.84 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.91 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.08 4.5.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z"/>
              </svg>
            </a>

            <!-- Facebook -->
            <a
              :href="shareUrls.facebook"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bagikan ke Facebook"
              title="Bagikan ke Facebook"
              class="w-10 h-10 rounded-full bg-[#1877F2] hover:opacity-90 text-white flex items-center justify-center transition-opacity shadow-2xs"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07Z"/>
              </svg>
            </a>

            <!-- X (Twitter) -->
            <a
              :href="shareUrls.twitter"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bagikan ke X"
              title="Bagikan ke X"
              class="w-10 h-10 rounded-full bg-[#1E293B] hover:opacity-90 text-white flex items-center justify-center transition-opacity shadow-2xs"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            <!-- Telegram -->
            <a
              :href="shareUrls.telegram"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bagikan ke Telegram"
              title="Bagikan ke Telegram"
              class="w-10 h-10 rounded-full bg-[#26A5E4] hover:opacity-90 text-white flex items-center justify-center transition-opacity shadow-2xs"
            >
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42Z"/>
              </svg>
            </a>

            <!-- Salin Tautan -->
            <button
              type="button"
              @click="copyLink"
              aria-label="Salin Tautan"
              :title="copiedToast ? 'Tautan disalin' : 'Salin Tautan'"
              class="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              :class="copiedToast ? 'border-emerald-500 text-emerald-600 bg-emerald-50' : ''"
            >
              <svg v-if="copiedToast" viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <svg v-else viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </button>
          </div>

          <span
            v-if="copiedToast"
            class="absolute -top-8 right-0 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-medium shadow-sm"
          >
            Tautan disalin
          </span>
        </div>

        <!-- Related News Section -->
        <div class="mt-16 pt-12 border-t border-slate-200">
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-xl sm:text-2xl font-bold text-slate-900">
              Warta Terkait Lainnya
            </h3>
            <RouterLink to="/#berita" class="text-xs font-semibold text-[#008f8a] hover:underline flex items-center gap-1">
              Lihat Semua Berita <ChevronRight class="w-3.5 h-3.5" />
            </RouterLink>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              v-for="rel in otherArticles"
              :key="rel.id"
              @click="router.push('/artikel/' + rel.slug)"
              class="group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div class="aspect-[4/3] rounded-2xl overflow-hidden mb-3 bg-slate-100 border border-slate-100">
                  <img
                    :src="rel.cover_image || rel.cover_image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'"
                    :alt="rel.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <span class="text-[10px] font-bold uppercase text-[#008f8a] tracking-wider block mb-1">
                  {{ rel.category?.name || 'LIPUTAN' }}
                </span>
                <h4 class="text-sm font-bold text-slate-900 group-hover:text-[#008f8a] line-clamp-2 leading-snug transition-colors">
                  {{ rel.title }}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- Article Not Found / Draft State -->
      <div v-else class="max-w-md mx-auto py-24 text-center px-4">
        <h2 class="text-2xl font-bold text-slate-800">
          {{ currentArticle && currentArticle.status === 'draft' ? 'Berita Masih Berstatus Draf' : 'Artikel Tidak Ditemukan' }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-2">
          {{ currentArticle && currentArticle.status === 'draft' ? 'Berita ini belum dipublikasikan oleh administrator.' : 'Artikel ini mungkin telah dihapus atau tidak tersedia.' }}
        </p>
        <RouterLink to="/#berita" class="inline-block mt-6 px-5 py-2.5 rounded-xl bg-[#008f8a] text-white text-xs font-semibold hover:bg-[#007a75] transition-colors">
          Kembali ke Berita
        </RouterLink>
      </div>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>
