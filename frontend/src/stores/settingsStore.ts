import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'
import type { SiteSettings, GalleryAlbum, ScheduleDay, AboutStructureItem, AboutParagraphItem } from '@/types'

export const DEFAULT_ABOUT_STRUCTURE_ITEMS: AboutStructureItem[] = []
export const DEFAULT_ABOUT_HISTORY_PARAGRAPHS: AboutParagraphItem[] = []
export const DEFAULT_GALLERY_ALBUMS: GalleryAlbum[] = []
export const DEFAULT_SCHEDULE_DAYS: ScheduleDay[] = []

export const EMPTY_SETTINGS: SiteSettings = {
  site_title: '',
  site_subtitle: '',
  navbar_badge: '',
  favicon_url: '',
  logo_image_url: '',
  topbar_date: '',
  topbar_location: '',
  banner_beranda_url: '',
  banner_tentang_url: '',
  banner_agenda_url: '',
  banner_berita_url: '',
  banner_galeri_url: '',
  banner_informasi_url: '',
  hero_headline_1: '',
  hero_headline_2: '',
  hero_headline_3: '',
  hero_tagline: '',
  about_tag: '',
  about_title: '',
  about_subtitle: '',
  about_section_label: '',
  about_section_title: '',
  about_paragraph_1: '',
  about_paragraph_2: '',
  about_paragraph_3: '',
  about_history_label: '',
  about_history_title: '',
  about_quote_label: '',
  about_quote_text: '',
  about_quote_location: '',
  about_structure_items_json: [],
  about_history_paragraphs_json: [],
  about_section_enabled: true,
  about_history_enabled: true,
  about_quote_enabled: true,
  agenda_tag: '',
  agenda_title: '',
  agenda_subtitle: '',
  news_tag: '',
  news_title: '',
  news_subtitle: '',
  gallery_tag: '',
  gallery_title: '',
  gallery_subtitle: '',
  footer_description: '',
  footer_quote: '',
  footer_copyright: 'Panitia Rojabiyyah',
  contact_address: '',
  contact_email: '',
  contact_phone: '',
  contact_hours: '',
  social_instagram: '',
  social_youtube: '',
  social_facebook: '',
  social_twitter: '',
  social_tiktok: '',
  social_whatsapp: '',
  theme_preset: 'navy-rojabiyyah',
  primary_color: '#08253C',
  primary_hover_color: '#0c3556',
  secondary_color: '#006432',
  accent_color: '#b38856',
  navbar_bg_color: '#08253C',
  navbar_style: 'dark',
  footer_bg_color: '#08253C',
  footer_bottom_bg_color: '#051a2b',
  countdown_enabled: true,
  countdown_label: 'Menuju Puncak Haul Abah Ke-5',
  countdown_target: '',
  countdown_live_text: 'ACARA SEDANG BERLANGSUNG',
  parking_zones_json: [],
  agenda_schedules_json: [],
  gallery_items_json: [],
  gallery_albums_json: [],
}

export interface ThemePreset {
  id: string
  name: string
  description: string
  primary: string
  primaryHover: string
  secondary: string
  accent: string
  navbarBg: string
  navbarStyle: 'white' | 'primary' | 'dark'
  footerBg: string
  footerBottomBg: string
  previewColors: [string, string, string, string]
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'emerald-nu',
    name: 'Zamrud Khidmah (Default)',
    description: 'Kombinasi hijau tosca khas dan emas elegan yang berwibawa dan teduh.',
    primary: '#008f8a',
    primaryHover: '#007a75',
    secondary: '#006432',
    accent: '#b38856',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#042623',
    footerBottomBg: '#021a18',
    previewColors: ['#008f8a', '#006432', '#b38856', '#042623']
  },
  {
    id: 'royal-emerald',
    name: 'Hijau Zamrud Penuh (Dark Navbar)',
    description: 'Navbar hijau gelap berkelas dengan aksen emas dan teks putih bersih.',
    primary: '#059669',
    primaryHover: '#047857',
    secondary: '#064e3b',
    accent: '#d97706',
    navbarBg: '#022c22',
    navbarStyle: 'dark',
    footerBg: '#022c22',
    footerBottomBg: '#011913',
    previewColors: ['#059669', '#064e3b', '#d97706', '#022c22']
  },
  {
    id: 'ocean-blue',
    name: 'Biru Samudra & Emas',
    description: 'Tampilan korporat modern, profesional, dan jernih dengan aksen biru laut.',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    secondary: '#0c4a6e',
    accent: '#f59e0b',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#071d36',
    footerBottomBg: '#04101e',
    previewColors: ['#0284c7', '#0c4a6e', '#f59e0b', '#071d36']
  },
  {
    id: 'maroon-gold',
    name: 'Merah Marun & Emas Karomah',
    description: 'Perpaduan marun agung dan emas bernuansa megah dan penuh berkah.',
    primary: '#991b1b',
    primaryHover: '#7f1d1d',
    secondary: '#450a0a',
    accent: '#d97706',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#250508',
    footerBottomBg: '#150204',
    previewColors: ['#991b1b', '#450a0a', '#d97706', '#250508']
  },
  {
    id: 'caramel-earth',
    name: 'Karamel & Emas Klasik (Earth)',
    description: 'Palet bumi alami nan hangat, teduh, bersahabat, dan berbudaya.',
    primary: '#b45309',
    primaryHover: '#92400e',
    secondary: '#78350f',
    accent: '#059669',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#221105',
    footerBottomBg: '#130903',
    previewColors: ['#b45309', '#78350f', '#059669', '#221105']
  },
  {
    id: 'royal-purple',
    name: 'Ungu Royal & Safir',
    description: 'Kombinasi ungu mulia dan aksen safir yang anggun serta eksklusif.',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    secondary: '#4c1d95',
    accent: '#06b6d4',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#17072b',
    footerBottomBg: '#0d0319',
    previewColors: ['#7c3aed', '#4c1d95', '#06b6d4', '#17072b']
  },
  {
    id: 'modern-slate',
    name: 'Monokrom Modern & Slate',
    description: 'Gaya monokrom minimalis elegan dengan sentuhan hijau zamrud.',
    primary: '#334155',
    primaryHover: '#1e293b',
    secondary: '#0f172a',
    accent: '#10b981',
    navbarBg: '#ffffff',
    navbarStyle: 'white',
    footerBg: '#0f172a',
    footerBottomBg: '#020617',
    previewColors: ['#334155', '#0f172a', '#10b981', '#0f172a']
  }
]

