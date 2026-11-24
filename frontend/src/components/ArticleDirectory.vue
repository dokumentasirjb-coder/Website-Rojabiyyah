<script setup lang="ts">
import { Clock, Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight, SearchX, Newspaper } from 'lucide-vue-next'
import { useNewsStore } from '@/stores/newsStore'
import type { Article } from '@/types'

const newsStore = useNewsStore()

function handleArticleClick(article: Article) {
  newsStore.openArticle(article)
}

function changePage(page: number) {
  if (page < 1 || page > newsStore.pagination.last_page) return
  newsStore.fetchArticles(page)
  const el = document.getElementById('berita-muktamar')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section id="berita-muktamar" class="py-16 sm:py-20 bg-[#f8faf9] border-b border-slate-200 scroll-mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header & Filter Tabs -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5ee] text-[#006432] text-xs font-bold uppercase tracking-wider mb-2">
            <Newspaper class="w-3.5 h-3.5 text-[#c59b27]" />
            Warta & Publikasi Muktamar
          </div>
          <h2 class="text-2xl sm:text-4xl font-serif font-bold text-slate-900 leading-tight">
            Kabar Berita & Risalah Sidang
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 mt-1 font-light">
            Ikuti perkembangan informasi terkini, liputan persidangan, serta tausiyah ulama dari Jombang.
          </p>
        </div>

        <!-- Rubrik Filter Pills -->
        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            type="button"
            @click="newsStore.setCategory('')"
            class="px-4 py-2 rounded-xl font-semibold transition-all shrink-0 cursor-pointer"
            :class="[
              newsStore.activeCategory === ''
                ? 'bg-[#006432] text-white shadow-md shadow-[#006432]/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            ]"
          >
            Semua Warta
          </button>

          <button
            v-for="cat in newsStore.homeData.categories"
            :key="cat.id"
            type="button"
            @click="newsStore.setCategory(cat.slug)"
            class="px-4 py-2 rounded-xl font-semibold transition-all shrink-0 cursor-pointer"
            :class="[
              newsStore.activeCategory === cat.slug
                ? 'bg-[#006432] text-white shadow-md shadow-[#006432]/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            ]"
          >
            {{ cat.name }}
            <span v-if="cat.articles_count !== undefined" class="ml-1 opacity-75 text-[10px]">
              ({{ cat.articles_count }})
            </span>
          </button>
        </div>
      </div>

      <!-- Active Search Status -->
      <div v-if="newsStore.searchQuery" class="mt-6 flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 text-xs shadow-xs">
        <div class="text-slate-600">
          Hasil pencarian untuk: <strong class="text-[#006432]">"{{ newsStore.searchQuery }}"</strong>
          <span class="ml-2 font-normal text-slate-400">({{ newsStore.pagination.total }} berita ditemukan)</span>
        </div>
        <button
          type="button"
          @click="newsStore.setSearch('')"
          class="text-rose-600 hover:underline font-semibold cursor-pointer"
        >
          Hapus Pencarian
        </button>
      </div>

      <!-- Skeleton Loading State -->
      <div v-if="newsStore.isLoadingArticles" class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="i in 6" :key="i" class="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 animate-pulse">
          <div class="h-48 rounded-xl bg-slate-200"></div>
          <div class="h-4 w-1/3 bg-slate-200 rounded"></div>
          <div class="h-6 w-full bg-slate-200 rounded"></div>
          <div class="h-12 w-full bg-slate-100 rounded"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="newsStore.articles.length === 0" class="mt-12 text-center py-16 bg-white rounded-3xl border border-slate-200">
        <SearchX class="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 class="font-serif text-xl font-bold text-slate-800">Belum Ada Warta Ditemukan</h3>
        <p class="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Tidak ada artikel atau berita yang cocok dengan kriteria pencarian saat ini.
        </p>
        <button
          type="button"
          @click="() => { newsStore.setCategory(''); newsStore.setSearch(''); }"
          class="mt-4 px-5 py-2.5 rounded-xl bg-[#006432] text-white text-xs font-semibold hover:bg-[#0b7c43] cursor-pointer"
        >
          Lihat Semua Berita
        </button>
      </div>

      <!-- Article Grid -->
      <div v-else class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article
          v-for="article in newsStore.articles"
          :key="article.id"
          @click="handleArticleClick(article)"
          class="group bg-white rounded-3xl border border-slate-200 overflow-hidden p-5 shadow-xs hover:shadow-lg hover:border-[#006432]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
        >
          <div>
            <div class="relative h-52 rounded-2xl overflow-hidden mb-4 bg-slate-100">
              <img
                :src="article.cover_image"
                :alt="article.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span class="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#006432] text-white shadow-xs">
                {{ article.category?.name || 'Warta Muktamar' }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-[11px] text-slate-500 mb-2 font-light">
              <Calendar class="w-3.5 h-3.5 text-[#c59b27]" />
              <span>{{ article.published_at_formatted || 'Baru dirilis' }}</span>
              <span>•</span>
              <Clock class="w-3.5 h-3.5 text-[#006432]" />
              <span>{{ article.reading_time }}</span>
            </div>

            <h3 class="font-serif text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#006432] line-clamp-2 leading-snug mb-2.5 transition-colors">
              {{ article.title }}
            </h3>

            <p class="text-xs text-slate-500 line-clamp-3 font-light leading-relaxed">
              {{ article.excerpt }}
            </p>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-slate-500 text-[11px]">
              Oleh: <strong class="text-slate-700">{{ article.author?.name || 'Redaksi Muktamar' }}</strong>
            </span>
            <span class="inline-flex items-center gap-1 font-bold text-[#006432] group-hover:translate-x-1 transition-transform">
              Baca Warta <ArrowRight class="w-3.5 h-3.5" />
            </span>
          </div>
        </article>
      </div>

      <!-- Pagination -->
      <div v-if="newsStore.pagination.last_page > 1" class="mt-12 flex items-center justify-center gap-2">
        <button
          type="button"
          @click="changePage(newsStore.pagination.current_page - 1)"
          :disabled="newsStore.pagination.current_page <= 1"
          class="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Halaman Sebelumnya"
        >
          <ChevronLeft class="w-4 h-4" />
        </button>

        <span class="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700">
          Halaman {{ newsStore.pagination.current_page }} dari {{ newsStore.pagination.last_page }}
        </span>

        <button
          type="button"
          @click="changePage(newsStore.pagination.current_page + 1)"
          :disabled="newsStore.pagination.current_page >= newsStore.pagination.last_page"
          class="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Halaman Berikutnya"
        >
          <ChevronRight class="w-4 h-4" />
        </button>
      </div>
    </div>
  </section>
</template>
