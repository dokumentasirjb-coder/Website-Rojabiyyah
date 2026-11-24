import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'
import { idbGet, idbSet } from '@/lib/idb'
import type { Article, Category, Announcement, HomeData, PaginationMeta } from '@/types'

export const DEFAULT_ARTICLES: Article[] = [
  {
    id: 101,
    title: 'Profil Ketua Umum PBNU KH Abdul Hakim Mahfudz: Meneruskan Warisan Ulama Besar',
    slug: 'profil-ketua-umum-pbnu-kh-abdul-hakim-mahfudz',
    excerpt: 'Usai menyelesaikan pendidikan menengah, Gus Kikin memilih jalur pendidikan yang cukup unik bagi seorang putra kiai pesantren terkemuka.',
    content: '<p>Usai menyelesaikan pendidikan menengah, Gus Kikin memilih jalur pendidikan yang cukup unik bagi seorang putra kiai pesantren terkemuka. Beliau memadukan integritas pesantren dengan kepemimpinan modern.</p>',
    cover_image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    status: 'published',
    view_count: 1420,
    reading_time_minutes: 4,
    created_at: '2026-08-31',
    created_at_formatted: '31 Agustus 2026',
    published_at_human: 'Hari ini',
    category: { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
    author: { id: 1, name: 'Tim Redaksi Muktamar', role: 'Jurnalis', avatar: null, bio: null },
    published_at: '2026-08-31',
    published_at_formatted: '31 Agustus 2026',
    reading_time: '4 menit baca'
  },
  {
    id: 102,
    title: 'KH Abdul Hakim Mahfudz Resmi Terpilih Jadi Ketua Umum PBNU',
    slug: 'kh-abdul-hakim-mahfudz-resmi-terpilih-jadi-ketua-umum-pbnu',
    excerpt: 'KH. Abdul Hakim Mahfudz berhasil memuncaki tabulasi dengan 472 suara usulan, jauh meninggalkan kandidat lainnya dalam sidang pleno pemilihan.',
    content: '<p>KH. Abdul Hakim Mahfudz berhasil memuncaki tabulasi dengan 472 suara usulan, jauh meninggalkan kandidat lainnya dalam sidang pleno pemilihan yang berlangsung khidmat di arena utama.</p>',
    cover_image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
    is_featured: true,
    status: 'published',
    view_count: 3200,
    reading_time_minutes: 3,
    created_at: '2026-08-31',
    created_at_formatted: '31 Agustus 2026',
    published_at_human: 'Hari ini',
    category: { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
    author: { id: 1, name: 'Tim Redaksi Muktamar', role: 'Jurnalis', avatar: null, bio: null },
    published_at: '2026-08-31',
    published_at_formatted: '31 Agustus 2026',
    reading_time: '3 menit baca'
  },
  {
    id: 103,
    title: 'Mengenal KH Miftachul Akhyar, Rais Aam PBNU Terpilih di Muktamar ke-35 NU',
    slug: 'mengenal-kh-miftachul-akhyar-rais-aam-pbnu-terpilih',
    excerpt: 'KH Miftachul Akhyar bukan hanya sebagai figur struktural dalam tubuh NU. Pada sisi yang lain, beliau adalah pengasuh pesantren yang tekun membina santri.',
    content: '<p>KH Miftachul Akhyar bukan hanya sebagai figur struktural dalam tubuh NU. Pada sisi yang lain, beliau adalah pengasuh pesantren yang tekun membina santri dan menjaga keilmuan salaf.</p>',
    cover_image: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=800&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=800&q=80',
    is_featured: false,
    status: 'published',
    view_count: 1850,
    reading_time_minutes: 5,
    created_at: '2026-08-31',
    created_at_formatted: '31 Agustus 2026',
    published_at_human: 'Hari ini',
    category: { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
    author: { id: 1, name: 'Tim Redaksi Muktamar', role: 'Jurnalis', avatar: null, bio: null },
    published_at: '2026-08-31',
    published_at_formatted: '31 Agustus 2026',
    reading_time: '5 menit baca'
  },
  {
    id: 104,
    title: 'KH Miftachul Akhyar Kembali Terpilih sebagai Rais Aam PBNU 2026–2031',
    slug: 'kh-miftachul-akhyar-kembali-terpilih-sebagai-rais-aam',
    excerpt: 'Pemilihan Rais Aam Pengurus Besar Nahdlatul Ulama (PBNU) periode 2026–2031 berlangsung melalui musyawarah mufakat 9 kiai sepuh AHWA.',
    content: '<p>Pemilihan Rais Aam Pengurus Besar Nahdlatul Ulama (PBNU) periode 2026–2031 berlangsung melalui musyawarah mufakat 9 kiai sepuh AHWA yang berlangsung penuh keteduhan.</p>',
    cover_image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    is_featured: false,
    status: 'published',
    view_count: 2100,
    reading_time_minutes: 4,
    created_at: '2026-08-31',
    created_at_formatted: '31 Agustus 2026',
    published_at_human: 'Hari ini',
    category: { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
    author: { id: 1, name: 'Tim Redaksi Muktamar', role: 'Jurnalis', avatar: null, bio: null },
    published_at: '2026-08-31',
    published_at_formatted: '31 Agustus 2026',
    reading_time: '4 menit baca'
  },
  {
    id: 105,
    title: 'Demisioner dari PBNU, Gus Yahya: Alhamdulillah Akhiri Khidmat dengan Kelegaan',
    slug: 'demisioner-dari-pbnu-gus-yahya-akhiri-khidmat',
    excerpt: 'Dalam pidatonya, Ketua Umum PBNU KH Yahya Cholil Staquf atau Gus Yahya bersyukur dapat menyelesaikan amanah kepengurusan lima tahun penuh dinamika.',
    content: '<p>Dalam pidatonya, Ketua Umum PBNU KH Yahya Cholil Staquf atau Gus Yahya bersyukur dapat menyelesaikan amanah kepengurusan lima tahun penuh dinamika dengan capaian kelembagaan yang kokoh.</p>',
    cover_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    is_featured: false,
    status: 'published',
    view_count: 1670,
    reading_time_minutes: 3,
    created_at: '2026-08-31',
    created_at_formatted: '31 Agustus 2026',
    published_at_human: 'Hari ini',
    category: { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
    author: { id: 1, name: 'Tim Redaksi Muktamar', role: 'Jurnalis', avatar: null, bio: null },
    published_at: '2026-08-31',
    published_at_formatted: '31 Agustus 2026',
    reading_time: '3 menit baca'
  },
  {
    id: 106,
    title: '9 Kiai Khos AHWA Putuskan Rais Aam PBNU di Ndalem KH Wahab Hasbullah',
    slug: '9-kiai-khos-ahwa-putuskan-rais-aam-pbnu',
    excerpt: 'Sembilan kiai khos anggota AHWA hasil Muktamar ke-35 Nahdlatul Ulama tengah bermusyawarah mufakat menentukan Rais Aam.',
    content: '<p>Sembilan kiai khos anggota AHWA hasil Muktamar ke-35 Nahdlatul Ulama tengah bermusyawarah mufakat menentukan Rais Aam terpilih yang akan mengemban amanah keulamaan.</p>',
    cover_image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    cover_image_url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    is_featured: false,
    status: 'published',
    view_count: 2400,
    reading_time_minutes: 4,
    created_at: '2026-08-30',
    created_at_formatted: '30 Agustus 2026',
    published_at_human: 'Kemarin',
    category: { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
    author: { id: 1, name: 'Tim Redaksi Muktamar', role: 'Jurnalis', avatar: null, bio: null },
    published_at: '2026-08-30',
    published_at_formatted: '30 Agustus 2026',
    reading_time: '4 menit baca'
  }
]

const STORAGE_KEY = 'muktamar_news_articles_v3'
const SEEDED_KEY = 'muktamar_news_seeded_v3'

// Fungsi pembersih duplikat: pastikan tidak ada 2 artikel dengan ID atau Judul/Slug yang sama
function deduplicateArticles(list: Article[]): Article[] {
  if (!Array.isArray(list)) return []
  const seenIds = new Set<string>()
  const seenTitles = new Set<string>()
  const result: Article[] = []

  for (const art of list) {
    if (!art) continue
    const idKey = String(art.id)
    const titleKey = (art.slug || art.title || '').trim().toLowerCase()

    if (!seenIds.has(idKey) && (!titleKey || !seenTitles.has(titleKey))) {
      seenIds.add(idKey)
      if (titleKey) seenTitles.add(titleKey)
      result.push(art)
    }
  }
  return result
}

export const useNewsStore = defineStore('news', () => {
  const isSeeded = typeof window !== 'undefined' && localStorage.getItem(SEEDED_KEY) === 'true'
  const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null

  let initialArticles: Article[] = []
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialArticles = deduplicateArticles(parsed)
      } else {
        initialArticles = DEFAULT_ARTICLES
      }
    } catch {
      initialArticles = DEFAULT_ARTICLES
    }
  } else {
    initialArticles = DEFAULT_ARTICLES
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SEEDED_KEY, 'true')
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ARTICLES))
      } catch {
        // ignore
      }
    }
  }

  const homeData = ref<HomeData>({
    hero: null,
    highlights: [],
    latest: [],
    categories: [],
    announcements: [],
  })

  const articles = ref<Article[]>(initialArticles)
  const pagination = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: initialArticles.length,
  })

  const selectedArticle = ref<Article | null>(null)
  const relatedArticles = ref<Article[]>([])
  const isModalOpen = ref(false)

  const activeCategory = ref<string>('')
  const searchQuery = ref<string>('')

  const isLoadingHome = ref(false)
  const isLoadingArticles = ref(false)
  const isLoadingDetail = ref(false)
  const error = ref<string | null>(null)

  // Sinkronisasi data berkualitas tinggi dari IndexedDB saat startup (mengatasi batas kuota 5MB LocalStorage)
  if (typeof window !== 'undefined') {
    idbGet<Article[]>(STORAGE_KEY).then((idbData) => {
      if (Array.isArray(idbData) && idbData.length > 0) {
        articles.value = deduplicateArticles(idbData)
        pagination.value.total = articles.value.length
      }
    }).catch(() => {})

    // Dengarkan perubahan antar tab browser agar halaman publik otomatis update saat admin menghapus/menambah artikel
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) {
            articles.value = deduplicateArticles(parsed)
            pagination.value.total = articles.value.length
          }
        } catch {}
      }
    })

    window.addEventListener('news-store-updated', () => {
      reloadFromStorage()
    })
  }

  function reloadFromStorage() {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          articles.value = deduplicateArticles(parsed)
          pagination.value.total = articles.value.length
        }
      } catch {}
    }
  }

  function persist() {
    articles.value = deduplicateArticles(articles.value)
    pagination.value.total = articles.value.length

    if (typeof window !== 'undefined') {
      // 1. Simpan salinan lengkap termasuk gambar ke IndexedDB (tidak ada batas kuota 5MB)
      try {
        idbSet(STORAGE_KEY, JSON.parse(JSON.stringify(articles.value))).catch(() => {})
      } catch {}

      // 2. Simpan ke LocalStorage untuk akses sinkron cepat
      try {
        localStorage.setItem(SEEDED_KEY, 'true')
        localStorage.setItem(STORAGE_KEY, JSON.stringify(articles.value))
      } catch (e) {
        console.warn('LocalStorage quota limit reached, saving optimized version:', e)
        // Jika base64 terlalu besar, simpan ringkasan agar status dan daftar artikel tetap konsisten
        try {
          const lightweight = articles.value.map(a => ({
            ...a,
            content: a.content?.substring(0, 500) || '',
            mediaMap: {}
          }))
          localStorage.setItem(STORAGE_KEY, JSON.stringify(lightweight))
        } catch {}
      }

      // 3. Kabarkan ke seluruh tab / halaman bahwa daftar berita telah berubah
      try {
        window.dispatchEvent(new CustomEvent('news-store-updated'))
      } catch {}
    }
  }

  async function fetchHome() {
    isLoadingHome.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: HomeData }>('/home')
      if (response.data?.data) {
        homeData.value = response.data.data
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Gagal memuat data beranda.'
    } finally {
      isLoadingHome.value = false
    }
  }

  async function fetchArticles(page = 1, category = activeCategory.value, search = searchQuery.value) {
    isLoadingArticles.value = true
    error.value = null
    try {
      const params: Record<string, string | number> = { page, per_page: 15 }
      if (category) params.category = category
      if (search && search.trim()) params.search = search.trim()

      const response = await api.get<{ data: Article[]; meta?: PaginationMeta }>('/articles', { params })
      if (response.data?.data && response.data.data.length > 0) {
        // Gabungkan artikel dari server dengan artikel lokal yang dibuat pengguna
        const localMap = new Map(articles.value.map(a => [String(a.id), a]))
        const localSlugMap = new Map(articles.value.map(a => [a.slug, a]))

        const mergedServerArticles = response.data.data.map(serverArt => {
          const localArt = localMap.get(String(serverArt.id)) || localSlugMap.get(serverArt.slug)
          if (localArt) {
            const hasLocalCover = localArt.cover_image && 
              (localArt.cover_image.startsWith('data:') || !localArt.cover_image.includes('1585829365295'))
            const serverHasTypewriter = !serverArt.cover_image || serverArt.cover_image.includes('1585829365295')

            return {
              ...serverArt,
              cover_image: (hasLocalCover && serverHasTypewriter) ? localArt.cover_image : (serverArt.cover_image || localArt.cover_image),
              cover_image_url: (hasLocalCover && serverHasTypewriter) ? (localArt.cover_image_url || localArt.cover_image) : (serverArt.cover_image_url || serverArt.cover_image || localArt.cover_image),
              mediaMap: { ...(localArt.mediaMap || {}), ...(serverArt.mediaMap || {}) }
            }
          }
          return serverArt
        })

        const remoteIds = new Set(response.data.data.map(a => String(a.id)))
        const localOnly = articles.value.filter(a => !remoteIds.has(String(a.id)))
        articles.value = deduplicateArticles([...localOnly, ...mergedServerArticles])
        persist()
      }
    } catch (err: any) {
      // Offline fallback: muat ulang dari storage lokal dan pastikan ter-deduplikasi
      reloadFromStorage()
    } finally {
      isLoadingArticles.value = false
    }
  }

  async function fetchArticleBySlug(slug: string) {
    isLoadingDetail.value = true
    error.value = null
    try {
      const response = await api.get<{
        success: boolean
        data: { article: Article; related_articles: Article[] }
      }>(`/articles/${slug}`)

      if (response.data?.data) {
        selectedArticle.value = response.data.data.article
        relatedArticles.value = response.data.data.related_articles || []
        isModalOpen.value = true
      }
    } catch (err: any) {
      // Local fallback
      const found = articles.value.find(a => a.slug === slug)
      if (found) {
        selectedArticle.value = found
        relatedArticles.value = articles.value.filter(a => a.slug !== slug).slice(0, 3)
      }
    } finally {
      isLoadingDetail.value = false
    }
  }

  async function saveArticle(articleData: Partial<Article>) {
    let savedArticle: Article | null = null

    // Pastikan foto sampul yang diunggah pengguna disimpan seutuhnya (tidak diganti foto mesin tik default)
    const cover = (articleData.cover_image && articleData.cover_image.trim())
      ? articleData.cover_image.trim()
      : ((articleData.cover_image_url && articleData.cover_image_url.trim()) ? articleData.cover_image_url.trim() : 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80')

    if (articleData.id) {
      // Update existing
      const idx = articles.value.findIndex(a => String(a.id) === String(articleData.id))
      if (idx !== -1) {
        articles.value[idx] = {
          ...articles.value[idx],
          ...articleData,
          cover_image: cover,
          cover_image_url: cover,
          category: articleData.category || articles.value[idx].category,
          author: articleData.author || articles.value[idx].author,
          tags: articleData.tags !== undefined ? articleData.tags : articles.value[idx].tags,
          metaTitle: articleData.metaTitle !== undefined ? articleData.metaTitle : articles.value[idx].metaTitle,
          metaDescription: articleData.metaDescription !== undefined ? articleData.metaDescription : articles.value[idx].metaDescription,
          mediaMap: articleData.mediaMap !== undefined ? articleData.mediaMap : (articles.value[idx].mediaMap || {})
        } as Article
        savedArticle = articles.value[idx]
      }
    } else {
      // Create new article
      const newId = Date.now()
      const newSlug = articleData.slug || articleData.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `berita-${newId}`

      // Cegah duplikat: jika sudah ada artikel dengan judul atau slug yang sama persis, perbarui saja!
      const existingIdx = articles.value.findIndex(a => 
        (a.slug && a.slug === newSlug) || 
        (a.title && articleData.title && a.title.trim().toLowerCase() === articleData.title.trim().toLowerCase())
      )
      if (existingIdx !== -1) {
        articles.value[existingIdx] = {
          ...articles.value[existingIdx],
          ...articleData,
          cover_image: cover,
          cover_image_url: cover,
          slug: newSlug,
          category: articleData.category || articles.value[existingIdx].category,
          author: articleData.author || articles.value[existingIdx].author,
          mediaMap: articleData.mediaMap || articles.value[existingIdx].mediaMap || {},
        } as Article
        savedArticle = articles.value[existingIdx]
        persist()
        return true
      }

      savedArticle = {
        id: newId,
        title: articleData.title || 'Judul Berita',
        slug: newSlug,
        excerpt: articleData.excerpt || '',
        content: articleData.content || '',
        mediaMap: articleData.mediaMap || {},
        cover_image: cover,
        cover_image_url: cover,
        is_featured: !!articleData.is_featured,
        status: (articleData.status as any) || 'published',
        view_count: 0,
        reading_time_minutes: Math.max(1, Math.ceil((articleData.content?.length || 500) / 500)),
        created_at: new Date().toISOString(),
        created_at_formatted: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        published_at_human: 'Baru saja',
        category: articleData.category || { id: 1, name: 'LIPUTAN', slug: 'liputan', description: null, color: '#008f8a', icon: null, sort_order: 1, is_active: true },
        author: articleData.author || { id: 1, name: 'Admin Redaksi', role: 'Redaktur', avatar: null, bio: null },
        tags: articleData.tags || '',
        metaTitle: articleData.metaTitle || '',
        metaDescription: articleData.metaDescription || '',
        published_at: new Date().toISOString(),
        published_at_formatted: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        reading_time: `${Math.max(1, Math.ceil((articleData.content?.length || 500) / 500))} menit baca`
      }
      articles.value.unshift(savedArticle)
    }

    persist()

    // Upaya sinkronisasi ke backend API (jika server Laravel aktif)
    try {
      const payload = {
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        status: articleData.status || 'published',
        is_featured: articleData.is_featured ? 1 : 0,
        category_id: articleData.category?.id || 1,
        slug: articleData.slug,
        cover_image: cover
      }
      if (articleData.id && typeof articleData.id === 'number' && articleData.id < 1000000000) {
        await api.put(`/admin/articles/${articleData.id}`, payload)
      } else {
        const res = await api.post('/admin/articles', payload)
        if (res.data?.data?.id && savedArticle) {
          savedArticle.id = res.data.data.id
          persist()
        }
      }
    } catch {
      // Offline fallback: tetap sukses tersimpan di memori & localStorage & IndexedDB
    }

    return true
  }

  function incrementViewCount(slug: string) {
    const art = articles.value.find(a => a.slug === slug)
    if (art) {
      art.view_count = (art.view_count || 0) + 1
      persist()
    }
  }

  async function deleteArticle(id: number | string) {
    const targetId = String(id)
    articles.value = articles.value.filter(a => String(a.id) !== targetId)
    persist()

    // Upaya sinkronisasi hapus ke backend Laravel jika aktif
    try {
      if (typeof id === 'number' && id < 1000000000) {
        await api.delete(`/admin/articles/${id}`)
      }
    } catch {
      // Offline fallback
    }

    return true
  }

  function toggleArticleStatus(id: number | string) {
    const targetId = String(id)
    const art = articles.value.find(a => String(a.id) === targetId)
    if (art) {
      art.status = art.status === 'published' ? 'draft' : 'published'
      persist()
    }
  }

  function openArticle(article: Article) {
    selectedArticle.value = article
    relatedArticles.value = []
    isModalOpen.value = true
    fetchArticleBySlug(article.slug)
  }

  function closeArticleModal() {
    isModalOpen.value = false
    selectedArticle.value = null
    relatedArticles.value = []
  }

  function setCategory(slug: string) {
    activeCategory.value = slug
    fetchArticles(1, slug, searchQuery.value)
  }

  function setSearch(query: string) {
    searchQuery.value = query
    fetchArticles(1, activeCategory.value, query)
  }

  function clearAllArticles() {
    articles.value = []
    persist()
  }

  return {
    homeData,
    articles,
    pagination,
    selectedArticle,
    relatedArticles,
    isModalOpen,
    activeCategory,
    searchQuery,
    isLoadingHome,
    isLoadingArticles,
    isLoadingDetail,
    error,
    fetchHome,
    fetchArticles,
    fetchArticleBySlug,
    saveArticle,
    deleteArticle,
    clearAllArticles,
    incrementViewCount,
    toggleArticleStatus,
    openArticle,
    closeArticleModal,
    setCategory,
    setSearch,
  }
})

