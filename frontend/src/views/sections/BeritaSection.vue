<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Newspaper, Eye, TrendingUp, User } from 'lucide-vue-next'
import { useNewsStore } from '@/stores/newsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Article } from '@/types'

const router = useRouter()
const newsStore = useNewsStore()
const settingsStore = useSettingsStore()

const activeCategory = ref<string>('semua')

onMounted(() => {
  newsStore.fetchCategories()
})

// Hanya tampilkan berita yang berstatus Terbit (published) di halaman publik
const publishedArticles = computed(() => {
  return (newsStore.articles || []).filter((a) => a.status === 'published')
})

// 100% dinamis dari database (/api/v1/categories & artikel aktif) tanpa hardcoded
const categoryOptions = computed(() => {
  const seen = new Map<string, string>()
  for (const cat of newsStore.categories || []) {
    const name = cat?.name?.trim()
    if (name && !seen.has(name.toLowerCase())) {
      seen.set(name.toLowerCase(), name)
    }
  }
  for (const article of publishedArticles.value) {
    const catName = article.category?.name?.trim()
    if (catName && !seen.has(catName.toLowerCase())) {
      seen.set(catName.toLowerCase(), catName)
    }
  }
  return Array.from(seen.values())
})

const filteredArticles = computed(() => {
  if (activeCategory.value === 'semua') {
    return publishedArticles.value
  }
  const target = activeCategory.value.toLowerCase()
  return publishedArticles.value.filter(
    (a) => (a.category?.name || '').trim().toLowerCase() === target
  )
})

const popularArticles = computed(() => {
  const list = [...publishedArticles.value]
  list.sort((a, b) => {
    const viewsA = Number((a as any).views ?? a.view_count ?? 0)
    const viewsB = Number((b as any).views ?? b.view_count ?? 0)
    if (viewsB !== viewsA) return viewsB - viewsA
    if (Boolean(b.is_featured) !== Boolean(a.is_featured)) {
      return b.is_featured ? 1 : -1
    }
    return 0
  })
  return list.slice(0, 5)
})

function handleArticleClick(article: Article) {
  router.push('/artikel/' + article.slug)
}
</script>

