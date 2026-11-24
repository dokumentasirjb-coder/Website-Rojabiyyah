import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes: RouteRecordRaw[] = [
  // ============================================================
  // PUBLIC ROUTES (5 Views: Beranda, Tentang, Agenda, Berita, Galeri)
  // ============================================================
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Muktamar ke-35 Nahdlatul Ulama — Beranda',
    },
  },
  {
    path: '/tentang',
    name: 'tentang',
    component: () => import('@/views/TentangView.vue'),
    meta: {
      title: 'Tentang — Muktamar ke-35 Nahdlatul Ulama',
    },
  },
  {
    path: '/agenda',
    name: 'agenda',
    component: () => import('@/views/AgendaView.vue'),
    meta: {
      title: 'Agenda — Muktamar ke-35 Nahdlatul Ulama',
    },
  },
  {
    path: '/berita',
    name: 'berita',
    component: () => import('@/views/BeritaView.vue'),
    meta: {
      title: 'Berita & Liputan — Muktamar ke-35 Nahdlatul Ulama',
    },
  },
  {
    path: '/galeri',
    name: 'galeri',
    component: () => import('@/views/GaleriView.vue'),
    meta: {
      title: 'Galeri — Muktamar ke-35 Nahdlatul Ulama',
    },
  },
  {
    path: '/informasi',
    name: 'informasi',
    component: () => import('@/views/InformasiView.vue'),
    meta: {
      title: 'Informasi Umum — Panitia Rojabiyyah',
    },
  },
  {
    path: '/artikel/:slug',
    name: 'article.detail',
    component: () => import('@/views/ArticleDetailView.vue'),
    meta: {
      title: 'Detail Warta — Muktamar ke-35 Nahdlatul Ulama',
    },
  },

  // ============================================================
  // CMS AUTHENTICATION & ADMIN
  // ============================================================
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      title: 'Masuk — CMS Muktamar NU',
      guestOnly: true,
    },
  },
  {
    path: '/admin',
    redirect: '/admin/content',
  },
  {
    path: '/admin/content',
    name: 'admin.content',
    component: () => import('@/views/AdminContentHubView.vue'),
    meta: {
      title: 'Konten Situs — CMS Muktamar',
      requiresAuth: true,
    },
  },
  {
    path: '/admin/articles',
    name: 'admin.articles',
    redirect: { path: '/admin/content', query: { tab: 'berita' } },
  },
  {
    path: '/admin/announcements',
    name: 'admin.announcements',
    redirect: { path: '/admin/content', query: { tab: 'agenda' } },
  },
  {
    path: '/admin/gallery',
    name: 'admin.gallery',
    redirect: { path: '/admin/content', query: { tab: 'galeri' } },
  },
  {
    path: '/admin/settings',
    name: 'admin.settings',
    component: () => import('@/views/AdminSettingsView.vue'),
    meta: {
      title: 'Pengaturan Tampilan Situs — CMS',
      requiresAuth: true,
    },
  },

  // Fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
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

// Navigation Guard
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('admin_token')
  if (to.meta.requiresAuth && !token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }
  if (to.meta.guestOnly && token) {
    return next('/admin/articles')
  }
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  next()
})

export default router
