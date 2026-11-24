<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
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
import type { Article } from '@/types'

const route = useRoute()
const router = useRouter()
const newsStore = useNewsStore()

const copiedToast = ref(false)
let copyTimer: any = null

// Fallback articles from the Muktamar reference
const fallbackArticles: Record<string, Article> = {
  'profil-ketua-umum-pbnu-kh-abdul-hakim-mahfudz': {
    id: 101,
    title: 'Profil Ketua Umum PBNU KH Abdul Hakim Mahfudz: Meneruskan Warisan Ulama Besar',
    slug: 'profil-ketua-umum-pbnu-kh-abdul-hakim-mahfudz',
    excerpt: 'Usai menyelesaikan pendidikan menengah, Gus Kikin memilih jalur pendidikan yang cukup unik bagi seorang putra kiai pesantren terkemuka.',
    content: `
      <p class="lead text-lg text-slate-700 leading-relaxed font-normal mb-6">
        Usai menyelesaikan pendidikan menengah, Gus Kikin—sapaan akrab KH Abdul Hakim Mahfudz—memilih jalur pendidikan dan pengabdian yang memadukan kedalaman tradisi kepesantrenan dengan kecakapan manajerial modern.
      </p>
      <p class="mb-6 leading-relaxed">
        Lahir dari trah keluarga besar pendiri Nahdlatul Ulama, Gus Kikin merupakan cucu dari pendiri NU, Hadratussyaikh KH M Hasyim Asy'ari. Kiprah kepemimpinannya telah teruji dalam berbagai lini pengabdian, mulai dari pengasuh Pesantren Tebuireng hingga mengemban amanah sebagai Pj Ketua PWNU Jawa Timur.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">
        Komitmen Menjaga Tradisi dan Modernisasi Tata Kelola
      </h3>
      <p class="mb-6 leading-relaxed">
        Dalam visi kepemimpinannya, Gus Kikin menegaskan pentingnya konsolidasi struktural dan kultural. Nahdlatul Ulama di era kedua abad perjalanannya dituntut mampu menjawab tantangan disrupsi teknologi, kemandirian ekonomi umat, dan akselerasi pendidikan santri tanpa mengikis sedikit pun prinsip dasar <em>Ahlussunnah wal Jama'ah</em>.
      </p>
      <blockquote class="p-6 my-8 rounded-2xl bg-slate-50 border-l-4 border-[#008f8a] text-slate-800 italic font-medium">
        "Muktamar ini bukan sekadar pergantian kepemimpinan, melainkan ajang muhasabah akbar untuk mempertegas khidmah nyata jam'iyah bagi bangsa dan peradaban dunia."
      </blockquote>
      <p class="mb-6 leading-relaxed">
        Dukungan luas dari berbagai Pengurus Wilayah dan Cabang se-Indonesia yang mengalir dalam persidangan pleno mencerminkan kepercayaan besar muktamirin terhadap kepemimpinan beliau untuk menakhodai PBNU lima tahun ke depan.
      </p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=80',
    is_featured: true,
    status: 'published',
    view_count: 1420,
    reading_time_minutes: 4,
    created_at: '2026-08-31',
    created_at_formatted: '31 Agustus 2026',
    published_at_human: 'Hari ini',
    category: { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
    author: { id: 1, name: 'Tim Redaksi Muktamar', role: 'Jurnalis Media Center', avatar: null, bio: 'Redaksi peliputan resmi Muktamar ke-35 Nahdlatul Ulama Jombang.' },
    published_at: '2026-08-31',
    published_at_formatted: '31 Agustus 2026',
    reading_time: '4 menit baca'
  },
  'kh-abdul-hakim-mahfudz-resmi-terpilih-jadi-ketua-umum-pbnu': {
    id: 102,
    title: 'KH Abdul Hakim Mahfudz Resmi Terpilih Jadi Ketua Umum PBNU',
    slug: 'kh-abdul-hakim-mahfudz-resmi-terpilih-jadi-ketua-umum-pbnu',
    excerpt: 'KH. Abdul Hakim Mahfudz berhasil memuncaki tabulasi dengan 472 suara usulan, jauh meninggalkan kandidat lainnya dalam sidang pleno pemilihan.',
    content: `
      <p class="lead text-lg text-slate-700 leading-relaxed font-normal mb-6">
        Sidang Pleno Pemilihan Ketua Umum Pengurus Besar Nahdlatul Ulama (PBNU) Masa Khidmah 2026–2031 yang berlangsung di Gedung Utama Stadion Tambakberas Jombang menetapkan KH Abdul Hakim Mahfudz sebagai Ketua Umum terpilih.
      </p>
      <p class="mb-6 leading-relaxed">
        Penetapan ini diambil setelah proses penghitungan suara tahap pertama yang berlangsung transparan dan disaksikan langsung oleh ratusan utusan Pengurus Cabang dan Wilayah dari seluruh nusantara serta perwakilan cabang istimewa luar negeri.
      </p>
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-4">
        Musyawarah Mufakat Bersama Rais Aam Terpilih
      </h3>
      <p class="mb-6 leading-relaxed">
        Sesuai mekanisme Anggaran Dasar dan Anggaran Rumah Tangga (AD/ART) NU, hasil pemilihan ini langsung dimusyawarahkan dan disetujui bersama oleh Rais Aam PBNU terpilih, KH Miftachul Akhyar, menandai dimulainya era kepemimpinan dwitunggal Syuriyah-Tanfidziyah yang harmonis.
      </p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80',
    is_featured: true,
    status: 'published',
    view_count: 3200,
    reading_time_minutes: 3,
    created_at: '2026-08-31',
    created_at_formatted: '31 Agustus 2026',
    published_at_human: 'Hari ini',
    category: { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
    author: { id: 1, name: 'Tim Redaksi Muktamar', role: 'Jurnalis Media Center', avatar: null, bio: 'Redaksi peliputan resmi Muktamar ke-35 Nahdlatul Ulama Jombang.' },
    published_at: '2026-08-31',
    published_at_formatted: '31 Agustus 2026',
    reading_time: '3 menit baca'
  },
  'mengenal-kh-miftachul-akhyar-rais-aam-pbnu-terpilih': {
    id: 103,
    title: 'Mengenal KH Miftachul Akhyar, Rais Aam PBNU Terpilih di Muktamar ke-35 NU',
    slug: 'mengenal-kh-miftachul-akhyar-rais-aam-pbnu-terpilih',
    excerpt: 'KH Miftachul Akhyar bukan hanya sebagai figur struktural dalam tubuh NU. Pada sisi yang lain, beliau adalah pengasuh pesantren yang tekun membina santri.',
    content: `
      <p class="lead text-lg text-slate-700 leading-relaxed font-normal mb-6">
        Keteguhan memegang tradisi keilmuan dan ketawadukan seorang faqih terpancar kuat dari sosok K.H. Miftachul Akhyar, yang kembali dipercaya oleh sembilan kiai khos anggota AHWA untuk mengemban amanah sebagai Rais 'Aam PBNU.
      </p>
      <p class="mb-6 leading-relaxed">
        Pengasuh Pondok Pesantren Miftachus Sunnah Surabaya ini dikenal luas dengan komitmennya menjaga kemurnian fikrah nahdliyyah serta merajut ukhuwah islamiyah dan wathaniyah di tengah keberagaman bangsa.
      </p>
    `,
    cover_image: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1400&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1400&q=80',
    is_featured: false,
    status: 'published',
    view_count: 1850,
    reading_time_minutes: 5,
    created_at: '2026-08-31',
    created_at_formatted: '31 Agustus 2026',
    published_at_human: 'Hari ini',
    category: { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
    author: { id: 1, name: 'Tim Redaksi Muktamar', role: 'Jurnalis Media Center', avatar: null, bio: 'Redaksi peliputan resmi Muktamar ke-35 Nahdlatul Ulama Jombang.' },
    published_at: '2026-08-31',
    published_at_formatted: '31 Agustus 2026',
    reading_time: '5 menit baca'
  }
}

const currentSlug = computed(() => route.params.slug as string)

const isAdmin = computed(() => {
  return typeof window !== 'undefined' && !!localStorage.getItem('admin_token')
})

const currentArticle = computed<Article | null>(() => {
  if (newsStore.selectedArticle && newsStore.selectedArticle.slug === currentSlug.value) {
    return newsStore.selectedArticle
  }
  // Check store articles
  const found = newsStore.articles.find(a => a.slug === currentSlug.value)
  if (found) return found
  // Check fallback
  if (fallbackArticles[currentSlug.value]) {
    return fallbackArticles[currentSlug.value]
  }
  return null
})

const isAccessible = computed(() => {
  if (!currentArticle.value) return false
  // Draft articles are hidden from the public unless logged in as admin
  if (currentArticle.value.status === 'draft' && !isAdmin.value) return false
  return true
})

const otherArticles = computed(() => {
  if (newsStore.articles && newsStore.articles.length > 0) {
    return newsStore.articles.filter(a => a.slug !== currentSlug.value && a.status === 'published').slice(0, 3)
  }
  return Object.values(fallbackArticles).filter(a => a.slug !== currentSlug.value).slice(0, 3)
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
  const title = encodeURIComponent(currentArticle.value?.title || 'Warta Muktamar NU')
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
    } else if (actualSrc.startsWith('foto_') || !actualSrc.includes('/')) {
      if (typeof window !== 'undefined') {
        try {
          const cached = JSON.parse(localStorage.getItem('muktamar_last_inserted_media') || '{}')
          if (cached[actualSrc]) {
            actualSrc = cached[actualSrc]
          }
        } catch {}
      }
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
    document.title = (art.metaTitle || art.title) + ' — Muktamar NU'
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

      <!-- Article Header & Body Container -->
      <article v-if="currentArticle && isAccessible" class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
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
            {{ currentArticle.published_at_formatted || '31 Agustus 2026' }}
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
            {{ currentArticle.author?.name?.charAt(0) || 'A' }}
          </div>
          <div>
            <span class="block text-xs sm:text-sm font-bold text-slate-900">
              {{ currentArticle.author?.name || 'Admin Redaksi' }}
            </span>
            <span class="block text-[11px] text-slate-500 font-normal">
              {{ currentArticle.author?.role || 'Redaktur' }}
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
            <span class="text-xs font-bold uppercase text-slate-400 mr-2 flex items-center gap-1">
              <Tag class="w-3.5 h-3.5" />
              <span>Tag Terkait:</span>
            </span>
            <span
              v-for="t in parsedTags"
              :key="t"
              class="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 text-xs font-medium transition-colors"
            >
              #{{ t }}
            </span>
          </div>
        </div>

        <!-- Bottom Share Section (Replaces Author Bio Card) -->
        <div class="mt-10 pt-8 border-t border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#fbfbfa] border border-slate-200/80">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                Bagikan Berita Ini
              </span>
              <p class="text-xs text-slate-500 mt-0.5">
                Sebarkan informasi liputan ini ke rekan dan media sosial Anda.
              </p>
            </div>

            <!-- Share Buttons Group -->
            <div class="flex flex-wrap items-center gap-2">
              <!-- WhatsApp -->
              <a
                :href="shareUrls.whatsapp"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <MessageCircle class="w-4 h-4 fill-white" />
                <span>WhatsApp</span>
              </a>

              <!-- Facebook -->
              <a
                :href="shareUrls.facebook"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <Facebook class="w-4 h-4 fill-white" />
                <span>Facebook</span>
              </a>

              <!-- Twitter / X -->
              <a
                :href="shareUrls.twitter"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black hover:bg-slate-800 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <Twitter class="w-4 h-4 fill-white" />
                <span>X / Twitter</span>
              </a>

              <!-- Telegram -->
              <a
                :href="shareUrls.telegram"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1f8fc4] text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <Send class="w-4 h-4 fill-white" />
                <span>Telegram</span>
              </a>

              <!-- Salin Tautan -->
              <button
                type="button"
                @click="copyLink"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <Check v-if="copiedToast" class="w-4 h-4 text-emerald-600" />
                <Share2 v-else class="w-4 h-4 text-slate-500" />
                <span>{{ copiedToast ? 'Tautan Disalin!' : 'Salin Tautan' }}</span>
              </button>
            </div>
          </div>
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