export function applyTheme(s: Partial<SiteSettings>) {
  if (typeof document === 'undefined') return
  const primary = s.primary_color || '#008f8a'
  const primaryHover = s.primary_hover_color || s.primary_color || '#007a75'
  const secondary = s.secondary_color || '#006432'
  const accent = s.accent_color || '#b38856'
  const footerBg = s.footer_bg_color || '#042623'
  const footerBottomBg = s.footer_bottom_bg_color || '#021a18'
  const navbarStyle = s.navbar_style || 'white'
  const navbarBg = s.navbar_bg_color || (navbarStyle === 'primary' ? primary : navbarStyle === 'dark' ? footerBg : '#ffffff')

  let styleTag = document.getElementById('site-theme-custom-style') as HTMLStyleElement | null
  if (!styleTag) {
    styleTag = document.createElement('style')
    styleTag.id = 'site-theme-custom-style'
    document.head.appendChild(styleTag)
  }

  styleTag.textContent = `
    :root {
      --site-primary: ${primary};
      --site-primary-hover: ${primaryHover};
      --site-secondary: ${secondary};
      --site-accent: ${accent};
      --site-footer-bg: ${footerBg};
      --site-footer-bottom-bg: ${footerBottomBg};
      --site-navbar-bg: ${navbarBg};
    }
    .bg-\\[\\#008f8a\\]:not(.admin-shell *) { background-color: ${primary} !important; }
    .hover\\:bg-\\[\\#007a75\\]:not(.admin-shell *):hover, .hover\\:bg-\\[\\#007a76\\]:not(.admin-shell *):hover { background-color: ${primaryHover} !important; }
    .text-\\[\\#008f8a\\]:not(.admin-shell *) { color: ${primary} !important; }
    .hover\\:text-\\[\\#008f8a\\]:not(.admin-shell *):hover { color: ${primary} !important; }
    .border-\\[\\#008f8a\\]:not(.admin-shell *) { border-color: ${primary} !important; }
    .ring-\\[\\#008f8a\\]:not(.admin-shell *) { --tw-ring-color: ${primary} !important; }
    .fill-\\[\\#008f8a\\]:not(.admin-shell *) { fill: ${primary} !important; }
    .stroke-\\[\\#008f8a\\]:not(.admin-shell *) { stroke: ${primary} !important; }
    .from-\\[\\#008f8a\\]:not(.admin-shell *) { --tw-gradient-from: ${primary} !important; }
    .to-\\[\\#008f8a\\]:not(.admin-shell *) { --tw-gradient-to: ${primary} !important; }

    /* Secondary */
    .text-\\[\\#006432\\]:not(.admin-shell *) { color: ${secondary} !important; }
    .bg-\\[\\#006432\\]:not(.admin-shell *) { background-color: ${secondary} !important; }
    .from-\\[\\#006432\\]:not(.admin-shell *) { --tw-gradient-from: ${secondary} !important; }
    .to-\\[\\#006432\\]:not(.admin-shell *) { --tw-gradient-to: ${secondary} !important; }

    /* Accent */
    .stroke-\\[\\#b38856\\]:not(.admin-shell *), .text-\\[\\#b38856\\]:not(.admin-shell *), .border-\\[\\#b38856\\]:not(.admin-shell *) {
      stroke: ${accent} !important;
      color: ${accent} !important;
      border-color: ${accent} !important;
    }

    /* Box Footer Overrides */
    .bg-\\[\\#111827\\]:not(.admin-shell *) {
      background-color: var(--site-footer-bg) !important;
    }
    .bg-slate-950:not(.admin-shell *) {
      background-color: var(--site-footer-bottom-bg) !important;
    }
  `
}

