import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/pages/HomePage.vue'),
        meta: { title: 'Beranda' },
      },
      {
        path: 'artikel',
        name: 'articles.index',
        component: () => import('@/pages/ArticlesPage.vue'),
        meta: { title: 'Daftar Artikel' },
      },
      {
        path: 'artikel/:slug',
        name: 'articles.show',
        component: () => import('@/pages/ArticleDetailPage.vue'),
        meta: { title: 'Detail Artikel' },
      },
      {
        path: 'kategori/:slug',
        name: 'categories.show',
        component: () => import('@/pages/CategoryPage.vue'),
        meta: { title: 'Kategori' },
      },
      {
        path: 'pengumuman',
        name: 'announcements.index',
        component: () => import('@/pages/AnnouncementsPage.vue'),
        meta: { title: 'Pengumuman & Agenda' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: '404 - Halaman Tidak Ditemukan' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0, behavior: 'smooth' }
  },
})

router.afterEach((to) => {
  const pageTitle = to.meta?.title as string | undefined
  document.title = pageTitle ? `${pageTitle} — Rojabiyyah` : 'Rojabiyyah'
})

export default router