<template>
  <div class="bg-white">
    <!-- Top Hero Banner -->
    <div class="relative bg-[#fbfbfa] border-b border-slate-100 overflow-hidden min-h-[260px] sm:min-h-[380px] flex items-center">
      <div class="absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-3/5 z-0 bg-gradient-to-br from-slate-100 to-emerald-50/40">
        <img
          v-if="settingsStore.settings.banner_berita_url"
          :src="settingsStore.settings.banner_berita_url"
          alt="Banner Berita dan Liputan"
          loading="lazy"
          decoding="async"
          class="w-full h-full object-cover object-center opacity-85"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#fbfbfa] via-[#fbfbfa]/75 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#fbfbfa] via-transparent to-transparent"></div>
      </div>

      <!-- Banner Header Text -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10 w-full">
        <div v-reveal class="max-w-2xl space-y-3 sm:space-y-4">
          <span class="inline-block text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#008f8a]">
            {{ settingsStore.settings.news_tag || 'KABAR TERBARU' }}
          </span>
          <h1 class="text-2xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            {{ settingsStore.settings.news_title || 'Berita & liputan' }}
          </h1>
          <p class="text-xs sm:text-base text-slate-600 font-normal leading-relaxed pt-0.5 sm:pt-1">
            {{ settingsStore.settings.news_subtitle || 'Ikuti perkembangan terkini, pengumuman resmi, dan liputan kegiatan Panitia Rojabiyyah & Haul Abah Ke-5.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Category Filter Bar -->
    <div class="border-b border-slate-100 bg-white sticky top-16 sm:top-20 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            @click="activeCategory = 'semua'"
            class="px-4 py-2 rounded-full font-semibold transition-colors shrink-0 cursor-pointer border"
            :class="[activeCategory === 'semua' ? 'bg-[#08253C] text-white border-[#08253C]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300']"
          >
            Semua ({{ publishedArticles.length }})
          </button>

          <button
            v-for="cat in categoryOptions"
            :key="cat"
            type="button"
            @click="activeCategory = cat"
            class="px-4 py-2 rounded-full font-semibold transition-colors shrink-0 cursor-pointer border"
            :class="[activeCategory.toLowerCase() === cat.toLowerCase() ? 'bg-[#08253C] text-white border-[#08253C]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300']"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <!-- News Grid & Sidebar Terpopuler -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div v-if="publishedArticles.length === 0" class="py-16 sm:py-24 text-center max-w-lg mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 text-[#008f8a] flex items-center justify-center border border-emerald-100 shadow-xs">
          <Newspaper class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold text-slate-800">Belum Ada Warta atau Berita</h3>
        <p class="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Seluruh warta berita telah dihapus atau belum ada berita baru yang diterbitkan. Anda dapat menambahkan warta baru melalui menu admin.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <!-- Main Column: Latest Filtered Articles (8 cols) -->
        <div class="lg:col-span-8">
          <div v-if="filteredArticles.length === 0" class="py-14 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 px-4">
            <p class="text-sm font-semibold text-slate-700">Belum ada berita pada kategori "{{ activeCategory }}".</p>
            <button
              type="button"
              @click="activeCategory = 'semua'"
              class="mt-3 px-4 py-2 rounded-xl bg-[#08253C] text-white text-xs font-semibold cursor-pointer hover:opacity-90"
            >
              Tampilkan Semua Berita
            </button>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <article
              v-for="article in filteredArticles"
              :key="article.id"
              v-reveal
              @click="handleArticleClick(article)"
              class="group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div class="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
                  <img
                    v-if="article.cover_image || article.cover_image_url"
                    :src="article.cover_image || article.cover_image_url || ''"
                    :alt="article.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#08253C]/10 to-emerald-50 text-[#08253C]/40">
                    <Newspaper class="w-10 h-10" />
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-[#008f8a] font-bold tracking-wider uppercase text-[11px]">
                      {{ article.category?.name || 'LIPUTAN' }}
                    </span>
                    <span class="text-slate-400 text-xs font-light">
                      {{ article.published_at_formatted || article.created_at_formatted || '' }}
                    </span>
                  </div>
                  <span class="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                    <Eye class="w-3.5 h-3.5" />
                    <span>{{ (article as any).views ?? article.view_count ?? 0 }}</span>
                  </span>
                </div>

                <h2 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#008f8a] line-clamp-2 leading-snug mb-2 transition-colors">
                  {{ article.title }}
                </h2>

                <p class="text-xs sm:text-[13px] text-slate-500 line-clamp-3 font-normal leading-relaxed">
                  {{ article.excerpt }}
                </p>

                <div class="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                  <User class="w-3.5 h-3.5 text-[#008f8a] shrink-0" />
                  <span class="font-semibold text-slate-700 truncate">
                    {{ article.author_name || article.author?.name || 'Admin Redaksi' }}
                  </span>
                  <span v-if="article.author_role || article.author?.role" class="text-slate-400 truncate">
                    • {{ article.author_role || article.author?.role }}
                  </span>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- Sidebar: Berita Terpopuler (4 cols) -->
        <aside class="lg:col-span-4 lg:sticky lg:top-24 self-start">
          <div class="rounded-2xl border border-slate-200/90 bg-[#fbfbfa] p-5 sm:p-6">
            <div class="flex items-center gap-2 pb-4 mb-4 border-b border-slate-200/80">
              <div class="w-8 h-8 rounded-lg bg-[#08253C] text-[#d4af37] flex items-center justify-center shrink-0">
                <TrendingUp class="w-4 h-4" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-slate-900 tracking-tight">Berita Terpopuler</h3>
                <p class="text-[11px] text-slate-500">Artikel paling banyak dibaca</p>
              </div>
            </div>

            <div class="divide-y divide-slate-200/70">
              <button
                v-for="(pop, idx) in popularArticles"
                :key="pop.id"
                type="button"
                @click="handleArticleClick(pop)"
                class="w-full text-left py-3.5 first:pt-0 last:pb-0 flex items-start gap-3 group cursor-pointer"
              >
                <span class="text-lg font-extrabold text-slate-300 group-hover:text-[#008f8a] transition-colors leading-none pt-0.5 w-6 shrink-0 tabular-nums">
                  {{ String(idx + 1).padStart(2, '0') }}
                </span>

                <div class="w-16 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0 border border-slate-200/70">
                  <img
                    v-if="pop.cover_image || pop.cover_image_url"
                    :src="pop.cover_image || pop.cover_image_url || ''"
                    :alt="pop.title"
                    loading="lazy"
                    decoding="async"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-[#08253C]/10 text-[#08253C]/40">
                    <Newspaper class="w-4 h-4" />
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#008f8a] mb-1">
                    <span class="truncate">{{ pop.category?.name || 'LIPUTAN' }}</span>
                    <span v-if="pop.published_at_formatted || pop.created_at_formatted" class="text-slate-400 font-normal normal-case shrink-0">
                      • {{ pop.published_at_formatted || pop.created_at_formatted }}
                    </span>
                  </div>
                  <h4 class="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-[#008f8a] line-clamp-2 leading-snug transition-colors">
                    {{ pop.title }}
                  </h4>
                </div>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