function mergeSettings(serverData: Partial<SiteSettings>): SiteSettings {
  const merged: SiteSettings = { ...EMPTY_SETTINGS }
  for (const [k, v] of Object.entries(serverData || {})) {
    if (v !== null && v !== undefined) {
      ;(merged as any)[k] = v
    }
  }
  if (!Array.isArray(merged.agenda_schedules_json)) merged.agenda_schedules_json = []
  if (!Array.isArray(merged.gallery_albums_json)) merged.gallery_albums_json = []
  if (!Array.isArray(merged.about_structure_items_json)) merged.about_structure_items_json = []
  if (!Array.isArray(merged.about_history_paragraphs_json)) merged.about_history_paragraphs_json = []
  return merged
}

const SETTINGS_CACHE_KEY = 'roja_settings_cache'

function loadCachedSettings(): SiteSettings {
  if (typeof window === 'undefined') return { ...EMPTY_SETTINGS }
  try {
    const raw = localStorage.getItem(SETTINGS_CACHE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        return mergeSettings(parsed)
      }
    }
  } catch {}
  return { ...EMPTY_SETTINGS }
}

function saveCachedSettings(data: SiteSettings) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(data))
  } catch {}
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<SiteSettings>(loadCachedSettings())
  const isLoaded = ref(false)
  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref<string | null>(null)
  const successMessage = ref<string | null>(null)

  applyTheme(settings.value)

  function applyFavicon(url: string) {
    if (!url || typeof document === 'undefined') return
    // Pertahankan tag statis PNG 96x96 & apple-touch-icon untuk Google Favicon Crawler
    let link: HTMLLinkElement | null = document.querySelector("link[rel='shortcut icon']")
    if (!link) {
      link = document.createElement('link')
      link.type = 'image/svg+xml'
      link.rel = 'shortcut icon'
      document.getElementsByTagName('head')[0].appendChild(link)
    }
    link.href = url
  }

  let inFlightFetch: Promise<void> | null = null

  async function fetchSettings(force = false) {
    if (inFlightFetch && !force) return inFlightFetch

    inFlightFetch = (async () => {
      isLoading.value = true
      error.value = null
      try {
        const response = await api.get<{ success: boolean; data: SiteSettings & { informasi_data_json?: any } }>('/settings')
        if (response.data?.data) {
          settings.value = mergeSettings(response.data.data)
          saveCachedSettings(settings.value)
          isLoaded.value = true
          applyTheme(settings.value)
          if (settings.value.favicon_url) {
            applyFavicon(settings.value.favicon_url)
          }
          if (response.data.data.informasi_data_json && typeof window !== 'undefined') {
            window.dispatchEvent(
              new CustomEvent('informasi-server-synced', {
                detail: response.data.data.informasi_data_json,
              })
            )
          }
        }
      } catch (err: any) {
        error.value = err.response?.data?.message || 'Gagal memuat pengaturan dari server.'
      } finally {
        isLoading.value = false
        inFlightFetch = null
      }
    })()

    return inFlightFetch
  }

  async function updateSettings(updatedData: Partial<SiteSettings>): Promise<{ success: boolean; message?: string }> {
    isSaving.value = true
    error.value = null
    successMessage.value = null

    try {
      const response = await api.post<{ success: boolean; message: string; data: SiteSettings }>('/admin/settings', updatedData)
      if (response.data?.data) {
        settings.value = mergeSettings(response.data.data)
        saveCachedSettings(settings.value)
        applyTheme(settings.value)
        if (settings.value.favicon_url) {
          applyFavicon(settings.value.favicon_url)
        }
      }
      await fetchSettings(true)
      successMessage.value = response.data?.message || 'Pengaturan situs berhasil disimpan ke database!'
      return { success: true, message: successMessage.value }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal menyimpan pengaturan ke server database.'
      error.value = msg
      return { success: false, message: msg }
    } finally {
      isSaving.value = false
    }
  }

  async function resetToDefault(): Promise<{ success: boolean; message?: string }> {
    return updateSettings({ ...EMPTY_SETTINGS })
  }

  return {
    settings,
    isLoaded,
    isLoading,
    isSaving,
    error,
    successMessage,
    fetchSettings,
    updateSettings,
    resetToDefault,
    applyTheme,
  }
})
