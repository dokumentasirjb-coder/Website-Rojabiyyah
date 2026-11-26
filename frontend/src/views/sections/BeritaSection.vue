<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Newspaper, Eye } from 'lucide-vue-next'
import { useNewsStore } from '@/stores/newsStore'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Article } from '@/types'

const router = useRouter()
const newsStore = useNewsStore()
const settingsStore = useSettingsStore()

// Hanya tampilkan berita yang berstatus Terbit (published) di halaman publik
const displayArticles = computed(() => {
  return (newsStore.articles || []).filter(a => a.status === 'published')
})

function handleArticleClick(article: Article) {
  router.push('/artikel/' + article.slug)
}
</script>

<template>
  <div class="bg-white">
    <!-- Top Hero Banner (Screenshot 4) -->
    <div class="relative bg-[#fbfbfa] border-b border-slate-100 overflow-hidden min-h-[280px] sm:min-h-[440px] flex items-center">
      <!-- Journalist with Mic Image with White Fade Overlay -->
      <div class="absolute inset-y-0 right-0 w-full sm:w-2/3 lg:w-3/5 z-0">
        <img
          :src="settingsStore.settings.banner_berita_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1400&q=80'"
          alt="Jurnalis Media Center Muktamar"
          class="w-full h-full object-cover object-center opacity-85"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#fbfbfa] via-[#fbfbfa]/75 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-[#fbfbfa] via-transparent to-transparent"></div>
      </div>

      <!-- Banner Header Text -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 relative z-10 w-full">
        <div v-reveal="{ y: 20, duration: 0.65 }" class="max-w-2xl space-y-3 sm:space-y-4">
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

    <!-- News Grid / Empty State -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-24">
      <!-- Empty State when no articles exist -->
      <div v-if="displayArticles.length === 0" class="py-16 sm:py-24 text-center max-w-lg mx-auto">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 text-[#008f8a] flex items-center justify-center border border-emerald-100 shadow-xs">
          <Newspaper class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold text-slate-800">Belum Ada Warta atau Berita</h3>
        <p class="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          Seluruh warta berita telah dihapus atau belum ada berita baru yang diterbitkan. Anda dapat menambahkan warta baru melalui menu admin.
        </p>
      </div>

      <!-- Articles Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
        <article
          v-for="(article, idx) in displayArticles"
          :key="article.id"
          v-reveal="{ y: 24, delay: (idx % 3) * 0.08 }"
          @click="handleArticleClick(article)"
          class="group flex flex-col justify-between cursor-pointer"
        >
          <div>
            <!-- Article Thumbnail Image -->
            <div class="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-slate-100 border border-slate-100">
              <img
                :src="article.cover_image || article.cover_image_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80'"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>

            <!-- Tag & Date & Views -->
            <div class="flex items-center justify-between text-xs mb-2">
              <div class="flex items-center gap-2">
                <span class="text-[#008f8a] font-bold tracking-wider uppercase text-[11px]">
                  {{ article.category?.name || 'LIPUTAN' }}
                </span>
                <span class="text-slate-400 text-xs font-light">
                  {{ article.published_at_formatted || '31 Agustus 2026' }}
                </span>
              </div>
              <span class="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                <Eye class="w-3.5 h-3.5" />
                <span>{{ article.view_count || 0 }}</span>
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-[#008f8a] line-clamp-2 leading-snug mb-2 transition-colors">
              {{ article.title }}
            </h2>

            <!-- Excerpt -->
            <p class="text-xs sm:text-[13px] text-slate-500 line-clamp-3 font-normal leading-relaxed">
              {{ article.excerpt }}
            </p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
