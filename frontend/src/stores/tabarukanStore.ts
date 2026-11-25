import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios'

export interface GuideInfoItem {
  id: number
  title: string
  category: string
  description: string
  location_note?: string
  contact_wa?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export interface TabarukanItem {
  id: number
  title: string
  category: string
  description: string
  image_url: string
  price_info?: string
  contact_wa?: string
  is_available: boolean
  created_at: string
}

export interface SecretariatContact {
  id: number
  name: string
  role: string
  division: string
  phone: string
  whatsapp: string
  email?: string
  is_active: boolean
}

export interface LocationPoint {
  id: number
  title: string
  badge?: string
  address: string
  maps_url?: string
  image_url?: string
  is_dark?: boolean
}

export interface EventLocationConfig {
  section_title: string
  section_subtitle: string
  main_map_title: string
  main_address: string
  google_maps_embed_url: string
  google_maps_link_url: string
}

export function normalizeGoogleMapsEmbedUrl(input: string | null | undefined, fallbackAddress: string | null | undefined = ''): string {
  const raw = (input ?? '').toString().trim()
  const iframeMatch = raw.match(/src=["']([^"']+)["']/i)
  const url = iframeMatch ? (iframeMatch[1] ?? '').toString().trim() : raw

  if (url && (url.includes('/maps/embed') || url.includes('output=embed'))) {
    return url
  }

  if (url) {
    const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=16&output=embed`
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&z=16&output=embed`
    }
  }

