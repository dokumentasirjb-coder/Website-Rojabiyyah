import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'
import type { Article, HomeData, PaginationMeta } from '@/types'

function inlineMediaMapIntoContent(content: string, mediaMap?: Record<string, string>): string {
  if (!content || !mediaMap) return content
  let result = content
  for (const [key, dataUrl] of Object.entries(mediaMap)) {
    if (key && dataUrl) {
      result = result.split(`](${key})`).join(`](${dataUrl})`)
    }
  }
  return result
}

export const useNewsStore = defineStore('news', () => {
  const articles = ref<Article[]>([])
  const currentArticle = ref<Article | null>(null)
  const selectedArticle = ref<Article | null>(null)
  const relatedArticles = ref<Article[]>([])
  const isModalOpen = ref(false)
  const homeData = ref<HomeData>({
    hero: null,
    highlights: [],
    latest: [],
    categories: [],
    announcements: [],
  })

  const pagination = ref<PaginationMeta>({
    current_page: 1,
    last_page: 1,
    per_page: 50,
    total: 0,
  })

  const activeCategory = ref<string>('')
  const searchQuery = ref<string>('')

  const isLoadingHome = ref(false)
  const isLoadingArticles = ref(false)
  const isLoadingDetail = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)

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

  let inFlightArticlesFetch: Promise<void> | null = null

  async function fetchArticles(page = 1, category = activeCategory.value, search = searchQuery.value, force = false) {
    if (inFlightArticlesFetch && !force) return inFlightArticlesFetch

    inFlightArticlesFetch = (async () => {
      isLoadingArticles.value = true
      error.value = null
      try {
        const hasAdminToken = typeof window !== 'undefined' && !!localStorage.getItem('admin_token')
        const endpoint = hasAdminToken ? '/admin/articles' : '/articles'
        const params: Record<string, string | number> = { page, per_page: 50 }
        if (category) params.category = category
        if (search && search.trim()) params.search = search.trim()

        const response = await api.get<{ data: Article[]; meta?: PaginationMeta }>(endpoint, { params })
        const list = Array.isArray(response.data?.data) ? response.data.data : []
        articles.value = list
        pagination.value = response.data?.meta || {
          current_page: page,
          last_page: 1,
          per_page: 50,
          total: list.length,
        }
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Gagal memuat daftar berita dari server.'
      } finally {
        isLoadingArticles.value = false
        inFlightArticlesFetch = null
      }
    })()

    return inFlightArticlesFetch
  }

  async function fetchArticleBySlug(slug: string) {
    isLoadingDetail.value = true
    error.value = null
    try {
      const response = await api.get<{ success: boolean; data: any }>(`/articles/${slug}`)
      const article: Article | null = response.data?.data?.article ?? response.data?.data ?? response.data ?? null
      currentArticle.value = article
      selectedArticle.value = article

      const related = response.data?.data?.related_articles
      if (Array.isArray(related)) {
        relatedArticles.value = related
      }

      if (article && article.id) {
        const idx = articles.value.findIndex(a => a.id === article.id || a.slug === article.slug)
        if (idx >= 0) {
          articles.value[idx] = article
        } else {
          articles.value.unshift(article)
        }
      }
    } catch (err: any) {
      currentArticle.value = null
      selectedArticle.value = null
      error.value = err.response?.data?.message || 'Artikel tidak ditemukan.'
    } finally {
      isLoadingDetail.value = false
    }
  }

  async function saveArticle(
    articleData: Partial<Article> & { title: string; id?: number; category_id?: number }
  ): Promise<{ success: boolean; message?: string }> {
    isSaving.value = true
    error.value = null
    try {
      const resolvedContent = inlineMediaMapIntoContent(articleData.content || '', articleData.mediaMap)
      const payload = {
        title: articleData.title.trim(),
        category_id: articleData.category_id || articleData.category?.id || 1,
        content: resolvedContent,
        excerpt: articleData.excerpt || '',
        status: articleData.status || 'published',
        is_featured: Boolean(articleData.is_featured),
        cover_image: articleData.cover_image || articleData.cover_image_url || '',
      }

      if (articleData.id) {
        await api.put(`/admin/articles/${articleData.id}`, payload)
      } else {
        await api.post('/admin/articles', payload)
      }

      await fetchArticles(1, activeCategory.value, searchQuery.value, true)
      return {
        success: true,
        message: payload.status === 'published' ? 'Berita berhasil diterbitkan ke database!' : 'Draf berita berhasil disimpan!',
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menyimpan berita ke server database.'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      isSaving.value = false
    }
  }

  async function deleteArticle(id: number): Promise<{ success: boolean; message?: string }> {
    try {
      await api.delete(`/admin/articles/${id}`)
      await fetchArticles(1, activeCategory.value, searchQuery.value, true)
      return { success: true, message: 'Berita berhasil dihapus dari database!' }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menghapus berita di server.'
      error.value = msg
      return { success: false, message: msg }
    }
  }

  async function toggleArticleStatus(articleOrId: Article | number): Promise<{ success: boolean; message?: string }> {
    const target = typeof articleOrId === 'number'
      ? articles.value.find(a => a.id === articleOrId)
      : articleOrId
    if (!target) return { success: false, message: 'Artikel tidak ditemukan.' }
    const newStatus = target.status === 'published' ? 'draft' : 'published'
    try {
      await api.put(`/admin/articles/${target.id}`, { status: newStatus })
      await fetchArticles(1, activeCategory.value, searchQuery.value, true)
      return { success: true }
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Gagal mengubah status berita.' }
    }
  }

  async function openArticle(slugOrArticle: string | Article) {
    if (typeof slugOrArticle === 'string') {
      await fetchArticleBySlug(slugOrArticle)
      selectedArticle.value = currentArticle.value
    } else {
      selectedArticle.value = slugOrArticle
      currentArticle.value = slugOrArticle
    }
    relatedArticles.value = articles.value
      .filter(a => a.id !== selectedArticle.value?.id && a.status === 'published')
      .slice(0, 3)
    isModalOpen.value = true
  }

  function closeArticleModal() {
    isModalOpen.value = false
  }

  function incrementViewCount(slugOrId: string | number) {
    const found = articles.value.find(a => a.id === slugOrId || a.slug === slugOrId)
    if (found) found.view_count = (found.view_count || 0) + 1
    if (currentArticle.value && (currentArticle.value.id === slugOrId || currentArticle.value.slug === slugOrId)) {
      currentArticle.value.view_count = (currentArticle.value.view_count || 0) + 1
    }
  }

  async function clearAllArticles(): Promise<{ success: boolean; message?: string }> {
    try {
      for (const art of articles.value) {
        await api.delete(`/admin/articles/${art.id}`)
      }
      await fetchArticles(1, activeCategory.value, searchQuery.value, true)
      return { success: true, message: 'Seluruh berita berhasil dihapus dari database!' }
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Gagal mengosongkan berita.' }
    }
  }

  function setCategory(slug: string) {
    activeCategory.value = slug
    fetchArticles(1, slug, searchQuery.value, true)
  }

  function setSearch(query: string) {
    searchQuery.value = query
    fetchArticles(1, activeCategory.value, query, true)
  }

  return {
    articles,
    currentArticle,
    selectedArticle,
    relatedArticles,
    isModalOpen,
    homeData,
    pagination,
    activeCategory,
    searchQuery,
    isLoadingHome,
    isLoadingArticles,
    isLoadingDetail,
    isSaving,
    error,
    fetchHome,
    fetchArticles,
    fetchArticleBySlug,
    saveArticle,
    deleteArticle,
    toggleArticleStatus,
    clearAllArticles,
    openArticle,
    closeArticleModal,
    incrementViewCount,
    setCategory,
    setSearch,
  }
})
