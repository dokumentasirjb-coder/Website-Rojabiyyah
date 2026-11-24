<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import ImageUploadInput from '@/components/ImageUploadInput.vue'
import { useSettingsStore, DEFAULT_SCHEDULE_DAYS, DEFAULT_GALLERY_ALBUMS, DEFAULT_ABOUT_STRUCTURE_ITEMS, DEFAULT_ABOUT_HISTORY_PARAGRAPHS } from '@/stores/settingsStore'
import { useNewsStore } from '@/stores/newsStore'
import type { GalleryPhoto, GalleryAlbum, GalleryPhotoItem, Article, ScheduleDay, ScheduleItem, AboutStructureItem, AboutParagraphItem } from '@/types'
import { 
  Layers, 
  Newspaper, 
  Calendar, 
  Image as ImageIcon, 
  BookOpen, 
  Sparkles, 
  Settings, 
  Plus, 
  ExternalLink, 
  Save, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  X, 
  ChevronRight,
  Eye,
  EyeOff,
  Folder,
  FolderPlus,
  Upload,
  Loader2,
  Clock,
  MapPin,
  UserCheck,
  CalendarDays,
  Search,
  Filter,
  ArrowLeft,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  Lock,
  Unlock,
  PenLine,
  Link2,
  BookmarkCheck,
  Maximize2,
  Minimize2,
  Send
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const settingsStore = useSettingsStore()
const newsStore = useNewsStore()

const activeTab = ref<'ringkasan' | 'beranda' | 'tentang' | 'agenda' | 'berita' | 'galeri'>('ringkasan')
const showToast = ref(false)
const toastMessage = ref('')

const formSettings = reactive({ ...settingsStore.settings })

// ============================================================
// AGENDA INTERACTIVE MANAGEMENT
// ============================================================
const schedules = ref<ScheduleDay[]>([])
const selectedDayId = ref('rabu')

const isSessionModalOpen = ref(false)
const isEditingSession = ref(false)
const sessionForm = reactive<ScheduleItem>({
  id: '',
  time: '',
  title: '',
  venue: '',
  leader: ''
})

const currentDay = computed(() => {
  return schedules.value.find(d => d.id === selectedDayId.value) || schedules.value[0]
})

function initSchedules() {
  if (formSettings.agenda_schedules_json && formSettings.agenda_schedules_json.length > 0) {
    schedules.value = JSON.parse(JSON.stringify(formSettings.agenda_schedules_json))
  } else {
    schedules.value = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE_DAYS))
  }
  if (schedules.value.length > 0 && !selectedDayId.value) {
    selectedDayId.value = schedules.value[0].id
  }
}

function selectDay(id: string) {
  selectedDayId.value = id
}

function addNewDay() {
  const dayNum = schedules.value.length + 1
  const newId = 'hari-' + Date.now()
  const newDay: ScheduleDay = {
    id: newId,
    dayName: `Hari ${dayNum}`,
    dayDate: `${30 + dayNum} Agustus`,
    fullDate: `${30 + dayNum} Agustus 2026`,
    theme: 'Rangkaian Sidang & Acara Lanjutan',
    items: [
      {
        id: Date.now(),
        time: '08.00 - 12.00',
        title: 'Sesi Pembahasan & Diskusi',
        venue: 'Aula Muktamar Utama',
        leader: 'Pimpinan Sidang Terkait'
      }
    ]
  }
  schedules.value.push(newDay)
  selectedDayId.value = newId
}

function deleteCurrentDay() {
  if (schedules.value.length <= 1) {
    alert('Minimal harus ada 1 hari agenda.')
    return
  }
  if (confirm(`Hapus jadwal untuk ${currentDay.value?.dayName || 'hari ini'} beserta seluruh kegiatannya?`)) {
    const idx = schedules.value.findIndex(d => d.id === selectedDayId.value)
    if (idx !== -1) {
      schedules.value.splice(idx, 1)
      selectedDayId.value = schedules.value[0].id
    }
  }
}

function openAddSessionModal() {
  isEditingSession.value = false
  sessionForm.id = Date.now()
  sessionForm.time = ''
  sessionForm.title = ''
  sessionForm.venue = ''
  sessionForm.leader = ''
  isSessionModalOpen.value = true
}

function openEditSessionModal(item: ScheduleItem) {
  isEditingSession.value = true
  sessionForm.id = item.id || Date.now()
  sessionForm.time = item.time || ''
  sessionForm.title = item.title || ''
  sessionForm.venue = item.venue || ''
  sessionForm.leader = item.leader || ''
  isSessionModalOpen.value = true
}

function saveSession() {
  if (!sessionForm.time || !sessionForm.title) {
    alert('Waktu dan Judul Kegiatan wajib diisi.')
    return
  }

  if (!currentDay.value) return

  if (isEditingSession.value) {
    const idx = currentDay.value.items.findIndex(i => i.id === sessionForm.id)
    if (idx !== -1) {
      currentDay.value.items[idx] = { ...sessionForm }
    }
  } else {
    currentDay.value.items.push({ ...sessionForm, id: Date.now() })
  }

  isSessionModalOpen.value = false
}

function deleteSession(itemIdx: number) {
  if (confirm('Hapus kegiatan ini dari jadwal?')) {
    currentDay.value?.items.splice(itemIdx, 1)
  }
}

async function saveAllAgenda() {
  formSettings.agenda_schedules_json = JSON.parse(JSON.stringify(schedules.value))
  await saveSettings('Agenda')
}

// ============================================================
// TENTANG INTERACTIVE MANAGEMENT
// ============================================================
function initAboutContent() {
  if (!Array.isArray(formSettings.about_structure_items_json) || formSettings.about_structure_items_json.length === 0) {
    formSettings.about_structure_items_json = JSON.parse(JSON.stringify(DEFAULT_ABOUT_STRUCTURE_ITEMS))
  }
  if (!Array.isArray(formSettings.about_history_paragraphs_json) || formSettings.about_history_paragraphs_json.length === 0) {
    formSettings.about_history_paragraphs_json = JSON.parse(JSON.stringify(DEFAULT_ABOUT_HISTORY_PARAGRAPHS))
  }
}

function addAboutStructureItem() {
  if (!Array.isArray(formSettings.about_structure_items_json)) {
    formSettings.about_structure_items_json = []
  }
  formSettings.about_structure_items_json.push({
    id: 'struct-' + Date.now(),
    title: '',
    subtitle: '',
    description: ''
  })
}

function removeAboutStructureItem(index: number) {
  if (formSettings.about_structure_items_json && formSettings.about_structure_items_json.length > 0) {
    formSettings.about_structure_items_json.splice(index, 1)
  }
}

function addAboutHistoryParagraph() {
  if (!Array.isArray(formSettings.about_history_paragraphs_json)) {
    formSettings.about_history_paragraphs_json = []
  }
  formSettings.about_history_paragraphs_json.push({
    id: 'hist-' + Date.now(),
    text: ''
  })
}

function removeAboutHistoryParagraph(index: number) {
  if (formSettings.about_history_paragraphs_json && formSettings.about_history_paragraphs_json.length > 0) {
    formSettings.about_history_paragraphs_json.splice(index, 1)
  }
}

// ============================================================
// NEWS MANAGEMENT STATE & METHODS (Matching Uploaded Screenshots)
// ============================================================
const newsMode = ref<'list' | 'form'>('list')
const isEditingArticle = ref(false)
const newsSearch = ref('')
const newsStatusFilter = ref('all')
const newsCategoryFilter = ref('all')

const articleForm = reactive({
  id: undefined as number | undefined,
  title: '',
  slug: '',
  isSlugCustom: false,
  authorName: 'Admin Redaksi',
  authorRole: 'Redaktur',
  excerpt: '',
  content: '',
  activeEditorTab: 'write' as 'write' | 'preview',
  categoryName: 'LIPUTAN',
  tags: '',
  metaTitle: '',
  metaDescription: '',
  cover_image: '',
  mediaMap: {} as Record<string, string>,
  status: 'published' as 'published' | 'draft'
})

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

watch(() => articleForm.title, (newTitle) => {
  if (!articleForm.isSlugCustom && newTitle) {
    articleForm.slug = generateSlug(newTitle)
  }
})

function toggleSlugCustom() {
  articleForm.isSlugCustom = !articleForm.isSlugCustom
  if (!articleForm.isSlugCustom && articleForm.title) {
    articleForm.slug = generateSlug(articleForm.title)
  }
}

const savedCursorPos = ref({ start: 0, end: 0 })
const isContentFullscreen = ref(false)

function toggleContentFullscreen() {
  isContentFullscreen.value = !isContentFullscreen.value
  setTimeout(() => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement | null
    if (textarea) textarea.focus()
  }, 100)
}

const contentStats = computed(() => {
  const text = articleForm.content || ''
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  return { words, chars }
})

function handleGlobalKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isContentFullscreen.value) {
    isContentFullscreen.value = false
  }
}

function trackCursorPos() {
  const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement | null
  if (textarea) {
    savedCursorPos.value = {
      start: textarea.selectionStart ?? (articleForm.content?.length || 0),
      end: textarea.selectionEnd ?? (articleForm.content?.length || 0)
    }
  }
}

function insertFormatting(type: 'bold' | 'italic' | 'h2' | 'h3' | 'quote' | 'list') {
  trackCursorPos()
  const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement | null
  const val = articleForm.content || ''
  let start = savedCursorPos.value.start
  let end = savedCursorPos.value.end
  if (start < 0 || start > val.length) start = val.length
  if (end < start || end > val.length) end = start
  const selected = val.substring(start, end)

  let replacement = ''
  if (type === 'bold') replacement = selected ? `**${selected}**` : '**teks tebal**'
  else if (type === 'italic') replacement = selected ? `*${selected}*` : '*teks miring*'
  else if (type === 'h2') replacement = `\n\n## ${selected || 'Subjudul Berita'}\n`
  else if (type === 'h3') replacement = `\n\n### ${selected || 'Poin Bahasan'}\n`
  else if (type === 'quote') replacement = `\n\n> ${selected || 'Kutipan pernyataan penting...'}\n`
  else if (type === 'list') replacement = selected ? selected.split('\n').map(l => `- ${l}`).join('\n') : '\n- Poin pertama\n- Poin kedua\n'

  articleForm.content = val.substring(0, start) + replacement + val.substring(end)
  savedCursorPos.value = {
    start: start + replacement.length,
    end: start + replacement.length
  }
  setTimeout(() => {
    if (textarea) {
      textarea.focus()
      textarea.setSelectionRange(savedCursorPos.value.start, savedCursorPos.value.end)
    }
  }, 50)
}

const isLinkModalOpen = ref(false)
const linkModalForm = reactive({
  type: 'inline' as 'inline' | 'banner',
  text: '',
  url: '',
  subtitle: ''
})

function openLinkModal() {
  trackCursorPos()
  const val = articleForm.content || ''
  const start = savedCursorPos.value.start
  const end = savedCursorPos.value.end
  if (start >= 0 && end > start && end <= val.length) {
    linkModalForm.text = val.substring(start, end).trim()
  } else {
    linkModalForm.text = ''
  }
  linkModalForm.url = ''
  linkModalForm.subtitle = ''
  linkModalForm.type = 'inline'
  isLinkModalOpen.value = true
}

function selectPresetUrl(url: string, defaultText: string) {
  linkModalForm.url = url
  if (!linkModalForm.text) {
    linkModalForm.text = defaultText
  }
}

function applyLinkModal() {
  if (!linkModalForm.url) {
    alert('Tujuan URL tautan wajib diisi.')
    return
  }
  const text = linkModalForm.text || (linkModalForm.type === 'banner' ? 'BACA JUGA: Informasi Terkait' : 'Lihat Tautan')
  let snippet = ''

  if (linkModalForm.type === 'banner') {
    const subPart = linkModalForm.subtitle ? `|${linkModalForm.subtitle.trim()}` : ''
    snippet = `\n\n[[banner:${linkModalForm.url.trim()}|${text.trim()}${subPart}]]\n\n`
  } else {
    snippet = `[${text.trim()}](${linkModalForm.url.trim()})`
  }

  const val = articleForm.content || ''
  let start = savedCursorPos.value.start
  let end = savedCursorPos.value.end
  if (start < 0 || start > val.length) start = val.length
  if (end < start || end > val.length) end = start

  articleForm.content = val.substring(0, start) + snippet + val.substring(end)
  savedCursorPos.value = {
    start: start + snippet.length,
    end: start + snippet.length
  }
  isLinkModalOpen.value = false

  setTimeout(() => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement | null
    if (textarea) {
      textarea.focus()
      textarea.setSelectionRange(savedCursorPos.value.start, savedCursorPos.value.end)
    }
  }, 50)
}