  const query = (fallbackAddress ?? '').toString().trim()
  return query ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed` : ''
}

export const DEFAULT_LOCATION_CONFIG: EventLocationConfig = {
  section_title: 'Peta Lokasi Acara',
  section_subtitle: '',
  main_map_title: 'Lokasi Utama Acara',
  main_address: '',
  google_maps_embed_url: '',
  google_maps_link_url: '',
}

export const DEFAULT_LOCATION_POINTS: LocationPoint[] = []

const DEFAULT_GUIDE_CATEGORIES = ['Penginapan', 'Transportasi', 'Posko Medis']

export const useTabarukanStore = defineStore('tabarukan', () => {
  const guideItems = ref<GuideInfoItem[]>([])
  const tabarukanItems = ref<TabarukanItem[]>([])
  const cpList = ref<SecretariatContact[]>([])
  const guideCategories = ref<string[]>([...DEFAULT_GUIDE_CATEGORIES])
  const locationConfig = ref<EventLocationConfig>({ ...DEFAULT_LOCATION_CONFIG })
  const locationPoints = ref<LocationPoint[]>([])
  const isSaving = ref(false)

  function applyServerSnapshot(data: any) {
    if (!data || typeof data !== 'object') return
    if (Array.isArray(data.guideItems)) guideItems.value = data.guideItems
    if (Array.isArray(data.tabarukanItems)) tabarukanItems.value = data.tabarukanItems
    if (Array.isArray(data.cpList)) cpList.value = data.cpList
    if (Array.isArray(data.guideCategories) && data.guideCategories.length > 0) {
      guideCategories.value = data.guideCategories
    }
    if (data.locationConfig && typeof data.locationConfig === 'object') {
      locationConfig.value = {
        section_title: (data.locationConfig.section_title ?? DEFAULT_LOCATION_CONFIG.section_title).toString(),
        section_subtitle: (data.locationConfig.section_subtitle ?? '').toString(),
        main_map_title: (data.locationConfig.main_map_title ?? DEFAULT_LOCATION_CONFIG.main_map_title).toString(),
        main_address: (data.locationConfig.main_address ?? '').toString(),
        google_maps_embed_url: (data.locationConfig.google_maps_embed_url ?? '').toString(),
        google_maps_link_url: (data.locationConfig.google_maps_link_url ?? '').toString(),
      }
    }
    if (Array.isArray(data.locationPoints)) locationPoints.value = data.locationPoints
  }

  async function syncToServer(): Promise<{ success: boolean; message?: string }> {
    isSaving.value = true
    try {
      const payload = {
        guideItems: guideItems.value,
        tabarukanItems: tabarukanItems.value,
        cpList: cpList.value,
        guideCategories: guideCategories.value,
        locationConfig: locationConfig.value,
        locationPoints: locationPoints.value,
      }
      const res = await api.post<{ success: boolean; message?: string }>('/admin/settings', {
        informasi_data_json: payload,
      })
      return { success: true, message: res.data?.message || 'Data Informasi Umum berhasil disimpan ke database!' }
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || 'Gagal menyimpan data Informasi Umum ke server.' }
    } finally {
      isSaving.value = false
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('informasi-server-synced', (e: Event) => {
      applyServerSnapshot((e as CustomEvent).detail)
    })
  }

  function addGuideCategory(name: string) {
    const clean = (name ?? '').toString().trim()
    if (!clean) return false
    if (!guideCategories.value.some(c => (c ?? '').toString().toLowerCase() === clean.toLowerCase())) {
      guideCategories.value.push(clean)
      syncToServer()
      return true
    }
    return false
  }

  function deleteGuideCategory(name: string) {
    guideCategories.value = guideCategories.value.filter(c => c !== name)
    syncToServer()
  }

  function resetGuideCategories() {
    guideCategories.value = [...DEFAULT_GUIDE_CATEGORIES]
    syncToServer()
  }

  function saveGuideItem(item: Partial<GuideInfoItem>) {
    const catClean = (item.category ?? '').toString().trim()
    if (catClean) {
      if (!guideCategories.value.some(c => (c ?? '').toString().toLowerCase() === catClean.toLowerCase())) {
        guideCategories.value.push(catClean)
      }
    }
    if (item.id) {
      const idx = guideItems.value.findIndex(g => g.id === item.id)
      if (idx !== -1) {
        guideItems.value[idx] = { ...guideItems.value[idx], ...item }
      }
    } else {
      guideItems.value.unshift({
        id: Date.now(),
        title: item.title || 'Panduan Informasi',
        category: item.category || guideCategories.value[0] || 'Penginapan',
        description: item.description || '',
        location_note: item.location_note || '',
        contact_wa: item.contact_wa || '',
        image_url: item.image_url || '',
        is_active: item.is_active !== undefined ? item.is_active : true,
        created_at: new Date().toISOString().split('T')[0],
      })
    }
    return syncToServer()
  }

  function deleteGuideItem(id: number) {
    guideItems.value = guideItems.value.filter(g => g.id !== id)
    return syncToServer()
  }

  function saveTabarukanItem(item: Partial<TabarukanItem>) {
    if (item.id) {
      const idx = tabarukanItems.value.findIndex(t => t.id === item.id)
      if (idx !== -1) {
        tabarukanItems.value[idx] = { ...tabarukanItems.value[idx], ...item }
      }
    } else {
      tabarukanItems.value.unshift({
        id: Date.now(),
        title: item.title || 'Tabarukan Khidmah',
        category: item.category || 'Kaos & Pakaian',
        description: item.description || '',
        image_url: item.image_url || '',
        price_info: item.price_info || '',
        contact_wa: item.contact_wa || '',
        is_available: item.is_available !== undefined ? item.is_available : true,
        created_at: new Date().toISOString().split('T')[0],
      })
    }
    return syncToServer()
  }

  function deleteTabarukanItem(id: number) {
    tabarukanItems.value = tabarukanItems.value.filter(t => t.id !== id)
    return syncToServer()
  }

  function saveCP(cp: Partial<SecretariatContact>) {
    if (cp.id) {
      const idx = cpList.value.findIndex(c => c.id === cp.id)
      if (idx !== -1) {
        cpList.value[idx] = { ...cpList.value[idx], ...cp }
      }
    } else {
      cpList.value.push({
        id: Date.now(),
        name: cp.name || 'Narahubung Panitia',
        role: cp.role || 'Staf Kesekretariatan',
        division: cp.division || 'Sekretariat Utama',
        phone: cp.phone || '',
        whatsapp: cp.whatsapp || '',
        email: cp.email || '',
        is_active: cp.is_active !== undefined ? cp.is_active : true,
      })
    }
    return syncToServer()
  }

  function deleteCP(id: number) {
    cpList.value = cpList.value.filter(c => c.id !== id)
    return syncToServer()
  }

  function saveLocationConfig(cfg: Partial<EventLocationConfig>) {
    locationConfig.value = { ...locationConfig.value, ...cfg }
    return syncToServer()
  }

  function saveLocationPoint(point: Partial<LocationPoint>) {
    if (point.id) {
      const idx = locationPoints.value.findIndex(p => p.id === point.id)
      if (idx !== -1) {
        locationPoints.value[idx] = { ...locationPoints.value[idx], ...point }
      }
    } else {
      locationPoints.value.push({
        id: Date.now(),
        title: point.title || 'Titik Lokasi Acara',
        badge: point.badge || 'Lokasi Acara',
        address: point.address || '',
        maps_url: point.maps_url || '',
        image_url: point.image_url || '',
        is_dark: !!point.is_dark,
      })
    }
    return syncToServer()
  }

  function deleteLocationPoint(id: number) {
    locationPoints.value = locationPoints.value.filter(p => p.id !== id)
    return syncToServer()
  }

  function resetLocationDefaults() {
    locationConfig.value = { ...DEFAULT_LOCATION_CONFIG }
    locationPoints.value = []
    return syncToServer()
  }

  return {
    guideItems,
    tabarukanItems,
    cpList,
    guideCategories,
    customCategories: guideCategories,
    allCategories: guideCategories,
    locationConfig,
    locationPoints,
    isSaving,
    applyServerSnapshot,
    addGuideCategory,
    deleteGuideCategory,
    resetGuideCategories,
    addCategory: addGuideCategory,
    deleteCategory: deleteGuideCategory,
    resetCategories: resetGuideCategories,
    saveGuideItem,
    deleteGuideItem,
    saveTabarukanItem,
    deleteTabarukanItem,
    saveCP,
    deleteCP,
    saveLocationConfig,
    saveLocationPoint,
    deleteLocationPoint,
    resetLocationDefaults,
  }
})