function formatPreviewContent(raw: string): string {
  if (!raw) return '<p class="text-slate-400 italic">Belum ada isi naskah artikel...</p>'
  let text = raw.trim()

  // Replace Markdown images: ![alt](url)
  text = text.replace(/!\[(.*?)\]\((.*?)\)/g, (_match, alt, src) => {
    let actualSrc = src.trim()
    if (articleForm.mediaMap && articleForm.mediaMap[actualSrc]) {
      actualSrc = articleForm.mediaMap[actualSrc]
    }
    const cap = alt ? `<figcaption class="text-center text-[11px] text-slate-400 py-1.5 px-3 italic border-t border-[#143d30] bg-[#05130f]">📷 ${alt}</figcaption>` : ''
    return `<figure class="my-4 rounded-xl overflow-hidden border border-[#143d30] bg-[#071913] shadow-md"><img src="${actualSrc}" alt="${alt || 'Foto Berita'}" class="w-full object-cover max-h-[350px]" />${cap}</figure>`
  })

  // Replace Banner Links: [[banner:url|title|subtitle]]
  text = text.replace(/\[\[banner:(.*?)\|(.*?)(?:\|(.*?))?\]\]/g, (_match, url, title, subtitle) => {
    const sub = subtitle ? `<p class="text-xs text-slate-400 mt-1">${subtitle.trim()}</p>` : ''
    return `<div class="banner-link-card my-5 p-4 rounded-xl bg-gradient-to-r from-[#0d261e] to-[#071913] border-2 border-emerald-500/30"><div class="flex items-center gap-1.5 mb-1.5"><span class="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider">BACA JUGA / TAUTAN TERKAIT</span></div><a href="${url.trim()}" target="_blank" class="block group"><h4 class="text-sm font-bold text-white group-hover:text-emerald-400 flex items-center justify-between gap-2"><span>${title.trim()}</span><span class="text-xs text-emerald-400">&rarr;</span></h4>${sub}</a></div>`
  })

  // Replace standard Markdown links: [text](url)
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, (_match, linkText, url) => {
    return `<a href="${url.trim()}" target="_blank" class="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2">${linkText}</a>`
  })

  // Replace headings
  text = text.replace(/^### (.*$)/gim, '<h3 class="text-base sm:text-lg font-bold text-emerald-400 mt-6 mb-2 tracking-tight">$1</h3>')
  text = text.replace(/^## (.*$)/gim, '<h2 class="text-lg sm:text-xl font-bold text-white mt-6 mb-3 tracking-tight">$1</h2>')
  text = text.replace(/^# (.*$)/gim, '<h2 class="text-lg sm:text-xl font-bold text-white mt-6 mb-3 tracking-tight">$1</h2>')

  // Replace blockquote
  text = text.replace(/^\> (.*$)/gim, '<blockquote class="p-4 my-4 rounded-xl bg-[#071913] border-l-4 border-emerald-500 text-slate-200 italic font-medium leading-relaxed">$1</blockquote>')

  // Replace bold & italic
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
  text = text.replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>')

  const blocks = text.split(/\n\s*\n/)
  return blocks.map(block => {
    block = block.trim()
    if (!block) return ''
    if (block.startsWith('<h2') || block.startsWith('<h3') || block.startsWith('<blockquote') || block.startsWith('<figure') || block.startsWith('<div class="banner-link-card')) return block
    return `<p class="mb-4 leading-relaxed text-slate-300 text-xs sm:text-sm">${block.replace(/\n/g, '<br/>')}</p>`
  }).join('\n')
}

const filteredArticles = computed(() => {
  return (newsStore.articles || []).filter(art => {
    // Search filter
    if (newsSearch.value) {
      const q = newsSearch.value.toLowerCase()
      const matchTitle = art.title?.toLowerCase().includes(q)
      const matchExcerpt = art.excerpt?.toLowerCase().includes(q)
      if (!matchTitle && !matchExcerpt) return false
    }
    // Status filter
    if (newsStatusFilter.value !== 'all') {
      if (art.status !== newsStatusFilter.value) return false
    }
    // Category filter
    if (newsCategoryFilter.value !== 'all') {
      const cat = art.category?.name || ''
      if (!cat.toLowerCase().includes(newsCategoryFilter.value.toLowerCase())) return false
    }
    return true
  })
})

function openAddArticle() {
  isEditingArticle.value = false
  articleForm.id = undefined
  articleForm.title = ''
  articleForm.slug = ''
  articleForm.isSlugCustom = false
  articleForm.authorName = 'Admin Redaksi'
  articleForm.authorRole = 'Redaktur'
  articleForm.excerpt = ''
  articleForm.content = ''
  articleForm.mediaMap = {}
  articleForm.activeEditorTab = 'write'
  articleForm.categoryName = 'LIPUTAN'
  articleForm.tags = 'Muktamar, Nahdlatul Ulama'
  articleForm.metaTitle = ''
  articleForm.metaDescription = ''
  articleForm.cover_image = ''
  articleForm.status = 'published'
  newsMode.value = 'form'
}

function openEditArticle(art: Article) {
  isEditingArticle.value = true
  articleForm.id = art.id
  articleForm.title = art.title || ''
  articleForm.slug = art.slug || ''
  articleForm.isSlugCustom = true
  articleForm.authorName = art.author?.name || 'Admin Redaksi'
  articleForm.authorRole = art.author?.role || 'Redaktur'
  articleForm.excerpt = art.excerpt || ''
  articleForm.content = art.content || ''
  articleForm.mediaMap = art.mediaMap ? { ...art.mediaMap } : {}
  articleForm.activeEditorTab = 'write'
  articleForm.categoryName = art.category?.name || 'LIPUTAN'
  articleForm.tags = Array.isArray(art.tags) ? art.tags.join(', ') : (art.tags || 'Muktamar, Nahdlatul Ulama')
  articleForm.metaTitle = art.metaTitle || art.title || ''
  articleForm.metaDescription = art.metaDescription || art.excerpt || ''
  articleForm.cover_image = art.cover_image_url || art.cover_image || ''
  articleForm.status = (art.status as any) || 'published'
  newsMode.value = 'form'
}

function handleSaveArticle(targetStatus?: 'published' | 'draft') {
  if (!articleForm.title || !articleForm.title.trim()) {
    alert('Judul Berita wajib diisi sebelum menyimpan/menerbitkan.')
    const titleInput = document.querySelector('input[placeholder*="judul berita"]') as HTMLInputElement | null
    if (titleInput) titleInput.focus()
    return
  }

  // Jika Ringkasan kosong, buat otomatis dari teks konten naskah
  if (!articleForm.excerpt || !articleForm.excerpt.trim()) {
    if (articleForm.content && articleForm.content.trim()) {
      const clean = articleForm.content
        .replace(/<[^>]*>?/gm, '')
        .replace(/[#*`_>\[\]!]/g, '')
        .replace(/\s+/g, ' ')
        .trim()
      articleForm.excerpt = clean.substring(0, 160) + (clean.length > 160 ? '...' : '')
    }
  }

  // Jika tetap kosong (konten naskah juga belum diisi), gunakan judul berita
  if (!articleForm.excerpt || !articleForm.excerpt.trim()) {
    articleForm.excerpt = articleForm.title.trim()
  }

  // Jika konten naskah kosong, berikan paragraf awal dari ringkasan
  if (!articleForm.content || !articleForm.content.trim()) {
    articleForm.content = `<p>${articleForm.excerpt}</p>`
  }

  // Set status publikasi jika diklik dari tombol spesifik
  if (targetStatus) {
    articleForm.status = targetStatus
  } else if (!articleForm.status) {
    articleForm.status = 'published'
  }

  const finalSlug = (articleForm.slug || generateSlug(articleForm.title)) || `berita-${Date.now()}`
  const finalCover = (articleForm.cover_image && articleForm.cover_image.trim())
    ? articleForm.cover_image.trim()
    : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'

  newsStore.saveArticle({
    id: articleForm.id,
    title: articleForm.title.trim(),
    slug: finalSlug,
    excerpt: articleForm.excerpt.trim(),
    content: articleForm.content,
    cover_image: finalCover,
    cover_image_url: finalCover,
    status: articleForm.status,
    tags: articleForm.tags,
    metaTitle: articleForm.metaTitle,
    metaDescription: articleForm.metaDescription,
    mediaMap: { ...articleForm.mediaMap },
    author: {
      id: 1,
      name: articleForm.authorName || 'Admin Redaksi',
      role: articleForm.authorRole || 'Redaktur',
      avatar: null,
      bio: null
    },
    category: {
      id: 1,
      name: (articleForm.categoryName || 'LIPUTAN').toUpperCase(),
      slug: (articleForm.categoryName || 'liputan').toLowerCase(),
      description: null,
      color: '#008f8a',
      icon: null,
      sort_order: 1,
      is_active: true
    }
  })

  isContentFullscreen.value = false
  newsMode.value = 'list'
  toastMessage.value = articleForm.status === 'published'
    ? 'Berita berhasil diterbitkan ke publik!'
    : 'Berita berhasil disimpan sebagai draf!'
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3500)
}

const isImageModalOpen = ref(false)
const imageModalForm = reactive({
  caption: 'Dokumentasi Acara',
  base64: '',
  previewUrl: '',
  fileName: '',
  fileSize: ''
})

function handleInsertArticleImage(e: Event) {
  trackCursorPos()
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')

  const reader = new FileReader()
  reader.onload = (loadEvent) => {
    const rawResult = loadEvent.target?.result as string
    if (!rawResult) return

    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        const MAX_WIDTH = 1200
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width)
          width = MAX_WIDTH
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85)

          imageModalForm.base64 = compressedBase64
          imageModalForm.previewUrl = compressedBase64
          imageModalForm.caption = cleanName || 'Dokumentasi Acara'
          imageModalForm.fileName = file.name
          imageModalForm.fileSize = `${Math.round(file.size / 1024)} KB`
          isImageModalOpen.value = true
          return
        }
      } catch (err) {
        console.warn('Canvas compression fallback to raw:', err)
      }

      imageModalForm.base64 = rawResult
      imageModalForm.previewUrl = rawResult
      imageModalForm.caption = cleanName || 'Dokumentasi Acara'
      imageModalForm.fileName = file.name
      imageModalForm.fileSize = `${Math.round(file.size / 1024)} KB`
      isImageModalOpen.value = true
    }

    img.onerror = () => {
      imageModalForm.base64 = rawResult
      imageModalForm.previewUrl = rawResult
      imageModalForm.caption = cleanName || 'Dokumentasi Acara'
      imageModalForm.fileName = file.name
      imageModalForm.fileSize = `${Math.round(file.size / 1024)} KB`
      isImageModalOpen.value = true
    }

    img.src = rawResult
  }

  reader.onerror = () => {
    alert('Gagal membaca file gambar dari komputer.')
  }

  reader.readAsDataURL(file)
  target.value = ''
}

function applyImageModal() {
  if (!imageModalForm.base64) {
    isImageModalOpen.value = false
    return
  }

  if (!articleForm.mediaMap) articleForm.mediaMap = {}
  const count = Object.keys(articleForm.mediaMap).length + 1
  const photoKey = `foto_${count}`
  articleForm.mediaMap[photoKey] = imageModalForm.base64

  const captionText = imageModalForm.caption.trim() || 'Dokumentasi Acara'
  const snippet = `\n\n![${captionText}](${photoKey})\n\n`

  const val = articleForm.content || ''
  let start = savedCursorPos.value.start
  let end = savedCursorPos.value.end
  if (start < 0 || start > val.length) start = val.length
  if (end < start || end > val.length) end = start

  articleForm.content = val.substring(0, start) + snippet + val.substring(end)
  savedCursorPos.value = {
    start: start + snippet.length,
    end: start + snippet.length
  }
  isImageModalOpen.value = false

  setTimeout(() => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement | null
    if (textarea) {
      textarea.focus()
      textarea.setSelectionRange(savedCursorPos.value.start, savedCursorPos.value.end)
    }
  }, 50)
}

function handleDeleteArticle(art: Article) {
  if (confirm(`Hapus artikel "${art.title}"?`)) {
    newsStore.deleteArticle(art.id)
    toastMessage.value = 'Berita berhasil dihapus!'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

function handleClearAllArticles() {
  if (confirm('Hapus seluruh warta berita? Halaman berita publik akan dikosongkan.')) {
    newsStore.clearAllArticles()
    toastMessage.value = 'Seluruh berita berhasil dikosongkan!'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

function switchTab(tab: 'ringkasan' | 'beranda' | 'tentang' | 'agenda' | 'berita' | 'galeri') {
  activeTab.value = tab
  if (tab === 'berita') {
    newsMode.value = 'list'
  }
  router.replace({ query: { ...route.query, tab } })
}

// ============================================================
// GALLERY ALBUMS STATE & METHODS (Matching User Screenshots 1, 2, 3)
// ============================================================
const galleryMode = ref<'albums' | 'album-form' | 'album-photos'>('albums')
const albumSearch = ref('')
const albumStatusFilter = ref('all')
const isHeaderSettingsOpen = ref(false)

const isEditingAlbum = ref(false)
const albumForm = reactive<GalleryAlbum>({
  id: '',
  title: '',
  slug: '',
  description: '',
  cover_image: '',
  sort_order: 0,
  status: 'published',
  photos: []
})

// Current selected album when managing photos
const selectedAlbumId = ref<string | number>('album-1')
const selectedAlbum = computed<GalleryAlbum | undefined>(() => {
  const albums = settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS
  return albums.find(a => a.id === selectedAlbumId.value)
})

// Filtered albums list for Screenshot 1 table
const filteredAlbums = computed(() => {
  const albums = settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS
  return albums.filter(alb => {
    if (albumSearch.value) {
      const q = albumSearch.value.toLowerCase()
      if (!alb.title.toLowerCase().includes(q) && !(alb.description || '').toLowerCase().includes(q)) {
        return false
      }
    }
    if (albumStatusFilter.value !== 'all') {
      if (alb.status !== albumStatusFilter.value) return false
    }
    return true
  }).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
})

// Auto-slug for album
watch(() => albumForm.title, (newTitle) => {
  if (!isEditingAlbum.value && newTitle) {
    albumForm.slug = generateSlug(newTitle)
  }
})

function openAddAlbum() {
  isEditingAlbum.value = false
  albumForm.id = `album-${Date.now()}`
  albumForm.title = ''
  albumForm.slug = ''
  albumForm.description = ''
  albumForm.cover_image = ''
  albumForm.sort_order = (settingsStore.settings.gallery_albums_json || []).length
  albumForm.status = 'published'
  albumForm.photos = []
  galleryMode.value = 'album-form'
}

function openEditAlbum(album: GalleryAlbum) {
  isEditingAlbum.value = true
  albumForm.id = album.id
  albumForm.title = album.title
  albumForm.slug = album.slug
  albumForm.description = album.description || ''
  albumForm.cover_image = album.cover_image || ''
  albumForm.sort_order = album.sort_order || 0
  albumForm.status = album.status || 'published'
  albumForm.photos = album.photos ? [...album.photos] : []
  galleryMode.value = 'album-form'
}

async function saveAlbum() {
  if (!albumForm.title) {
    alert('Judul Album wajib diisi.')
    return
  }
  const currentAlbums = [...(settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS)]
  const slug = albumForm.slug || generateSlug(albumForm.title) || `album-${Date.now()}`

  if (isEditingAlbum.value) {
    const idx = currentAlbums.findIndex(a => a.id === albumForm.id)
    if (idx !== -1) {
      currentAlbums[idx] = {
        ...currentAlbums[idx],
        title: albumForm.title,
        slug,
        description: albumForm.description,
        cover_image: albumForm.cover_image,
        sort_order: Number(albumForm.sort_order) || 0,
        status: albumForm.status
      }
    }
  } else {
    currentAlbums.push({
      id: albumForm.id || `album-${Date.now()}`,
      title: albumForm.title,
      slug,
      description: albumForm.description,
      cover_image: albumForm.cover_image,
      sort_order: Number(albumForm.sort_order) || 0,
      status: albumForm.status,
      photos: []
    })
  }

  await settingsStore.updateSettings({ gallery_albums_json: currentAlbums })
  galleryMode.value = 'albums'
  toastMessage.value = isEditingAlbum.value ? 'Album berhasil diperbarui!' : 'Album baru berhasil dibuat!'
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

async function toggleAlbumStatus(album: GalleryAlbum) {
  const currentAlbums = [...(settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS)]
  const idx = currentAlbums.findIndex(a => a.id === album.id)
  if (idx !== -1) {
    currentAlbums[idx].status = currentAlbums[idx].status === 'published' ? 'draft' : 'published'
    await settingsStore.updateSettings({ gallery_albums_json: currentAlbums })
    toastMessage.value = `Status album diubah menjadi ${currentAlbums[idx].status === 'published' ? 'Terbit' : 'Draf'}`
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

async function deleteAlbum(album: GalleryAlbum) {
  if (confirm(`Hapus album "${album.title}" beserta seluruh fotonya?`)) {
    const currentAlbums = [...(settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS)]
    const updated = currentAlbums.filter(a => a.id !== album.id)
    await settingsStore.updateSettings({ gallery_albums_json: updated })
    toastMessage.value = 'Album berhasil dihapus!'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

// -------------------------------------------------------------
// Photo Upload and Management Inside Album (Screenshot 2)
// -------------------------------------------------------------
function openManageAlbumPhotos(album: GalleryAlbum) {
  selectedAlbumId.value = album.id
  galleryMode.value = 'album-photos'
}

const photoUploadForm = reactive({
  caption: '',
  status: 'published' as 'published' | 'draft'
})
const photoUploadFiles = ref<File[]>([])
const isUploadingPhotos = ref(false)

function onPhotoFilesSelected(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    photoUploadFiles.value = Array.from(target.files)
  }
}

async function handleUploadPhotosToAlbum() {
  if (!photoUploadFiles.value.length) {
    alert('Pilih minimal 1 file foto dari komputer.')
    return
  }
  if (!selectedAlbum.value) return

  isUploadingPhotos.value = true
  const currentAlbums = [...(settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS)]
  const albumIdx = currentAlbums.findIndex(a => a.id === selectedAlbumId.value)
  if (albumIdx === -1) {
    isUploadingPhotos.value = false
    return
  }

  const newPhotos: GalleryPhotoItem[] = []
  const currentDateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  for (let i = 0; i < photoUploadFiles.value.length; i++) {
    const file = photoUploadFiles.value[i]
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')

    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = (loadEvt) => {
        const raw = loadEvt.target?.result as string
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          const MAX_WIDTH = 1400
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width)
            width = MAX_WIDTH
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL('image/jpeg', 0.85))
          } else {
            resolve(raw)
          }
        }
        img.src = raw
      }
      reader.readAsDataURL(file)
    })

    newPhotos.push({
      id: `photo-${Date.now()}-${i}`,
      albumId: selectedAlbumId.value,
      title: cleanName,
      description: photoUploadForm.caption || cleanName,
      src: base64,
      sort_order: (currentAlbums[albumIdx].photos?.length || 0) + i + 1,
      status: photoUploadForm.status,
      created_at: currentDateStr
    })
  }

  if (!currentAlbums[albumIdx].photos) {
    currentAlbums[albumIdx].photos = []
  }
  currentAlbums[albumIdx].photos.unshift(...newPhotos)

  if (!currentAlbums[albumIdx].cover_image && newPhotos.length > 0) {
    currentAlbums[albumIdx].cover_image = newPhotos[0].src
  }

  await settingsStore.updateSettings({ gallery_albums_json: currentAlbums })
  photoUploadFiles.value = []
  photoUploadForm.caption = ''
  isUploadingPhotos.value = false
  toastMessage.value = `${newPhotos.length} foto berhasil diunggah ke album!`
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

async function savePhotoItem(photo: GalleryPhotoItem) {
  const currentAlbums = [...(settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS)]
  let found = false
  for (const alb of currentAlbums) {
    const idx = (alb.photos || []).findIndex(p => p.id === photo.id)
    if (idx !== -1) {
      if (alb.id === photo.albumId) {
        alb.photos[idx] = { ...photo }
      } else {
        const [movedPhoto] = alb.photos.splice(idx, 1)
        const targetAlb = currentAlbums.find(a => a.id === photo.albumId)
        if (targetAlb) {
          if (!targetAlb.photos) targetAlb.photos = []
          targetAlb.photos.unshift({ ...movedPhoto, ...photo })
        }
      }
      found = true
      break
    }
  }

  if (found) {
    await settingsStore.updateSettings({ gallery_albums_json: currentAlbums })
    toastMessage.value = 'Perubahan foto berhasil disimpan!'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

async function togglePhotoVisibility(photo: GalleryPhotoItem) {
  photo.status = photo.status === 'published' ? 'draft' : 'published'
  await savePhotoItem(photo)
}

async function deletePhotoItem(photo: GalleryPhotoItem) {
  if (confirm(`Hapus foto "${photo.title}" dari album?`)) {
    const currentAlbums = [...(settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS)]
    for (const alb of currentAlbums) {
      const idx = (alb.photos || []).findIndex(p => p.id === photo.id)
      if (idx !== -1) {
        alb.photos.splice(idx, 1)
        break
      }
    }
    await settingsStore.updateSettings({ gallery_albums_json: currentAlbums })
    toastMessage.value = 'Foto berhasil dihapus!'
    showToast.value = true
    setTimeout(() => { showToast.value = false }, 3000)
  }
}

onMounted(async () => {
  await Promise.all([
    settingsStore.fetchSettings(),
    newsStore.fetchArticles()
  ])
  Object.assign(formSettings, settingsStore.settings)
  initSchedules()
  initAboutContent()

  if (route.query.tab) {
    const validTabs = ['ringkasan', 'beranda', 'tentang', 'agenda', 'berita', 'galeri']
    if (validTabs.includes(route.query.tab as string)) {
      activeTab.value = route.query.tab as any
    }
  }
  if (route.query.action === 'create' && activeTab.value === 'berita') {
    openAddArticle()
  }
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

watch(() => route.query.tab, (newTab) => {
  if (newTab) {
    const validTabs = ['ringkasan', 'beranda', 'tentang', 'agenda', 'berita', 'galeri']
    if (validTabs.includes(newTab as string)) {
      activeTab.value = newTab as any
      if (activeTab.value === 'berita') {
        newsMode.value = 'list'
      }
      if (activeTab.value === 'galeri') {
        galleryMode.value = 'albums'
      }
    }
  }
})

const totalArticles = computed(() => {
  return newsStore.articles !== undefined && newsStore.articles !== null ? newsStore.articles.length : 0
})

const totalGallery = computed(() => {
  const albums = settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS
  let total = 0
  for (const a of albums) {
    total += (a.photos || []).length
  }
  return total
})

const totalAlbums = computed(() => {
  const albums = settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS
  return albums.length
})

async function saveSettings(tabLabel: string) {
  const res = await settingsStore.updateSettings(formSettings)
  if (res.success) {
    toastMessage.value = `Konten ${tabLabel} berhasil diperbarui!`
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
      <!-- Breadcrumbs & Header Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-[11px] text-slate-400 font-medium mb-1">
            <span>Dashboard</span>
            <span class="text-slate-600">/</span>
            <span class="text-emerald-400">Konten Situs</span>
            <template v-if="activeTab === 'berita'">
              <span class="text-slate-600">/</span>
              <span class="text-emerald-400">Berita</span>
              <span v-if="newsMode === 'form'" class="text-slate-600">/</span>
              <span v-if="newsMode === 'form'" class="text-white">{{ isEditingArticle ? 'Ubah' : 'Tulis' }}</span>
            </template>
          </div>

          <h1 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {{ activeTab === 'berita' && newsMode === 'form' ? (isEditingArticle ? 'Ubah Berita' : 'Tulis Berita') : 'Konten Situs' }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            {{ activeTab === 'berita' && newsMode === 'form' ? 'Isi artikel memakai format Markdown atau HTML. Mentah tidak dirender di situs publik.' : 'Kelola seluruh isi situs publik dari satu tempat.' }}
          </p>
        </div>

        <!-- Top Right Action Button -->
        <div class="flex items-center gap-3">
          <button
            v-if="activeTab === 'berita' && newsMode === 'list'"
            type="button"
            @click="openAddArticle"
            class="px-4 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            <span>Tulis Berita</span>
          </button>
          <button
            v-else-if="activeTab !== 'berita'"
            type="button"
            @click="activeTab = 'berita'; openAddArticle()"
            class="px-4 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus class="w-4 h-4" />
            <span>Tulis Berita</span>
          </button>
        </div>
      </div>

      <!-- Toast Notification -->
      <div
        v-if="showToast"
        class="p-4 rounded-2xl bg-[#0d3326] border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in"
      >
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
          <span class="font-medium">{{ toastMessage }}</span>
        </div>
        <a
          href="/"
          target="_blank"
          class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
        >
          Lihat Situs <ExternalLink class="w-3 h-3" />
        </a>
      </div>

      <!-- Navigation Pill Tabs (Only visible when not in sub-form) -->
      <div v-show="!(activeTab === 'berita' && newsMode === 'form')" class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar text-xs">
        <button
          type="button"
          @click="switchTab('ringkasan')"
          class="px-4 py-2 rounded-lg font-semibold transition-all shrink-0 cursor-pointer"
          :class="[activeTab === 'ringkasan' ? 'bg-[#008f8a] text-white shadow-sm' : 'bg-[#0d261e] text-slate-300 hover:bg-[#13352a]']"
        >
          Ringkasan
        </button>

        <button
          type="button"
          @click="switchTab('berita')"
          class="px-4 py-2 rounded-lg font-semibold transition-all shrink-0 cursor-pointer"
          :class="[activeTab === 'berita' ? 'bg-[#008f8a] text-white shadow-sm' : 'bg-[#0d261e] text-slate-300 hover:bg-[#13352a]']"
        >
          Berita
        </button>

        <button
          type="button"
          @click="switchTab('agenda')"
          class="px-4 py-2 rounded-lg font-semibold transition-all shrink-0 cursor-pointer"
          :class="[activeTab === 'agenda' ? 'bg-[#008f8a] text-white shadow-sm' : 'bg-[#0d261e] text-slate-300 hover:bg-[#13352a]']"
        >
          Agenda
        </button>

        <button
          type="button"
          @click="switchTab('galeri')"
          class="px-4 py-2 rounded-lg font-semibold transition-all shrink-0 cursor-pointer"
          :class="[activeTab === 'galeri' ? 'bg-[#008f8a] text-white shadow-sm' : 'bg-[#0d261e] text-slate-300 hover:bg-[#13352a]']"
        >
          Galeri
        </button>

        <button
          type="button"
          @click="switchTab('tentang')"
          class="px-4 py-2 rounded-lg font-semibold transition-all shrink-0 cursor-pointer"
          :class="[activeTab === 'tentang' ? 'bg-[#008f8a] text-white shadow-sm' : 'bg-[#0d261e] text-slate-300 hover:bg-[#13352a]']"
        >
          Tentang
        </button>

        <button
          type="button"
          @click="switchTab('beranda')"
          class="px-4 py-2 rounded-lg font-semibold transition-all shrink-0 cursor-pointer"
          :class="[activeTab === 'beranda' ? 'bg-[#008f8a] text-white shadow-sm' : 'bg-[#0d261e] text-slate-300 hover:bg-[#13352a]']"
        >
          Beranda
        </button>
      </div>

      <!-- ============================================================ -->
      <!-- TAB 1: RINGKASAN (3-COL CARDS GRID MATCHING USER SCREENSHOT) -->
      <!-- ============================================================ -->
      <div v-show="activeTab === 'ringkasan'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Card 1: Berita -->
        <div class="bg-[#0b211a] border border-[#143d30] rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Newspaper class="w-5 h-5" />
              </div>
              <span class="text-2xl font-bold text-white font-mono">{{ totalArticles }}</span>
            </div>
            <h3 class="text-base font-bold text-white mb-1">Berita & Liputan</h3>
            <p class="text-xs text-slate-400 font-normal leading-relaxed">
              Artikel dan warta terkini seputar kegiatan muktamar.
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-[#143d30]">
            <button
              type="button"
              @click="switchTab('berita')"
              class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola Berita</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Card 2: Halaman Tentang -->
        <div class="bg-[#0b211a] border border-[#143d30] rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <BookOpen class="w-5 h-5" />
              </div>
              <span class="text-2xl font-bold text-white font-mono">1</span>
            </div>
            <h3 class="text-base font-bold text-white mb-1">Halaman Tentang</h3>
            <p class="text-xs text-slate-400 font-normal leading-relaxed">
              Profil forum muktamar, makna permusyawaratan, dan tema.
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-[#143d30]">
            <button
              type="button"
              @click="switchTab('tentang')"
              class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola Tentang</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Card 3: Galeri Dokumentasi -->
        <div class="bg-[#0b211a] border border-[#143d30] rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ImageIcon class="w-5 h-5" />
              </div>
              <span class="text-2xl font-bold text-white font-mono">{{ totalGallery }}</span>
            </div>
            <h3 class="text-base font-bold text-white mb-1">Galeri Dokumentasi</h3>
            <p class="text-xs text-slate-400 font-normal leading-relaxed">
              Album foto dan dokumentasi visual peristiwa bersejarah.
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-[#143d30]">
            <button
              type="button"
              @click="switchTab('galeri')"
              class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola Galeri</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Card 4: Agenda Permusyawaratan -->
        <div class="bg-[#0b211a] border border-[#143d30] rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Calendar class="w-5 h-5" />
              </div>
              <span class="text-2xl font-bold text-white font-mono">{{ schedules.length || 5 }} Hari</span>
            </div>
            <h3 class="text-base font-bold text-white mb-1">Agenda Sidang & Acara</h3>
            <p class="text-xs text-slate-400 font-normal leading-relaxed">
              Jadwal harian muktamar, pleno, dan sesi kegiatan.
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-[#143d30]">
            <button
              type="button"
              @click="switchTab('agenda')"
              class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola Agenda</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Card 5: Beranda & Slidebar -->
        <div class="bg-[#0b211a] border border-[#143d30] rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Sparkles class="w-5 h-5" />
              </div>
              <span class="text-2xl font-bold text-white font-mono">1</span>
            </div>
            <h3 class="text-base font-bold text-white mb-1">Headline & Beranda</h3>
            <p class="text-xs text-slate-400 font-normal leading-relaxed">
              Semboyan utama, tanggal, lokasi, dan latar belakang depan.
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-[#143d30]">
            <button
              type="button"
              @click="switchTab('beranda')"
              class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Kelola Beranda</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Card 6: Pengaturan & Tampilan -->
        <div class="bg-[#0b211a] border border-[#143d30] rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-600/40 transition-colors">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Settings class="w-5 h-5" />
              </div>
              <span class="text-2xl font-bold text-white font-mono">5</span>
            </div>
            <h3 class="text-base font-bold text-white mb-1">Pengaturan & Icon</h3>
            <p class="text-xs text-slate-400 font-normal leading-relaxed">
              Favicon tab browser, logo website, footer, dan medsos.
            </p>
          </div>
          <div class="pt-4 mt-4 border-t border-[#143d30]">
            <RouterLink
              to="/admin/settings"
              class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Buka Pengaturan Lengkap</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- TAB 2: KELOLA BERANDA -->
      <!-- ============================================================ -->
      <div v-show="activeTab === 'beranda'" class="bg-[#0b211a] border border-[#143d30] rounded-3xl p-6 sm:p-8 space-y-6">
        <div class="flex items-center justify-between border-b border-[#143d30] pb-4">
          <div>
            <h2 class="text-lg font-bold text-white">Kelola Konten Beranda & Banner</h2>
            <p class="text-xs text-slate-400 mt-0.5">Ubah teks headline utama, semboyan, tanggal, lokasi, dan latar beranda.</p>
          </div>
          <button
            type="button"
            @click="saveSettings('Beranda')"
            class="px-5 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Save class="w-4 h-4" />
            <span>Simpan Beranda</span>
          </button>
        </div>

        <div class="space-y-5">
          <!-- Upload Banner Beranda dari Komputer -->
          <ImageUploadInput
            v-model="formSettings.banner_beranda_url"
            label="Foto Latar / Hero Beranda (Unggah dari Komputer)"
            description="Pilih foto langsung dari komputer Anda untuk latar belakang beranda utama."
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Tanggal Pelaksanaan</label>
              <input
                v-model="formSettings.topbar_date"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Lokasi Pelaksanaan</label>
              <input
                v-model="formSettings.topbar_location"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Judul Baris 1 (Hitam)</label>
              <input
                v-model="formSettings.hero_headline_1"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Judul Baris 2 (Hijau)</label>
              <input
                v-model="formSettings.hero_headline_2"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Judul Baris 3 (Emas)</label>
              <input
                v-model="formSettings.hero_headline_3"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Tagline / Semboyan Resmi</label>
            <textarea
              v-model="formSettings.hero_tagline"
              rows="2"
              class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- TAB 3: KELOLA TENTANG (Layout Lengkap Editorial Majalah) -->
      <!-- ============================================================ -->
      <div v-show="activeTab === 'tentang'" class="bg-[#0b211a] border border-[#143d30] rounded-3xl p-6 sm:p-8 space-y-8">
        <div class="flex items-center justify-between border-b border-[#143d30] pb-4">
          <div>
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen class="w-5 h-5 text-emerald-400" />
              <span>Kelola Isi Halaman Tentang</span>
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">Kelola seluruh teks judul, foto banner, baris terstruktur bergaris, ulasan sejarah, dan kutipan tema resmi.</p>
          </div>
          <button
            type="button"
            @click="saveSettings('Tentang')"
            class="px-5 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Save class="w-4 h-4" />
            <span>Simpan Tentang</span>
          </button>
        </div>

        <div class="space-y-6">
          <!-- Upload Banner Tentang dari Komputer -->
          <div class="p-4 sm:p-5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-2">
            <ImageUploadInput
              v-model="formSettings.banner_tentang_url"
              label="Foto Banner Halaman Tentang (Unggah dari Komputer)"
              description="Pilih lukisan/foto langsung dari komputer Anda untuk banner hero atas dengan efek gradasi memudar."
            />
          </div>

          <!-- BAGIAN 1: HEADER ATAS & PENGANTAR -->
          <div class="p-5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-4">
            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen class="w-3.5 h-3.5" />
              <span>1. Header Atas & Pengantar</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Label Kategori Atas
                </label>
                <input
                  v-model="formSettings.about_tag"
                  type="text"
                  placeholder="TENTANG MUKTAMAR"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Judul Utama Halaman
                </label>
                <input
                  v-model="formSettings.about_title"
                  type="text"
                  placeholder="Permusyawaratan akbar para ulama Nusantara"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-white mb-1.5">
                Sub-deskripsi Ringkas Header
              </label>
              <textarea
                v-model="formSettings.about_subtitle"
                rows="2"
                placeholder="Muktamar adalah forum tertinggi dalam Nahdlatul Ulama..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              ></textarea>
            </div>
          </div>

          <!-- BAGIAN 2: BLOK STRUKTUR & POIN TERSTRUKTUR -->
          <div class="p-5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-5">
            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers class="w-3.5 h-3.5" />
              <span>2. Blok Struktur & Poin Terstruktur (Tabel Horisontal)</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Label Kategori Kiri (Overline)
                </label>
                <input
                  v-model="formSettings.about_section_label"
                  type="text"
                  placeholder="APA ITU MUKTAMAR"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Judul Besar Samping Kiri
                </label>
                <input
                  v-model="formSettings.about_section_title"
                  type="text"
                  placeholder="Permusyawaratan tertinggi organisasi NU"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-white mb-1.5">
                Paragraf Pengantar Kanan (Lead)
              </label>
              <textarea
                v-model="formSettings.about_paragraph_1"
                rows="3"
                placeholder="Muktamar merupakan permusyawaratan tertinggi Nahdlatul Ulama yang diselenggarakan setiap lima tahun..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
              ></textarea>
            </div>

            <!-- Poin Terstruktur Baris-per-Baris (Dinamis: Bisa Tambah, Edit, Hapus) -->
            <div class="space-y-4 pt-2">
              <div class="flex items-center justify-between">
                <div>
                  <span class="block text-xs font-bold text-white uppercase tracking-wider">
                    Daftar Poin / Dimensi Terstruktur (Format Baris Bergaris)
                  </span>
                  <span class="text-[11px] text-slate-400">Poin dapat ditambah, diubah isinya, atau dihapus secara bebas.</span>
                </div>
                <button
                  type="button"
                  @click="addAboutStructureItem"
                  class="px-3 py-1.5 rounded-lg bg-[#008f8a]/20 border border-[#008f8a]/40 hover:bg-[#008f8a]/40 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus class="w-3.5 h-3.5" />
                  <span>Tambah Poin</span>
                </button>
              </div>

              <div v-if="!formSettings.about_structure_items_json || formSettings.about_structure_items_json.length === 0" class="p-6 text-center rounded-xl bg-[#04120e] border border-dashed border-[#143d30] text-slate-400 text-xs">
                Belum ada poin terstruktur. Klik tombol "+ Tambah Poin" di atas untuk menambahkan.
              </div>

              <!-- Loop Poin Terstruktur -->
              <div
                v-for="(item, idx) in formSettings.about_structure_items_json"
                :key="item.id || idx"
                class="p-4 rounded-xl bg-[#04120e] border border-[#143d30] space-y-3 relative group"
              >
                <div class="flex items-center justify-between border-b border-[#143d30]/60 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-[#008f8a]/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center border border-[#008f8a]/30">
                      {{ idx + 1 }}
                    </span>
                    <span class="text-xs font-bold text-emerald-400">Poin {{ idx + 1 }}</span>
                  </div>
                  <button
                    type="button"
                    @click="removeAboutStructureItem(idx)"
                    class="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Hapus Poin Ini"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                    <span>Hapus Poin</span>
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">Judul Poin (Warna Tema)</label>
                    <input
                      v-model="item.title"
                      type="text"
                      placeholder="Contoh: Bahtsul Masail Diniyah"
                      class="w-full px-3 py-2 rounded-lg bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">Sub-label / Kategori</label>
                    <input
                      v-model="item.subtitle"
                      type="text"
                      placeholder="Contoh: Waqi'iyyah & Maudhu'iyyah"
                      class="w-full px-3 py-2 rounded-lg bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">Teks Deskripsi / Penjelasan</label>
                  <textarea
                    v-model="item.description"
                    rows="2"
                    placeholder="Tuliskan penjelasan mengenai poin ini..."
                    class="w-full px-3 py-2 rounded-lg bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-400"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- BAGIAN 3: BLOK SEKILAS SEJARAH & VISI KHIDMAH -->
          <div class="p-5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-4">
            <h4 class="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5" />
              <span>3. Blok Sekilas Sejarah & Visi Khidmah</span>
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Label Kategori Kiri (Overline)
                </label>
                <input
                  v-model="formSettings.about_history_label"
                  type="text"
                  placeholder="SEKILAS MUKTAMAR & KHIDMAH"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-white mb-1.5">
                  Judul Besar Samping Kiri
                </label>
                <input
                  v-model="formSettings.about_history_title"
                  type="text"
                  placeholder="Khidmah berkelanjutan untuk umat & bangsa"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            <!-- Daftar Paragraf Naratif Dinamis (Bisa Tambah, Edit, Hapus) -->
            <div class="space-y-4 pt-2">
              <div class="flex items-center justify-between">
                <div>
                  <span class="block text-xs font-bold text-white uppercase tracking-wider">
                    Daftar Paragraf Narasi Sejarah & Khidmah
                  </span>
                  <span class="text-[11px] text-slate-400">Setiap paragraf dapat diedit, ditambah, atau dihapus secara bebas.</span>
                </div>
                <button
                  type="button"
                  @click="addAboutHistoryParagraph"
                  class="px-3 py-1.5 rounded-lg bg-[#008f8a]/20 border border-[#008f8a]/40 hover:bg-[#008f8a]/40 text-emerald-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus class="w-3.5 h-3.5" />
                  <span>Tambah Paragraf</span>
                </button>
              </div>

              <div v-if="!formSettings.about_history_paragraphs_json || formSettings.about_history_paragraphs_json.length === 0" class="p-6 text-center rounded-xl bg-[#04120e] border border-dashed border-[#143d30] text-slate-400 text-xs">
                Belum ada paragraf narasi. Klik tombol "+ Tambah Paragraf" di atas untuk menambahkan.
              </div>

              <!-- Loop Paragraf Narasi -->
              <div
                v-for="(para, idx) in formSettings.about_history_paragraphs_json"
                :key="para.id || idx"
                class="p-4 rounded-xl bg-[#04120e] border border-[#143d30] space-y-2 relative group"
              >
                <div class="flex items-center justify-between border-b border-[#143d30]/60 pb-2">
                  <div class="flex items-center gap-2">
                    <span class="w-5 h-5 rounded-full bg-[#008f8a]/20 text-emerald-400 font-bold text-[11px] flex items-center justify-center border border-[#008f8a]/30">
                      {{ idx + 1 }}
                    </span>
                    <span class="text-xs font-bold text-emerald-400">Paragraf {{ idx + 1 }}</span>
                  </div>
                  <button
                    type="button"
                    @click="removeAboutHistoryParagraph(idx)"
                    class="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Hapus Paragraf Ini"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                    <span>Hapus Paragraf</span>
                  </button>
                </div>
                <div>
                  <textarea
                    v-model="para.text"
                    rows="3"
                    placeholder="Tuliskan narasi paragraf di sini..."
                    class="w-full px-3 py-2 rounded-lg bg-[#071913] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Kotak Kutipan / Highlight Motto -->
            <div class="pt-2 border-t border-[#143d30] space-y-3">
              <span class="block text-xs font-bold text-white uppercase tracking-wider">
                Kotak Kutipan & Tema Resmi
              </span>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">Label Tag Kutipan</label>
                  <input
                    v-model="formSettings.about_quote_label"
                    type="text"
                    placeholder="TEMA RESMI MUKTAMAR KE-35"
                    class="w-full px-3 py-2 rounded-lg bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">Keterangan Tempat & Waktu</label>
                  <input
                    v-model="formSettings.about_quote_location"
                    type="text"
                    placeholder="Pondok Pesantren Bahrul Ulum Tambakberas, Jombang • 27–31 Agustus 2026"
                    class="w-full px-3 py-2 rounded-lg bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-slate-300 mb-1">Teks Kutipan / Motto Utama</label>
                <input
                  v-model="formSettings.about_quote_text"
                  type="text"
                  placeholder="Menjaga Marwah, Memperkaya Khidmah untuk Kemaslahatan Bangsa"
                  class="w-full px-3 py-2 rounded-lg bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          <!-- Tombol Simpan Tab Tentang -->
          <div class="pt-4 border-t border-[#143d30] flex items-center justify-end gap-3">
            <button
              type="button"
              @click="saveSettings('Tentang')"
              class="px-8 py-3 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save class="w-4 h-4" />
              <span>Simpan Konten Halaman Tentang</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- TAB 4: KELOLA AGENDA INTERAKTIF LENGKAP -->
      <!-- ============================================================ -->
      <div v-show="activeTab === 'agenda'" class="bg-[#0b211a] border border-[#143d30] rounded-3xl p-6 sm:p-8 space-y-8">
        <!-- Header & Action -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#143d30] pb-5">
          <div>
            <h2 class="text-lg font-bold text-white flex items-center gap-2">
              <CalendarDays class="w-5 h-5 text-emerald-400" />
              <span>Kelola Jadwal & Agenda Muktamar</span>
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              Edit banner, nama hari, tema, dan tambah sesi kegiatan per jam dengan mudah.
            </p>
          </div>
          <button
            type="button"
            @click="saveAllAgenda"
            class="px-6 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            <Save class="w-4 h-4" />
            <span>Simpan Seluruh Agenda</span>
          </button>
        </div>

        <!-- Banner Upload dari Komputer -->
        <div class="p-5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-4">
          <ImageUploadInput
            v-model="formSettings.banner_agenda_url"
            label="Foto Banner Halaman Agenda (Unggah dari Komputer)"
            description="Pilih foto suasana sidang/arena dari komputer Anda."
          />

          <!-- Judul & Subtitle Header Halaman Agenda -->
          <div class="pt-4 border-t border-[#143d30] space-y-4">
            <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Teks Judul & Deskripsi Header Agenda
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                  Label Kategori Atas
                </label>
                <input
                  v-model="formSettings.agenda_tag"
                  type="text"
                  placeholder="Contoh: JADWAL RESMI"
                  class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                  Judul Utama Halaman Agenda
                </label>
                <input
                  v-model="formSettings.agenda_title"
                  type="text"
                  placeholder="Contoh: Agenda Permusyawaratan"
                  class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                Deskripsi Singkat / Keterangan Jadwal
              </label>
              <textarea
                v-model="formSettings.agenda_subtitle"
                rows="2"
                placeholder="Contoh: Rangkaian sidang dan acara Muktamar ke-35 pada 27–31 Agustus 2026 di Pondok Pesantren Bahrul Ulum Tambakberas, Jombang. Jadwal dapat berubah sewaktu-waktu."
                class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Agenda Days Selector & Add Day -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pilih Hari untuk Diedit
            </span>
            <button
              type="button"
              @click="addNewDay"
              class="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Tambah Hari Baru</span>
            </button>
          </div>

          <!-- Day Tabs -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              v-for="d in schedules"
              :key="d.id"
              type="button"
              @click="selectDay(d.id)"
              class="px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border text-left"
              :class="[
                selectedDayId === d.id
                  ? 'bg-[#008f8a] border-[#008f8a] text-white shadow-sm'
                  : 'bg-[#071913] border-[#143d30] text-slate-300 hover:border-emerald-500/40'
              ]"
            >
              <span class="block leading-tight">{{ d.dayName }}</span>
              <span class="block text-[10px] font-normal opacity-80 mt-0.5">{{ d.dayDate }}</span>
            </button>
          </div>
        </div>

        <!-- Selected Day Info Editor (Form) -->
        <div v-if="currentDay" class="bg-[#071913] border border-[#143d30] rounded-2xl p-5 space-y-4">
          <div class="flex items-center justify-between border-b border-[#143d30] pb-3">
            <span class="text-xs font-bold text-emerald-400">
              Pengaturan Label Hari: {{ currentDay.dayName }}
            </span>
            <button
              type="button"
              @click="deleteCurrentDay"
              class="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 class="w-3.5 h-3.5" />
              <span>Hapus Hari Ini</span>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Nama Hari (Contoh: Kamis)</label>
              <input
                v-model="currentDay.dayName"
                type="text"
                class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Tanggal Tab (Contoh: 27 Agustus)</label>
              <input
                v-model="currentDay.dayDate"
                type="text"
                class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Tanggal Lengkap (Contoh: 27 Agustus 2026)</label>
              <input
                v-model="currentDay.fullDate"
                type="text"
                class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-semibold text-slate-300 mb-1">Tema / Rangkaian Acara Hari Ini</label>
            <input
              v-model="currentDay.theme"
              type="text"
              placeholder="Contoh: Seremonial Pembukaan Muktamar"
              class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <!-- Sessions / Activities List for Current Day -->
        <div v-if="currentDay" class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Daftar Kegiatan: {{ currentDay.dayName }} ({{ currentDay.items.length }} Sesi)
            </span>
            <button
              type="button"
              @click="openAddSessionModal"
              class="px-4 py-2 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Tambah Sesi Kegiatan</span>
            </button>
          </div>

          <!-- Empty State -->
          <div
            v-if="currentDay.items.length === 0"
            class="p-8 rounded-2xl bg-[#071913] border border-dashed border-[#143d30] text-center space-y-2"
          >
            <p class="text-xs text-slate-400">Belum ada kegiatan untuk hari ini.</p>
            <button
              type="button"
              @click="openAddSessionModal"
              class="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold cursor-pointer"
            >
              + Tambah Kegiatan Pertama
            </button>
          </div>

          <!-- Session Items Cards -->
          <div v-else class="space-y-3">
            <div
              v-for="(item, idx) in currentDay.items"
              :key="item.id || idx"
              class="p-4 rounded-2xl bg-[#071913] border border-[#143d30] hover:border-emerald-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div class="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                <!-- Time Badge -->
                <div class="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 font-mono font-bold text-xs shrink-0 flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5" />
                  <span>{{ item.time }}</span>
                </div>

                <!-- Info -->
                <div class="min-w-0 flex-1">
                  <h4 class="text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {{ item.title }}
                  </h4>
                  <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 mt-1">
                    <span v-if="item.venue" class="flex items-center gap-1">
                      <MapPin class="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{{ item.venue }}</span>
                    </span>
                    <span v-if="item.leader" class="flex items-center gap-1">
                      <UserCheck class="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{{ item.leader }}</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#143d30]">
                <button
                  type="button"
                  @click="openEditSessionModal(item)"
                  class="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 class="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  @click="deleteSession(idx)"
                  class="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Save Bar -->
        <div class="pt-4 border-t border-[#143d30] flex items-center justify-between">
          <span class="text-xs text-slate-400">
            Perubahan jadwal akan langsung aktif di halaman publik <code>/agenda</code> setelah disimpan.
          </span>
          <button
            type="button"
            @click="saveAllAgenda"
            class="px-6 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Save class="w-4 h-4" />
            <span>Simpan Seluruh Agenda</span>
          </button>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- TAB 5: KELOLA BERITA (MATCHING USER SCREENSHOTS 1, 2, 3) -->
      <!-- ============================================================ -->
      <div v-show="activeTab === 'berita'" class="space-y-6">

        <!-- ------------------------------------------------------------ -->
        <!-- VIEW 1: FORM TULIS / UBAH BERITA (Screenshots 2 & 3) -->
        <!-- ------------------------------------------------------------ -->
        <div v-if="newsMode === 'form'" class="space-y-6">
          <div class="flex items-center justify-between border-b border-[#143d30] pb-4">
            <button
              type="button"
              @click="newsMode = 'list'"
              class="px-3.5 py-2 rounded-xl bg-[#0d261e] hover:bg-[#13352a] text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-[#143d30]"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Kembali ke Daftar Berita</span>
            </button>
          </div>

          <!-- Section 1: Isi Berita -->
          <div class="bg-[#0b211a] border border-[#143d30] rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Isi Berita
            </h3>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                Judul *
              </label>
              <input
                v-model="articleForm.title"
                type="text"
                placeholder="Masukkan judul berita yang memikat..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 font-bold"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5">
                  Nama Penulis / Wartawan *
                </label>
                <input
                  v-model="articleForm.authorName"
                  type="text"
                  placeholder="Contoh: Admin Redaksi, Ahmad Fauzi, dsb."
                  class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5">
                  Jabatan / Peran Penulis
                </label>
                <input
                  v-model="articleForm.authorRole"
                  type="text"
                  placeholder="Contoh: Redaktur, Jurnalis Muktamar, Kontributor"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <!-- Upload Foto Sampul Berita (Utama) -->
            <div class="p-4 sm:p-5 rounded-2xl bg-[#071913] border border-[#143d30] space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-white flex items-center gap-2">
                  <ImageIcon class="w-4 h-4 text-emerald-400" />
                  <span>Foto Sampul Berita (Utama) *</span>
                </label>
                <span class="text-[10px] text-emerald-400/90 font-medium">JPG, PNG, atau WebP</span>
              </div>
              <ImageUploadInput
                v-model="articleForm.cover_image"
                description="Pilih foto sampul berita langsung dari laptop/komputer Anda untuk kartu berita dan banner artikel."
                aspect="wide"
              />
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="text-xs font-bold text-slate-300">
                  Slug URL (Alamat Berita)
                </label>
                <button
                  type="button"
                  @click="toggleSlugCustom"
                  class="text-[11px] flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                >
                  <component :is="articleForm.isSlugCustom ? Lock : Unlock" class="w-3.5 h-3.5" />
                  <span>{{ articleForm.isSlugCustom ? 'Beralih ke Otomatis' : 'Ubah Manual' }}</span>
                </button>
              </div>
              <div class="relative">
                <input
                  v-model="articleForm.slug"
                  type="text"
                  :readonly="!articleForm.isSlugCustom"
                  placeholder="otomatis dibuat dari judul..."
                  :class="[
                    'w-full px-4 py-2.5 rounded-xl border text-xs font-mono focus:outline-none transition-colors',
                    articleForm.isSlugCustom 
                      ? 'bg-[#071913] border-emerald-500/50 text-emerald-300 focus:border-emerald-400' 
                      : 'bg-[#05130f] border-[#143d30] text-slate-400 cursor-not-allowed'
                  ]"
                />
                <span v-if="!articleForm.isSlugCustom" class="absolute right-3 top-2.5 text-[10px] px-2 py-0.5 rounded-md bg-[#0d261e] text-emerald-400 border border-[#143d30]">
                  Otomatis
                </span>
              </div>
              <p class="text-[10px] text-slate-400 mt-1">
                {{ articleForm.isSlugCustom ? 'Anda sedang mengubah slug secara manual. Pastikan unik dan hanya berisi huruf, angka, serta tanda hubung (-).' : 'Slug otomatis terisi saat mengetik judul berita.' }}
              </p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">
                Ringkasan *
              </label>
              <textarea
                v-model="articleForm.excerpt"
                rows="3"
                placeholder="Tuliskan rangkuman singkat isi berita..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
              <p class="text-[10px] text-slate-400 mt-1">
                Tampil pada daftar berita dan hasil pencarian mesin pencari.
              </p>
            </div>

            <!-- Editor Wadah Naskah Artikel (Dapat Diperluas / Layar Penuh) -->
            <div
              :class="[
                isContentFullscreen
                  ? 'fixed inset-0 z-50 bg-[#061510] p-4 sm:p-6 lg:p-8 flex flex-col overflow-hidden shadow-2xl'
                  : 'relative'
              ]"
            >
              <!-- Baris Kontrol Editor: Label, Info Kata, Tabs, dan Tombol Layar Penuh -->
              <div class="flex flex-wrap items-center justify-between gap-2.5 mb-2.5 pb-2 border-b border-[#143d30]/60">
                <div class="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <label class="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <PenLine class="w-3.5 h-3.5 text-emerald-400" />
                    <span>Isi Artikel *</span>
                  </label>
                  <span
                    v-if="isContentFullscreen"
                    class="text-[11px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1"
                  >
                    <Sparkles class="w-3 h-3 text-emerald-400" />
                    <span>Mode Layar Penuh</span>
                  </span>
                  <!-- Indikator Jumlah Kata & Karakter -->
                  <span class="text-[11px] text-slate-400 bg-[#071913] px-2.5 py-0.5 rounded-md border border-[#143d30]">
                    {{ contentStats.words }} kata • {{ contentStats.chars }} karakter
                  </span>
                </div>

                <!-- Kontrol Kanan: Tabs Editor & Tombol Layar Penuh -->
                <div class="flex items-center gap-2">
                  <!-- Editor Tabs: Tulis vs Pratinjau -->
                  <div class="flex items-center gap-1 bg-[#071913] p-1 rounded-xl border border-[#143d30]">
                    <button
                      type="button"
                      @click="articleForm.activeEditorTab = 'write'"
                      :class="[
                        'px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
                        articleForm.activeEditorTab === 'write' ? 'bg-[#008f8a] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      ]"
                    >
                      <PenLine class="w-3.5 h-3.5" />
                      <span>Tulis Naskah</span>
                    </button>
                    <button
                      type="button"
                      @click="articleForm.activeEditorTab = 'preview'"
                      :class="[
                        'px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer',
                        articleForm.activeEditorTab === 'preview' ? 'bg-[#008f8a] text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      ]"
                    >
                      <Eye class="w-3.5 h-3.5" />
                      <span>Pratinjau Hasil</span>
                    </button>
                  </div>

                  <!-- Tombol Mode Layar Penuh / Perkecil -->
                  <button
                    type="button"
                    @click="toggleContentFullscreen"
                    :title="isContentFullscreen ? 'Kembali ke Tampilan Biasa (Esc)' : 'Perluas / Mode Layar Penuh'"
                    :class="[
                      'px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border shadow-xs',
                      isContentFullscreen
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                        : 'bg-[#0d261e] border-[#143d30] text-emerald-400 hover:bg-[#13352a] hover:text-emerald-300'
                    ]"
                  >
                    <component :is="isContentFullscreen ? Minimize2 : Maximize2" class="w-3.5 h-3.5" />
                    <span>{{ isContentFullscreen ? 'Kecilkan Layar (Esc)' : 'Layar Penuh' }}</span>
                  </button>
                </div>
              </div>

              <!-- Formatting Toolbar (Visible in Write mode) -->
              <div v-show="articleForm.activeEditorTab === 'write'" class="mb-2 p-2 rounded-xl bg-[#071913] border border-[#143d30] flex flex-wrap items-center gap-1.5">
                <span class="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">Format Cepat:</span>
                <button
                  type="button"
                  @click="insertFormatting('bold')"
                  title="Tebal (**teks**)"
                  class="px-2.5 py-1 rounded-lg bg-[#0d261e] hover:bg-[#13352a] text-slate-200 text-xs font-bold border border-[#143d30] flex items-center gap-1 cursor-pointer"
                >
                  <Bold class="w-3.5 h-3.5 text-emerald-400" />
                  <span>B</span>
                </button>
                <button
                  type="button"
                  @click="insertFormatting('italic')"
                  title="Miring (*teks*)"
                  class="px-2.5 py-1 rounded-lg bg-[#0d261e] hover:bg-[#13352a] text-slate-200 text-xs italic border border-[#143d30] flex items-center gap-1 cursor-pointer"
                >
                  <Italic class="w-3.5 h-3.5 text-emerald-400" />
                  <span>I</span>
                </button>
                <button
                  type="button"
                  @click="insertFormatting('h2')"
                  title="Subjudul Utama (## Judul)"
                  class="px-2.5 py-1 rounded-lg bg-[#0d261e] hover:bg-[#13352a] text-slate-200 text-xs font-bold border border-[#143d30] flex items-center gap-1 cursor-pointer"
                >
                  <Heading2 class="w-3.5 h-3.5 text-emerald-400" />
                  <span>H2</span>
                </button>
                <button
                  type="button"
                  @click="insertFormatting('h3')"
                  title="Subjudul Poin (### Poin)"
                  class="px-2.5 py-1 rounded-lg bg-[#0d261e] hover:bg-[#13352a] text-slate-200 text-xs font-bold border border-[#143d30] flex items-center gap-1 cursor-pointer"
                >
                  <Heading3 class="w-3.5 h-3.5 text-emerald-400" />
                  <span>H3</span>
                </button>
                <button
                  type="button"
                  @click="insertFormatting('quote')"
                  title="Kutipan (> teks)"
                  class="px-2.5 py-1 rounded-lg bg-[#0d261e] hover:bg-[#13352a] text-slate-200 text-xs border border-[#143d30] flex items-center gap-1 cursor-pointer"
                >
                  <Quote class="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kutipan</span>
                </button>
                <button
                  type="button"
                  @click="insertFormatting('list')"
                  title="Daftar Poin (- poin)"
                  class="px-2.5 py-1 rounded-lg bg-[#0d261e] hover:bg-[#13352a] text-slate-200 text-xs border border-[#143d30] flex items-center gap-1 cursor-pointer"
                >
                  <List class="w-3.5 h-3.5 text-emerald-400" />
                  <span>Daftar</span>
                </button>
                <div class="h-4 w-px bg-[#143d30] mx-0.5"></div>
                <!-- Sisipkan Foto Button Langsung di Toolbar Atas -->
                <label
                  @click="trackCursorPos"
                  class="px-2.5 py-1 rounded-lg bg-[#0d261e] hover:bg-[#13352a] text-slate-200 text-xs border border-[#143d30] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Sisipkan Foto dari Komputer di Posisi Kursor Teks"
                >
                  <ImageIcon class="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sisipkan Foto</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    class="hidden"
                    @change="handleInsertArticleImage"
                  />
                </label>
                <!-- Sisipkan Link / Banner Button -->
                <button
                  type="button"
                  @click="openLinkModal"
                  title="Sisipkan Tautan / Link / Banner 'Baca Juga' di Posisi Kursor"
                  class="px-2.5 py-1 rounded-lg bg-[#008f8a]/20 hover:bg-[#008f8a]/30 text-emerald-300 text-xs font-semibold border border-[#008f8a]/40 flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Link2 class="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sisipkan Link / Banner</span>
                </button>
              </div>

              <!-- Write View: Textarea (Nyaman, Lega, Teks Jelas, dan Bisa Diperluas) -->
              <div 
                v-show="articleForm.activeEditorTab === 'write'" 
                :class="[
                  isContentFullscreen ? 'flex-1 flex flex-col min-h-0' : ''
                ]"
              >
                <textarea
                  id="article-content-textarea"
                  v-model="articleForm.content"
                  @click="trackCursorPos"
                  @keyup="trackCursorPos"
                  @select="trackCursorPos"
                  @focus="trackCursorPos"
                  @input="trackCursorPos"
                  :rows="isContentFullscreen ? 26 : 18"
                  placeholder="Tulis naskah berita lengkap di sini (pisahkan paragraf dengan baris kosong dua kali enter)..."
                  :class="[
                    'w-full px-5 py-4 rounded-xl bg-[#071913] border border-[#143d30] text-sm sm:text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans transition-all resize-y shadow-inner',
                    isContentFullscreen ? 'flex-1 h-full min-h-[420px]' : 'min-h-[420px]'
                  ]"
                ></textarea>
                <div class="mt-2 space-y-1">
                  <p class="text-[11px] text-slate-400">
                    Format naskah: Pisahkan paragraf dengan dua kali Enter. Gunakan toolbar di atas untuk subjudul, kutipan, dan teks tebal. Pojok kanan bawah textarea dapat ditarik ke bawah untuk memperluas tinggi wadah sesuka hati.
                  </p>
                  <p class="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1.5">
                    <Sparkles class="w-3.5 h-3.5 shrink-0" />
                    <span>Foto dan Banner "Baca Juga" disisipkan tepat di posisi kursor Anda. Anda juga bebas memindahkannya dengan Cut & Paste (Ctrl+X / Ctrl+V) ke baris mana saja di antara paragraf!</span>
                  </p>
                </div>
              </div>

              <!-- Preview View: Formatted Preview in Admin -->
              <div 
                v-show="articleForm.activeEditorTab === 'preview'" 
                :class="[
                  'p-6 sm:p-8 rounded-2xl bg-[#071913] border border-[#143d30]',
                  isContentFullscreen ? 'flex-1 overflow-y-auto max-w-4xl mx-auto w-full' : 'min-h-[420px]'
                ]"
              >
                <div class="mb-4 pb-3 border-b border-[#143d30] flex items-center justify-between text-xs text-slate-400">
                  <span class="font-bold text-emerald-400 uppercase tracking-wider">Pratinjau Tampilan Pembaca</span>
                  <span>Oleh: <strong class="text-white">{{ articleForm.authorName }}</strong> ({{ articleForm.authorRole }})</span>
                </div>
                <div v-html="formatPreviewContent(articleForm.content)" class="space-y-4"></div>
              </div>

              <!-- Sisipkan Gambar Button (Matching User Screenshot 2) -->
              <div v-if="!isContentFullscreen" class="mt-3 flex items-center gap-3">
                <label class="px-3.5 py-2 rounded-xl bg-[#0d261e] hover:bg-[#13352a] border border-[#143d30] text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs">
                  <ImageIcon class="w-4 h-4 text-emerald-400" />
                  <span>Sisipkan Gambar dari Komputer</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    class="hidden"
                    @change="handleInsertArticleImage"
                  />
                </label>
                <span class="text-[11px] text-slate-400">JPG, PNG, atau WebP. Foto langsung tersisip ke naskah berita.</span>
              </div>
            </div>
          </div>

          <!-- Section 2: Kategori, Tag, dan SEO -->
          <div class="bg-[#0b211a] border border-[#143d30] rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Kategori, Tag, dan SEO
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1.5">
                  Kategori
                </label>
                <input
                  v-model="articleForm.categoryName"
                  type="text"
                  placeholder="Contoh: LIPUTAN / KEGIATAN"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">
                  Tag
                </label>
                <input
                  v-model="articleForm.tags"
                  type="text"
                  placeholder="Muktamar, Jombang, Nahdlatul Ulama"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <p class="text-[10px] text-slate-400 mt-1">Pisahkan dengan koma.</p>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">
                Meta Title
              </label>
              <input
                v-model="articleForm.metaTitle"
                type="text"
                placeholder="Judul pada hasil pencarian..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <p class="text-[10px] text-slate-400 mt-1">Judul pada hasil pencarian. Kosongkan untuk memakai judul berita.</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">
                Meta Description
              </label>
              <textarea
                v-model="articleForm.metaDescription"
                rows="2"
                placeholder="Deskripsi singkat untuk Google / media sosial..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
              <p class="text-[10px] text-slate-400 mt-1">Maksimal 200 karakter.</p>
            </div>
          </div>

          <!-- Section 3: Gambar dan Status -->
          <div class="bg-[#0b211a] border border-[#143d30] rounded-3xl p-6 sm:p-8 space-y-5">
            <h3 class="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              Gambar dan Status
            </h3>

            <!-- Upload Cover dari Komputer -->
            <ImageUploadInput
              v-model="articleForm.cover_image"
              label="Gambar Sampul (Unggah dari Komputer) *"
              description="Pilih foto sampul berita langsung dari laptop/komputer Anda (JPG, PNG, WebP)."
              aspect="wide"
            />

            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                Status
              </label>
              <select
                v-model="articleForm.status"
                class="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="published">Terbit</option>
                <option value="draft">Draf</option>
              </select>
            </div>
          </div>

          <!-- Form Bottom Action Bar (Screenshot 3) -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#143d30]">
            <button
              type="button"
              @click="newsMode = 'list'"
              class="px-5 py-2.5 rounded-xl bg-[#0d261e] hover:bg-[#13352a] text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-[#143d30]"
            >
              Batal
            </button>
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="handleSaveArticle('draft')"
                class="px-5 py-2.5 rounded-xl bg-[#0d261e] hover:bg-[#13352a] text-emerald-400 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/30"
              >
                <BookmarkCheck class="w-4 h-4" />
                <span>Simpan sebagai Draf</span>
              </button>
              <button
                type="button"
                @click="handleSaveArticle('published')"
                class="px-6 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:brightness-110 active:scale-95"
              >
                <Send class="w-4 h-4" />
                <span>Terbitkan ke Publik</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ------------------------------------------------------------ -->
        <!-- VIEW 2: LIST DAFTAR BERITA DENGAN TABEL (Screenshot 1) -->
        <!-- ------------------------------------------------------------ -->
        <div v-else class="space-y-6">
          <!-- Banner & Header Settings Box -->
          <div class="p-6 rounded-3xl bg-[#0b211a] border border-[#143d30] space-y-5">
            <div class="flex items-center justify-between border-b border-[#143d30] pb-3">
              <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Pengaturan Header & Banner Halaman Berita
              </span>
              <button
                type="button"
                @click="saveSettings('Berita')"
                class="px-4 py-2 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save class="w-4 h-4" />
                <span>Simpan Header Berita</span>
              </button>
            </div>

            <!-- Upload Banner Berita dari Komputer -->
            <ImageUploadInput
              v-model="formSettings.banner_berita_url"
              label="Foto Banner Halaman Berita (Unggah dari Komputer)"
              description="Pilih foto jurnalis / liputan dari komputer Anda."
            />

            <!-- Teks Judul & Deskripsi Header Berita -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                  Label Kategori Atas
                </label>
                <input
                  v-model="formSettings.news_tag"
                  type="text"
                  placeholder="Contoh: KABAR TERBARU"
                  class="w-full px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                  Judul Utama Halaman Berita
                </label>
                <input
                  v-model="formSettings.news_title"
                  type="text"
                  placeholder="Contoh: Berita & liputan"
                  class="w-full px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-300 mb-1">
                Deskripsi Singkat Header Berita
              </label>
              <textarea
                v-model="formSettings.news_subtitle"
                rows="2"
                placeholder="Contoh: Ikuti perkembangan terkini, pengumuman resmi, dan liputan jalannya Muktamar."
                class="w-full px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>
          </div>

          <!-- Filter & Search Bar (Exact Match to Screenshot 1) -->
          <div class="bg-[#0b211a] border border-[#143d30] rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div class="relative flex-1">
              <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="newsSearch"
                type="text"
                placeholder="Cari judul atau ringkasan..."
                class="w-full pl-10 pr-4 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div class="flex items-center gap-2">
              <select
                v-model="newsStatusFilter"
                class="px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Semua status</option>
                <option value="published">Terbit</option>
                <option value="draft">Draf</option>
              </select>

              <select
                v-model="newsCategoryFilter"
                class="px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Semua kategori</option>
                <option value="liputan">Liputan</option>
                <option value="berita">Berita</option>
                <option value="kegiatan">Kegiatan</option>
              </select>

              <button
                v-if="filteredArticles.length > 0"
                type="button"
                @click="handleClearAllArticles"
                class="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer border border-rose-500/20"
                title="Hapus seluruh berita sekaligus"
              >
                <Trash2 class="w-3.5 h-3.5" />
                <span class="hidden sm:inline">Kosongkan Berita</span>
              </button>

              <button
                type="button"
                @click="openAddArticle"
                class="px-4 py-2 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                <Plus class="w-4 h-4" />
                <span>Tulis Berita</span>
              </button>
            </div>
          </div>

          <!-- Total Count Info -->
          <div class="text-xs text-slate-400 px-1">
            Menampilkan <strong class="text-white">{{ filteredArticles.length }}</strong> berita sesuai filter.
          </div>

          <!-- News Table (Exact Match to Screenshot 1) -->
          <div class="bg-[#0b211a] border border-[#143d30] rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-xs border-collapse">
                <thead>
                  <tr class="border-b border-[#143d30] bg-[#071913]/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <th class="py-3 px-4 w-1/2">JUDUL</th>
                    <th class="py-3 px-4">KATEGORI</th>
                    <th class="py-3 px-4 text-center">STATUS</th>
                    <th class="py-3 px-4">TERBIT</th>
                    <th class="py-3 px-4 text-center">DILIHAT</th>
                    <th class="py-3 px-4 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#143d30]">
                  <tr
                    v-for="art in filteredArticles"
                    :key="art.id"
                    class="hover:bg-white/[0.02] transition-colors"
                  >
                    <!-- Judul + Excerpt -->
                    <td class="py-3.5 px-4">
                      <div class="flex items-start gap-3">
                        <img
                          :src="art.cover_image_url || art.cover_image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=300&q=80'"
                          alt=""
                          class="w-12 h-10 object-cover rounded-lg shrink-0 border border-[#143d30] mt-0.5"
                        />
                        <div class="min-w-0">
                          <h4 class="font-bold text-white leading-snug line-clamp-2">
                            {{ art.title }}
                          </h4>
                          <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {{ art.excerpt }}
                          </p>
                        </div>
                      </div>
                    </td>

                    <!-- Kategori -->
                    <td class="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      <span class="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px]">
                        {{ art.category?.name || 'LIPUTAN' }}
                      </span>
                    </td>

                    <!-- Status Pill (Clickable) -->
                    <td class="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        @click="newsStore.toggleArticleStatus(art.id)"
                        class="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer"
                        :class="[
                          art.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-slate-500/20 text-slate-400 border border-slate-500/30 hover:bg-slate-500/30'
                        ]"
                      >
                        {{ art.status === 'published' ? 'Terbit' : 'Draf' }}
                      </button>
                    </td>

                    <!-- Tanggal Terbit -->
                    <td class="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {{ art.published_at_formatted || '31 Agustus 2026' }}
                    </td>

                    <!-- Dilihat -->
                    <td class="py-3.5 px-4 text-center text-slate-300 font-mono text-[11px] whitespace-nowrap">
                      {{ art.view_count || 0 }}
                    </td>

                    <!-- Aksi Buttons (Ubah, Lihat, Hapus) -->
                    <td class="py-3.5 px-4 text-right whitespace-nowrap">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          @click="openEditArticle(art)"
                          class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Edit3 class="w-3.5 h-3.5" />
                          <span>Ubah</span>
                        </button>

                        <RouterLink
                          :to="'/artikel/' + art.slug"
                          target="_blank"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition-colors cursor-pointer"
                          title="Lihat Halaman Publik"
                        >
                          <Eye class="w-4 h-4" />
                        </RouterLink>

                        <button
                          type="button"
                          @click="handleDeleteArticle(art)"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Hapus Berita"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="filteredArticles.length === 0">
                    <td colspan="6" class="py-8 text-center text-slate-400 text-xs">
                      Tidak ada berita yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- TAB 6: KELOLA GALERI (ALBUM ARCHITECTURE) -->
      <!-- ============================================================ -->
      <div v-show="activeTab === 'galeri'" class="space-y-6">
        <!-- ========================================================== -->
        <!-- SUB-VIEW 1: DAFTAR ALBUM (SCREENSHOT 1) -->
        <!-- ========================================================== -->
        <div v-if="galleryMode === 'albums'" class="space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="text-[11px] text-slate-400 font-medium">Dashboard / Konten Situs / Galeri</div>
              <h2 class="text-xl font-bold text-white mt-1">Galeri</h2>
              <p class="text-xs text-slate-400 mt-0.5">{{ filteredAlbums.length }} album sesuai filter yang dipilih.</p>
            </div>
            <div class="flex items-center gap-3">
              <button
                type="button"
                @click="isHeaderSettingsOpen = !isHeaderSettingsOpen"
                class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-[#143d30] cursor-pointer"
              >
                <Settings class="w-3.5 h-3.5" />
                <span>{{ isHeaderSettingsOpen ? 'Tutup Pengaturan Header' : 'Pengaturan Header Galeri' }}</span>
              </button>
              <button
                type="button"
                @click="openAddAlbum"
                class="px-4 py-2 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus class="w-4 h-4" />
                <span>Tambah Album</span>
              </button>
            </div>
          </div>

          <!-- Header & Banner Galeri Settings (Collapsible) -->
          <div v-show="isHeaderSettingsOpen" class="p-5 rounded-2xl bg-[#0b211a] border border-[#143d30] space-y-4">
            <div class="flex items-center justify-between border-b border-[#143d30] pb-3">
              <h3 class="text-xs font-bold text-emerald-400 uppercase tracking-wider">Pengaturan Banner & Teks Header Galeri Publik</h3>
              <button
                type="button"
                @click="saveSettings('Galeri')"
                class="px-3 py-1.5 rounded-lg bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Save class="w-3.5 h-3.5" />
                <span>Simpan Header</span>
              </button>
            </div>
            <ImageUploadInput
              v-model="formSettings.banner_galeri_url"
              label="Foto Banner Halaman Galeri (Unggah dari Komputer)"
              description="Pilih foto banner atas halaman galeri langsung dari laptop atau komputer Anda."
            />
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-[11px] font-semibold text-slate-300 mb-1">Label Kategori Atas</label>
                <input
                  v-model="formSettings.gallery_tag"
                  type="text"
                  placeholder="Contoh: DOKUMENTASI RESMI"
                  class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div class="sm:col-span-2">
                <label class="block text-[11px] font-semibold text-slate-300 mb-1">Judul Utama Halaman Galeri</label>
                <input
                  v-model="formSettings.gallery_title"
                  type="text"
                  placeholder="Contoh: Galeri Dokumentasi"
                  class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-[11px] font-semibold text-slate-300 mb-1">Deskripsi Singkat Header</label>
              <textarea
                v-model="formSettings.gallery_subtitle"
                rows="2"
                placeholder="Deskripsi dokumentasi visual kegiatan..."
                class="w-full px-3 py-2 rounded-xl bg-[#04120e] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>
          </div>

          <!-- Filter & Search Bar -->
          <div class="p-4 rounded-2xl bg-[#0b211a] border border-[#143d30] flex flex-col md:flex-row items-center gap-3">
            <div class="relative flex-1 w-full">
              <Search class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                v-model="albumSearch"
                type="text"
                placeholder="Cari judul album..."
                class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
            </div>
            <div class="flex items-center gap-2 w-full md:w-auto">
              <select
                v-model="albumStatusFilter"
                class="flex-1 md:w-44 px-3 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-slate-300 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">Semua status</option>
                <option value="published">Terbit</option>
                <option value="draft">Draf</option>
              </select>
              <button
                type="button"
                class="px-4 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs cursor-pointer"
              >
                Terapkan
              </button>
            </div>
          </div>

          <!-- Albums Table -->
          <div class="bg-[#0b211a] border border-[#143d30] rounded-2xl overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="border-b border-[#143d30] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th class="py-3 px-4">Album</th>
                    <th class="py-3 px-4">Jumlah Foto</th>
                    <th class="py-3 px-4">Urutan</th>
                    <th class="py-3 px-4">Status</th>
                    <th class="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#143d30]/60 text-xs">
                  <tr
                    v-for="album in filteredAlbums"
                    :key="album.id"
                    class="hover:bg-white/[0.02] transition-colors"
                  >
                    <!-- Col 1: Album Cover + Title + Slug -->
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-lg overflow-hidden bg-[#071913] border border-[#143d30] flex items-center justify-center shrink-0">
                          <img
                            v-if="album.cover_image"
                            :src="album.cover_image"
                            :alt="album.title"
                            class="w-full h-full object-cover"
                          />
                          <Folder v-else class="w-5 h-5 text-emerald-400/60" />
                        </div>
                        <div>
                          <div class="font-bold text-white hover:text-emerald-400 cursor-pointer" @click="openManageAlbumPhotos(album)">
                            {{ album.title }}
                          </div>
                          <div class="text-[11px] text-slate-500 font-mono mt-0.5">/{{ album.slug }}</div>
                        </div>
                      </div>
                    </td>

                    <!-- Col 2: Jumlah Foto -->
                    <td class="py-3 px-4 text-slate-300 font-medium">
                      {{ (album.photos || []).length }}
                    </td>

                    <!-- Col 3: Urutan -->
                    <td class="py-3 px-4 text-slate-300 font-medium">
                      {{ album.sort_order ?? 0 }}
                    </td>

                    <!-- Col 4: Status -->
                    <td class="py-3 px-4">
                      <span
                        v-if="album.status === 'published'"
                        class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300"
                      >
                        Terbit
                      </span>
                      <span
                        v-else
                        class="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-700/50 text-slate-400"
                      >
                        Draf
                      </span>
                    </td>

                    <!-- Col 5: Aksi -->
                    <td class="py-3 px-4 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          @click="openManageAlbumPhotos(album)"
                          class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors cursor-pointer"
                        >
                          Kelola
                        </button>
                        <button
                          type="button"
                          @click="openEditAlbum(album)"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                          title="Edit Pengaturan Album"
                        >
                          <Edit3 class="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          @click="toggleAlbumStatus(album)"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                          :title="album.status === 'published' ? 'Sembunyikan Album' : 'Terbitkan Album'"
                        >
                          <Eye v-if="album.status === 'published'" class="w-4 h-4" />
                          <EyeOff v-else class="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          @click="deleteAlbum(album)"
                          class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Hapus Album"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>

                  <!-- Empty State -->
                  <tr v-if="filteredAlbums.length === 0">
                    <td colspan="5" class="py-8 text-center text-slate-400 text-xs">
                      Tidak ada album yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Footer Counter -->
            <div class="p-4 border-t border-[#143d30] flex items-center justify-between text-xs text-slate-400">
              <div>Menampilkan 1–{{ filteredAlbums.length }} dari {{ filteredAlbums.length }} album</div>
              <div class="flex items-center gap-2">
                <button disabled class="px-2.5 py-1 rounded-lg bg-white/5 text-slate-600 cursor-not-allowed">
                  &lt; Sebelumnya
                </button>
                <span class="text-slate-400">1 / 1</span>
                <button disabled class="px-2.5 py-1 rounded-lg bg-white/5 text-slate-600 cursor-not-allowed">
                  Berikutnya &gt;
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ========================================================== -->
        <!-- SUB-VIEW 2: FORM PENGATURAN ALBUM (SCREENSHOT 3) -->
        <!-- ========================================================== -->
        <div v-else-if="galleryMode === 'album-form'" class="space-y-6">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-[11px] text-slate-400 font-medium">
                Dashboard / Konten Situs / Galeri / {{ isEditingAlbum ? 'Edit' : 'Tambah' }}
              </div>
              <h2 class="text-xl font-bold text-white mt-1">Pengaturan Album</h2>
              <p class="text-xs text-slate-400 mt-0.5">Atur nama album, slug url, urutan, serta gambar sampul album.</p>
            </div>
            <button
              type="button"
              @click="galleryMode = 'albums'"
              class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-[#143d30] cursor-pointer"
            >
              <ArrowLeft class="w-4 h-4" />
              <span>Kembali ke Daftar Album</span>
            </button>
          </div>

          <div class="p-6 rounded-2xl bg-[#0b211a] border border-[#143d30] space-y-5">
            <!-- Judul Album -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Judul Album *</label>
              <input
                v-model="albumForm.title"
                type="text"
                placeholder="Contoh: Prestasi Santri / Kegiatan Pondok"
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <!-- Slug URL -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Slug URL</label>
              <input
                v-model="albumForm.slug"
                type="text"
                placeholder="prestasi-santri"
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
              <p class="text-[11px] text-slate-500 mt-1">Digunakan untuk penamaan URL dan pengelompokan foto.</p>
            </div>

            <!-- Deskripsi -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Deskripsi Album</label>
              <textarea
                v-model="albumForm.description"
                rows="3"
                placeholder="Keterangan singkat tentang kegiatan atau isi dalam album ini..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              ></textarea>
            </div>

            <!-- Grid: Urutan Tampil & Status -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Urutan Tampil</label>
                <input
                  v-model.number="albumForm.sort_order"
                  type="number"
                  placeholder="0"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-300 mb-1">Status</label>
                <select
                  v-model="albumForm.status"
                  class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="published">Terbit</option>
                  <option value="draft">Draf</option>
                </select>
              </div>
            </div>

            <!-- Gambar Sampul Album -->
            <div class="pt-2 border-t border-[#143d30]">
              <ImageUploadInput
                v-model="albumForm.cover_image"
                label="Gambar Sampul Album (Unggah dari Komputer)"
                description="Pilih foto sampul utama album dari komputer Anda. Jika dikosongkan, foto pertama dalam album akan dijadikan sampul otomatis."
              />
            </div>

            <!-- Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#143d30]">
              <button
                type="button"
                @click="galleryMode = 'albums'"
                class="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                @click="saveAlbum"
                class="px-5 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Save class="w-4 h-4" />
                <span>Simpan Album</span>
              </button>
            </div>
          </div>
        </div>

        <!-- ========================================================== -->
        <!-- SUB-VIEW 3: KELOLA FOTO DALAM ALBUM (SCREENSHOT 2) -->
        <!-- ========================================================== -->
        <div v-else-if="galleryMode === 'album-photos'" class="space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div class="text-[11px] text-slate-400 font-medium">Dashboard / Konten Situs / Galeri / Kelola</div>
              <div class="flex items-center gap-2.5 mt-1">
                <h2 class="text-xl font-bold text-white">{{ selectedAlbum?.title || 'Kelola Foto' }}</h2>
                <span
                  v-if="selectedAlbum?.status === 'published'"
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300"
                >
                  Terbit
                </span>
                <span
                  v-else
                  class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/50 text-slate-400"
                >
                  Draf
                </span>
                <button
                  type="button"
                  v-if="selectedAlbum"
                  @click="toggleAlbumStatus(selectedAlbum)"
                  class="text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  :title="selectedAlbum.status === 'published' ? 'Sembunyikan Album' : 'Terbitkan Album'"
                >
                  <Eye v-if="selectedAlbum.status === 'published'" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
              <p class="text-xs text-slate-400 mt-0.5">
                {{ (selectedAlbum?.photos || []).length }} foto dalam album ini.
              </p>
            </div>
            <div class="flex items-center gap-2.5">
              <button
                type="button"
                @click="galleryMode = 'albums'"
                class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs flex items-center gap-1.5 border border-[#143d30] cursor-pointer"
              >
                <ArrowLeft class="w-4 h-4" />
                <span>Kembali ke Daftar Album</span>
              </button>
              <RouterLink
                to="/galeri"
                target="_blank"
                class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-1.5 border border-[#143d30]"
              >
                <ExternalLink class="w-4 h-4" />
                <span>Lihat di situs</span>
              </RouterLink>
            </div>
          </div>

          <!-- Card 1: Form Unggah Foto ke Album -->
          <div class="p-6 rounded-2xl bg-[#0b211a] border border-[#143d30] space-y-4">
            <h3 class="text-sm font-bold text-white">Unggah Foto</h3>

            <!-- Pilih Foto dari Komputer -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Pilih Foto</label>
              <div class="flex items-center gap-3">
                <label class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 cursor-pointer transition-colors shadow-sm">
                  <Upload class="w-4 h-4" />
                  <span>Pilih Berkas dari Komputer</span>
                  <input
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/jpg"
                    class="hidden"
                    @change="onPhotoFilesSelected"
                  />
                </label>
                <span class="text-xs text-slate-300">
                  {{ photoUploadFiles.length > 0 ? `${photoUploadFiles.length} foto dipilih` : 'Belum ada berkas dipilih' }}
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-1.5">
                JPG, PNG, atau WebP. Bisa memilih beberapa berkas sekaligus (maksimal 20).
              </p>
            </div>

            <!-- Keterangan Massal -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Keterangan</label>
              <input
                v-model="photoUploadForm.caption"
                type="text"
                placeholder="Diterapkan ke semua foto pada unggahan ini."
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <!-- Status Foto -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">Status Foto</label>
              <select
                v-model="photoUploadForm.status"
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="published">Terbit</option>
                <option value="draft">Draf</option>
              </select>
            </div>

            <!-- Submit Upload -->
            <div class="flex justify-end pt-2">
              <button
                type="button"
                @click="handleUploadPhotosToAlbum"
                :disabled="isUploadingPhotos || photoUploadFiles.length === 0"
                class="px-5 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Loader2 v-if="isUploadingPhotos" class="w-4 h-4 animate-spin" />
                <Upload v-else class="w-4 h-4" />
                <span>{{ isUploadingPhotos ? 'Mengunggah...' : 'Unggah Foto' }}</span>
              </button>
            </div>
          </div>

          <!-- Card 2: Foto dalam Album -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-white">Foto dalam Album</h3>

            <div
              v-for="photo in (selectedAlbum?.photos || [])"
              :key="photo.id"
              class="p-5 rounded-2xl bg-[#0b211a] border border-[#143d30] flex flex-col md:flex-row gap-5"
            >
              <!-- Thumbnail -->
              <div class="w-full md:w-56 h-48 md:h-auto rounded-xl overflow-hidden bg-black/40 border border-[#143d30] shrink-0 relative">
                <img :src="photo.src" :alt="photo.title" class="w-full h-full object-cover" />
              </div>

              <!-- Form Input per Foto -->
              <div class="flex-1 space-y-3.5">
                <!-- Meta Bar: Status & Tanggal -->
                <div class="flex items-center gap-2 text-[11px]">
                  <span
                    v-if="photo.status === 'published'"
                    class="px-2 py-0.5 rounded-md font-semibold bg-emerald-500/20 text-emerald-300"
                  >
                    Terbit
                  </span>
                  <span
                    v-else
                    class="px-2 py-0.5 rounded-md font-semibold bg-slate-700/50 text-slate-400"
                  >
                    Draf
                  </span>
                  <span class="text-slate-400">Ditambahkan {{ photo.created_at || 'Baru' }}</span>
                </div>

                <!-- Judul Foto & Dropdown Album (Pindah Album) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">Judul Foto</label>
                    <input
                      v-model="photo.title"
                      type="text"
                      class="w-full px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">Album</label>
                    <select
                      v-model="photo.albumId"
                      class="w-full px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option
                        v-for="alb in (settingsStore.settings.gallery_albums_json || DEFAULT_GALLERY_ALBUMS)"
                        :key="alb.id"
                        :value="alb.id"
                      >
                        {{ alb.title }}
                      </option>
                    </select>
                  </div>
                </div>

                <!-- Keterangan -->
                <div>
                  <label class="block text-[11px] font-semibold text-slate-300 mb-1">Keterangan</label>
                  <input
                    v-model="photo.description"
                    type="text"
                    class="w-full px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <!-- Urutan & Status -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">Urutan</label>
                    <input
                      v-model.number="photo.sort_order"
                      type="number"
                      class="w-full px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-slate-300 mb-1">Status</label>
                    <select
                      v-model="photo.status"
                      class="w-full px-3 py-2 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="published">Terbit</option>
                      <option value="draft">Draf</option>
                    </select>
                  </div>
                </div>

                <!-- Actions: Toggle, Delete & Save -->
                <div class="flex items-center justify-between pt-2 border-t border-[#143d30]">
                  <div class="flex items-center gap-2">
                    <button
                      type="button"
                      @click="togglePhotoVisibility(photo)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                      :title="photo.status === 'published' ? 'Sembunyikan' : 'Terbitkan'"
                    >
                      <Eye v-if="photo.status === 'published'" class="w-4 h-4" />
                      <EyeOff v-else class="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      @click="deletePhotoItem(photo)"
                      class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Hapus Foto"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    @click="savePhotoItem(photo)"
                    class="px-4 py-2 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Save class="w-3.5 h-3.5" />
                    <span>Simpan Foto</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              v-if="(selectedAlbum?.photos || []).length === 0"
              class="p-8 text-center text-xs text-slate-400 bg-[#0b211a] border border-[#143d30] rounded-2xl"
            >
              Belum ada foto dalam album ini. Silakan pilih foto dari komputer Anda pada formulir unggah di atas.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- MODAL: ADD / EDIT AGENDA SESSION -->
    <!-- ============================================================ -->
    <div
      v-if="isSessionModalOpen"
      class="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4"
    >
      <div class="bg-[#0b211a] border border-[#143d30] rounded-3xl max-w-lg w-full p-6 space-y-5 text-white">
        <div class="flex items-center justify-between border-b border-[#143d30] pb-3">
          <h3 class="text-sm font-bold flex items-center gap-2">
            <Clock class="w-4 h-4 text-emerald-400" />
            <span>{{ isEditingSession ? 'Edit Sesi Kegiatan' : 'Tambah Sesi Kegiatan Baru' }}</span>
          </h3>
          <button @click="isSessionModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">
              Waktu / Jam Kegiatan *
            </label>
            <input
              v-model="sessionForm.time"
              type="text"
              placeholder="Contoh: 08.00 - 11.30 atau 20.00 - Selesai"
              class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">
              Nama / Judul Kegiatan *
            </label>
            <input
              v-model="sessionForm.title"
              type="text"
              placeholder="Contoh: Sidang Pleno I: Pengesahan Tatib Muktamar"
              class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">
              Tempat / Lokasi Kegiatan
            </label>
            <input
              v-model="sessionForm.venue"
              type="text"
              placeholder="Contoh: Aula Muktamar Utama / Lapangan Untung Suropati"
              class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">
              Penanggung Jawab / Pimpinan Sidang
            </label>
            <input
              v-model="sessionForm.leader"
              type="text"
              placeholder="Contoh: Presidium Sidang / Seksi Acara"
              class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#143d30]">
          <button
            type="button"
            @click="isSessionModalOpen = false"
            class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            @click="saveSession"
            class="px-5 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs cursor-pointer"
          >
            Simpan Kegiatan
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- MODAL: SISIPKAN TAUTAN / BANNER LINK -->
    <!-- ============================================================ -->
    <Teleport to="body">
      <div
        v-if="isLinkModalOpen"
        class="fixed inset-0 bg-black/80 backdrop-blur-xs z-[9999] flex items-center justify-center p-4"
      >
        <div class="bg-[#0b211a] border border-[#143d30] rounded-3xl max-w-lg w-full p-6 space-y-5 text-white shadow-2xl">
          <div class="flex items-center justify-between border-b border-[#143d30] pb-3">
            <h3 class="text-sm font-bold flex items-center gap-2 text-emerald-400">
              <Link2 class="w-4 h-4" />
              <span>Sisipkan Tautan / Banner "Baca Juga"</span>
            </h3>
            <button @click="isLinkModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <!-- Pilihan Tipe -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1.5">
                Tipe Tautan
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="linkModalForm.type = 'inline'"
                  :class="[
                    'p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer',
                    linkModalForm.type === 'inline' 
                      ? 'bg-[#008f8a]/20 border-[#008f8a] text-white shadow-xs' 
                      : 'bg-[#071913] border-[#143d30] text-slate-400 hover:text-slate-200'
                  ]"
                >
                  <div class="font-bold text-emerald-400 mb-0.5">Link Teks Biasa</div>
                  <div class="text-[10px] text-slate-400">Tautan inline di tengah kalimat / paragraf</div>
                </button>
                <button
                  type="button"
                  @click="linkModalForm.type = 'banner'"
                  :class="[
                    'p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer',
                    linkModalForm.type === 'banner' 
                      ? 'bg-[#008f8a]/20 border-[#008f8a] text-white shadow-xs' 
                      : 'bg-[#071913] border-[#143d30] text-slate-400 hover:text-slate-200'
                  ]"
                >
                  <div class="font-bold text-emerald-400 mb-0.5">Banner "Baca Juga"</div>
                  <div class="text-[10px] text-slate-400">Kotak sorotan banner seperti portal berita</div>
                </button>
              </div>
            </div>

            <!-- Teks Tautan / Judul Banner -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">
                {{ linkModalForm.type === 'banner' ? 'Judul Banner / Berita Terkait *' : 'Teks Tautan *' }}
              </label>
              <input
                v-model="linkModalForm.text"
                type="text"
                :placeholder="linkModalForm.type === 'banner' ? 'Contoh: Jadwal Rangkaian Sidang Muktamar Lengkap' : 'Contoh: Klik di sini untuk melihat agenda'"
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <!-- Subjudul Banner (Opsional jika banner) -->
            <div v-if="linkModalForm.type === 'banner'">
              <label class="block text-xs font-bold text-slate-300 mb-1">
                Keterangan Tambahan / Subjudul (Opsional)
              </label>
              <input
                v-model="linkModalForm.subtitle"
                type="text"
                placeholder="Contoh: Simak waktu, lokasi, dan pimpinan setiap majelis sidang..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <!-- URL / Tujuan Link -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">
                Alamat URL (Tujuan Tautan) *
              </label>
              <input
                v-model="linkModalForm.url"
                type="text"
                placeholder="Contoh: /agenda atau https://nu.or.id/..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <p class="text-[10px] text-slate-400 mt-1">
                Gunakan awalan <code>/</code> untuk halaman internal (contoh: <code>/agenda</code>), atau <code>https://</code> untuk link eksternal.
              </p>

              <!-- Tombol Pintas Halaman Internal -->
              <div class="mt-2.5 flex flex-wrap items-center gap-1.5">
                <span class="text-[10px] text-slate-400 font-bold uppercase mr-1">Pintas Cepat:</span>
                <button
                  type="button"
                  @click="selectPresetUrl('/agenda', 'Jadwal Agenda Muktamar')"
                  class="px-2 py-0.5 rounded-md bg-[#0d261e] hover:bg-[#13352a] text-emerald-400 border border-[#143d30] text-[10px] cursor-pointer"
                >
                  /agenda
                </button>
                <button
                  type="button"
                  @click="selectPresetUrl('/berita', 'Daftar Warta Berita Muktamar')"
                  class="px-2 py-0.5 rounded-md bg-[#0d261e] hover:bg-[#13352a] text-emerald-400 border border-[#143d30] text-[10px] cursor-pointer"
                >
                  /berita
                </button>
                <button
                  type="button"
                  @click="selectPresetUrl('/galeri', 'Galeri Dokumentasi Foto')"
                  class="px-2 py-0.5 rounded-md bg-[#0d261e] hover:bg-[#13352a] text-emerald-400 border border-[#143d30] text-[10px] cursor-pointer"
                >
                  /galeri
                </button>
                <button
                  type="button"
                  @click="selectPresetUrl('/tentang', 'Tentang Muktamar ke-35')"
                  class="px-2 py-0.5 rounded-md bg-[#0d261e] hover:bg-[#13352a] text-emerald-400 border border-[#143d30] text-[10px] cursor-pointer"
                >
                  /tentang
                </button>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#143d30]">
            <button
              type="button"
              @click="isLinkModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="applyLinkModal"
              class="px-5 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle2 class="w-4 h-4" />
              <span>Sisipkan ke Naskah</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ============================================================ -->
    <!-- MODAL: SISIPKAN FOTO ARTIKEL (DENGAN CAPTION & PREVIEW) -->
    <!-- ============================================================ -->
    <Teleport to="body">
      <div
        v-if="isImageModalOpen"
        class="fixed inset-0 bg-black/80 backdrop-blur-xs z-[9999] flex items-center justify-center p-4"
      >
        <div class="bg-[#0b211a] border border-[#143d30] rounded-3xl max-w-lg w-full p-6 space-y-5 text-white shadow-2xl">
          <div class="flex items-center justify-between border-b border-[#143d30] pb-3">
            <h3 class="text-sm font-bold flex items-center gap-2 text-emerald-400">
              <ImageIcon class="w-4 h-4" />
              <span>Sisipkan Foto ke Naskah Berita</span>
            </h3>
            <button @click="isImageModalOpen = false" class="text-slate-400 hover:text-white cursor-pointer">
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <!-- Thumbnail Preview -->
            <div class="relative rounded-2xl overflow-hidden border border-[#143d30] bg-[#071913] max-h-56 flex items-center justify-center">
              <img :src="imageModalForm.previewUrl" alt="Preview Foto" class="max-h-56 w-full object-cover" />
              <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-slate-300 font-mono">
                {{ imageModalForm.fileSize }}
              </span>
            </div>

            <!-- Input Keterangan Foto -->
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">
                Keterangan Foto (Caption) *
              </label>
              <input
                v-model="imageModalForm.caption"
                type="text"
                placeholder="Contoh: Suasana Pembukaan Muktamar di Pesantren Bahrul Ulum..."
                class="w-full px-4 py-2.5 rounded-xl bg-[#071913] border border-[#143d30] text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
              <p class="text-[10px] text-slate-400 mt-1">
                Keterangan ini akan tampil rapi di bagian bawah foto pada halaman pembaca.
              </p>
            </div>

            <div class="p-3 rounded-xl bg-[#071913] border border-[#143d30] text-[11px] text-slate-300 flex items-start gap-2">
              <Sparkles class="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Foto akan disisipkan dengan kode ringkas rapi di posisi kursor Anda, tanpa membuat naskah tulisan menjadi panjang.</span>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#143d30]">
            <button
              type="button"
              @click="isImageModalOpen = false"
              class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              @click="applyImageModal"
              class="px-5 py-2.5 rounded-xl bg-[#008f8a] hover:bg-[#007a75] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CheckCircle2 class="w-4 h-4" />
              <span>Sisipkan Foto</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </AdminLayout>
</template>
