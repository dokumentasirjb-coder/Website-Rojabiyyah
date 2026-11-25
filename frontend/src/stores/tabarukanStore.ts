import { defineStore } from 'pinia'
import { ref } from 'vue'
import { idbGet, idbSet } from '@/lib/idb'
import { broadcastSync, onSyncBroadcast } from '@/lib/syncChannel'

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

const GUIDE_STORAGE_KEY = 'rojabiyyah_guide_items'
const TABARUKAN_STORAGE_KEY = 'rojabiyyah_tabarukan_items'
const CP_STORAGE_KEY = 'rojabiyyah_secretariat_cp'
const GUIDE_CATEGORIES_STORAGE_KEY = 'rojabiyyah_guide_categories'
const LOCATION_CONFIG_KEY = 'rojabiyyah_location_config_v1'
const LOCATION_POINTS_KEY = 'rojabiyyah_location_points_v1'

export function normalizeGoogleMapsEmbedUrl(input: string, fallbackAddress = ''): string {
  const raw = (input || '').trim()
  // Jika user menempelkan kode HTML <iframe ... src="...">, ambil URL src-nya
  const iframeMatch = raw.match(/src=["']([^"']+)["']/i)
  const url = iframeMatch ? iframeMatch[1].trim() : raw

  if (url && (url.includes('/maps/embed') || url.includes('output=embed'))) {
    return url
  }

  // Jika user menempelkan link Google Maps biasa atau alamat teks, konversi ke embed search q=
  if (url) {
    // Cek koordinat @lat,lng di URL Google Maps
    const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (coordMatch) {
      return `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&z=16&output=embed`
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    }
  }

  if (fallbackAddress.trim()) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(fallbackAddress.trim())}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  }

  return 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.5188824194096!2d112.23594837582498!3d-7.518174574187053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e783ffc47f75eb3%3A0xa61feea2d0bba6f7!2sPondok%20Pesantren%20Bahrul%20Ulum%20Tambakberas%20Jombang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid'
}

export const DEFAULT_LOCATION_CONFIG: EventLocationConfig = {
  section_title: 'Peta Lokasi Penyelenggaraan Acara',
  section_subtitle: "Panduan geografis kompleks pondok pesantren Bahrul 'Ulum Tambakberas, Jombang, Jawa Timur dan akses penjemputan jamaah.",
  main_map_title: 'Titik Pusat Lokasi:',
  main_address: "Kompleks Pondok Pesantren Bahrul 'Ulum Tambakberas, Jl. KH. Wahab Chasbullah, Tambakrejo, Kec. Jombang, Kabupaten Jombang, Jawa Timur 61451.",
  google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.5188824194096!2d112.23594837582498!3d-7.518174574187053!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e783ffc47f75eb3%3A0xa61feea2d0bba6f7!2sPondok%20Pesantren%20Bahrul%20Ulum%20Tambakberas%20Jombang!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
  google_maps_link_url: 'https://maps.google.com/?q=Pondok+Pesantren+Bahrul+Ulum+Tambakberas+Jombang'
}

export const DEFAULT_LOCATION_POINTS: LocationPoint[] = [
  {
    id: 1,
    title: 'Akses Dari Stasiun Jombang (JG)',
    badge: 'Akses Rute',
    address: 'Jarak sekitar 3,5 KM ke utara dari Stasiun Kereta Api Jombang. Waktu tempuh sekitar 10 menit menggunakan transportasi roda empat atau armada panitia ke Kompleks Tambakberas.',
    maps_url: 'https://maps.google.com/?q=Stasiun+Jombang',
    is_dark: false
  },
  {
    id: 2,
    title: 'Akses Dari Gerbang Tol Jombang',
    badge: 'Akses Rute',
    address: 'Keluar melalui Exit Tol Jombang (Tembelang). Lanjutkan perjalanan ke arah selatan melalui Jl. Raya Ploso–Jombang sekitar 15 menit menuju arena acara.',
    maps_url: 'https://maps.google.com/?q=Gerbang+Tol+Jombang+Tembelang',
    is_dark: false
  },
  {
    id: 3,
    title: 'Pelayanan Parkir & Pengawalan',
    badge: 'Parkir & Keamanan',
    address: 'Area kantong parkir disiapkan di beberapa titik strategis di sekitar pondok dengan petunjuk petugas keamanan panitia & Banser.',
    maps_url: 'https://maps.google.com/?q=Pondok+Pesantren+Bahrul+Ulum+Tambakberas+Jombang',
    is_dark: true
  }
]

export const DEFAULT_GUIDE_CATEGORIES: string[] = [
  'Penginapan',
  'Transportasi',
  'Lokasi Acara',
  'Konsumsi',
  'Layanan Medis'
]

export const DEFAULT_GUIDE_ITEMS: GuideInfoItem[] = [
  {
    id: 1,
    title: 'Asrama Santri & Wisma Transit Jamaah',
    category: 'Penginapan',
    description: 'Panitia menyiapkan fasilitas asrama transit gratis di kompleks pesantren untuk jamaah luar kota dan alumni. Tersedia juga informasi homestay dan penginapan keluarga di sekitar Tambakberas.',
    location_note: 'Kompleks Asrama Pondok Pesantren Bahrul Ulum',
    contact_wa: '6282198765432',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: '2026-08-19'
  },
  {
    id: 2,
    title: 'Rute Armada & Shuttle Penjemputan',
    category: 'Transportasi',
    description: 'Layanan armada jemputan disiapkan dari Stasiun Kereta Api Jombang dan Terminal Kepuhsari. Rombongan bus jamaah diarahkan ke kantong parkir resmi dengan pengawalan Banser.',
    location_note: 'Stasiun KA Jombang & Terminal Kepuhsari',
    contact_wa: '6281234567890',
    image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: '2026-08-19'
  },
  {
    id: 3,
    title: 'Posko Kesehatan & Pertolongan Pertama',
    category: 'Layanan Medis',
    description: 'Pelayanan medis siaga 24 jam dengan tim dokter, perawat, ambulans darurat, dan obat-obatan gratis untuk jamaah selama rangkaian acara Haul & Rojabiyyah berlangsung.',
    location_note: 'Gedung Serbaguna Pesantren & Pos Lapangan',
    contact_wa: '6281234567890',
    image_url: '',
    is_active: true,
    created_at: '2026-08-20'
  },
  {
    id: 4,
    title: 'Dapur Umum & Pos Hidangan Jamaah',
    category: 'Konsumsi',
    description: 'Penyediaan konsumsi berkah dan air minum untuk seluruh jamaah dan santri di posko konsumsi utama.',
    location_note: 'Dapur Umum Bahrul Ulum',
    contact_wa: '6281234567890',
    image_url: '',
    is_active: true,
    created_at: '2026-08-20'
  }
]

export const DEFAULT_TABARUKAN_ITEMS: TabarukanItem[] = [
  {
    id: 1,
    title: 'Kaos Resmi Haul Abah & Rojabiyyah 2026',
    category: 'Kaos & Pakaian',
    description: 'Bahan Cotton Combed 24s premium, sablon discharge adem dan awet. Logo bordir emblem resmi Haul Abah & Rojabiyyah.',
    image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    price_info: 'Infaq Tabarukan: Rp 85.000',
    contact_wa: '6281234567890',
    is_available: true,
    created_at: '2026-08-20'
  },
  {
    id: 2,
    title: 'Buku Manakib & Mauidhoh Abah KH. Moch. Djamaluddin Ahmad',
    category: 'Kitab & Buku',
    description: 'Kumpulan nasihat, rekam jejak perjuangan dakwah, dan untaian mutiara hikmah Almaghfurlah Abah KH. Moch. Djamaluddin Ahmad.',
    image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    price_info: 'Infaq Tabarukan: Rp 50.000',
    contact_wa: '6281234567890',
    is_available: true,
    created_at: '2026-08-21'
  },
  {
    id: 3,
    title: 'Kopiah Hitam & Sorban Khidmah Rojabiyyah',
    category: 'Atribut Santri',
    description: 'Peci beludru istimewa berlogo emas resmi Haul dan sorban tenun halus lambang mahabbah dan khidmah santri.',
    image_url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
    price_info: 'Infaq Tabarukan: Rp 65.000',
    contact_wa: '6281234567890',
    is_available: true,
    created_at: '2026-08-22'
  },
  {
    id: 4,
    title: 'Minyak Wangi Non-Alkohol Khidmah Aroma Nabawi',
    category: 'Wewangian',
    description: 'Minyak wangi murni non-alkohol ramuan khas aroma kasturi dan oud segar, sangat cocok untuk menghadiri majelis dzikir & sholawat.',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    price_info: 'Infaq Tabarukan: Rp 35.000',
    contact_wa: '6281234567890',
    is_available: true,
    created_at: '2026-08-23'
  }
]

export const DEFAULT_CP_ITEMS: SecretariatContact[] = [
  {
    id: 1,
    name: 'Ustadz Ahmad Fauzi, S.Pd.I',
    role: 'Koordinator Kesekretariatan',
    division: 'Sekretariat Utama',
    phone: '+62 812-3456-7890',
    whatsapp: '6281234567890',
    email: 'sekretariat@rojabiyyah.id',
    is_active: true
  },
  {
    id: 2,
    name: 'H. Muhammad Ridwan',
    role: 'Penanggung Jawab Akomodasi & Transit',
    division: 'Akomodasi Santri & Alumni',
    phone: '+62 821-9876-5432',
    whatsapp: '6282198765432',
    email: 'akomodasi@rojabiyyah.id',
    is_active: true
  },
  {
    id: 3,
    name: 'Ustadz Nurul Huda',
    role: 'Layanan Tabarukan & Logistik Acara',
    division: 'Divisi Tabarukan & Perlengkapan',
    phone: '+62 857-1122-3344',
    whatsapp: '6285711223344',
    email: 'tabarukan@rojabiyyah.id',
    is_active: true
  },
  {
    id: 4,
    name: 'Gus Zaimuddin',
    role: 'Humas & Informasi Tamu Undangan',
    division: 'Humas & Keprotokolan',
    phone: '+62 813-5566-7788',
    whatsapp: '6281355667788',
    email: 'humas@rojabiyyah.id',
    is_active: true
  }
]

export const useTabarukanStore = defineStore('tabarukan', () => {
  const guideItems = ref<GuideInfoItem[]>([])
  const tabarukanItems = ref<TabarukanItem[]>([])
  const cpList = ref<SecretariatContact[]>([])
  const guideCategories = ref<string[]>([])

  // Load Guide Categories
  const savedGuideCats = typeof window !== 'undefined' ? localStorage.getItem(GUIDE_CATEGORIES_STORAGE_KEY) : null
  if (savedGuideCats) {
    try {
      const parsed = JSON.parse(savedGuideCats)
      const legacy = ['merchandise', 'kitab & buku', 'atribut santri', 'wewangian']
      const filtered = Array.isArray(parsed) ? parsed.filter((c: string) => !legacy.includes(c.toLowerCase())) : []
      guideCategories.value = filtered.length > 0 ? filtered : [...DEFAULT_GUIDE_CATEGORIES]
    } catch {
      guideCategories.value = [...DEFAULT_GUIDE_CATEGORIES]
    }
  } else {
    guideCategories.value = [...DEFAULT_GUIDE_CATEGORIES]
  }

  function persistGuideCategories() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(GUIDE_CATEGORIES_STORAGE_KEY, JSON.stringify(guideCategories.value))
      } catch (e) {
        console.warn('LocalStorage error saving guide categories:', e)
      }
    }
  }

  function addGuideCategory(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return false
    const exists = guideCategories.value.some(c => c.toLowerCase() === trimmed.toLowerCase())
    if (!exists) {
      guideCategories.value.push(trimmed)
      persistGuideCategories()
      return true
    }
    return false
  }

  function deleteGuideCategory(name: string) {
    guideCategories.value = guideCategories.value.filter(c => c.toLowerCase() !== name.toLowerCase())
    guideItems.value.forEach(item => {
      if (item.category && item.category.toLowerCase() === name.toLowerCase()) {
        item.category = guideCategories.value[0] || 'Umum'
      }
    })
    persistGuideCategories()
    persistGuideItems()
    return true
  }

  function resetGuideCategories() {
    guideCategories.value = [...DEFAULT_GUIDE_CATEGORIES]
    persistGuideCategories()
  }

  // Load Guide Items (izinkan array kosong [] jika admin memang menghapus semua item)
  const savedGuides = typeof window !== 'undefined' ? localStorage.getItem(GUIDE_STORAGE_KEY) : null
  if (savedGuides !== null) {
    try {
      const parsed = JSON.parse(savedGuides)
      guideItems.value = Array.isArray(parsed) ? parsed : DEFAULT_GUIDE_ITEMS
    } catch {
      guideItems.value = DEFAULT_GUIDE_ITEMS
    }
  } else {
    guideItems.value = DEFAULT_GUIDE_ITEMS
  }

  function persistGuideItems() {
    if (typeof window !== 'undefined') {
      const raw = JSON.parse(JSON.stringify(guideItems.value))
      idbSet(GUIDE_STORAGE_KEY, raw).catch(() => {})
      try {
        localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(raw))
      } catch (e) {
        console.warn('LocalStorage error saving guide items:', e)
      }
      window.dispatchEvent(new CustomEvent('tabarukan-store-updated'))
      broadcastSync('tabarukan')
    }
  }

  function saveGuideItem(item: Partial<GuideInfoItem>) {
    if (item.category && item.category.trim()) {
      addGuideCategory(item.category.trim())
    }
    if (item.id) {
      const idx = guideItems.value.findIndex(g => g.id === item.id)
      if (idx !== -1) {
        guideItems.value[idx] = { ...guideItems.value[idx], ...item }
      }
    } else {
      const newItem: GuideInfoItem = {
        id: Date.now(),
        title: item.title || 'Panduan Informasi',
        category: item.category || guideCategories.value[0] || 'Penginapan',
        description: item.description || '',
        location_note: item.location_note || '',
        contact_wa: item.contact_wa || '6281234567890',
        image_url: item.image_url || '',
        is_active: item.is_active !== undefined ? item.is_active : true,
        created_at: new Date().toISOString().split('T')[0]
      }
      guideItems.value.unshift(newItem)
    }
    persistGuideItems()
    return true
  }

  function deleteGuideItem(id: number) {
    guideItems.value = guideItems.value.filter(g => g.id !== id)
    persistGuideItems()
  }

  // Load Tabarukan Items (izinkan array kosong [] jika admin menghapus semua item)
  const savedTabarukan = typeof window !== 'undefined' ? localStorage.getItem(TABARUKAN_STORAGE_KEY) : null
  if (savedTabarukan !== null) {
    try {
      const parsed = JSON.parse(savedTabarukan)
      tabarukanItems.value = Array.isArray(parsed) ? parsed : DEFAULT_TABARUKAN_ITEMS
    } catch {
      tabarukanItems.value = DEFAULT_TABARUKAN_ITEMS
    }
  } else {
    tabarukanItems.value = DEFAULT_TABARUKAN_ITEMS
  }

  function persistTabarukan() {
    if (typeof window !== 'undefined') {
      const raw = JSON.parse(JSON.stringify(tabarukanItems.value))
      // Simpan lengkap ke IndexedDB agar foto base64 & daftar terhapus selalu awet
      idbSet(TABARUKAN_STORAGE_KEY, raw).catch(() => {})
      try {
        localStorage.setItem(TABARUKAN_STORAGE_KEY, JSON.stringify(raw))
      } catch (e) {
        console.warn('LocalStorage quota penuh saat simpan tabarukan, gunakan versi ringkas:', e)
        try {
          const minimal = raw.map((t: TabarukanItem) => ({
            ...t,
            image_url: t.image_url?.startsWith('data:') ? '' : (t.image_url || '')
          }))
          localStorage.setItem(TABARUKAN_STORAGE_KEY, JSON.stringify(minimal))
        } catch {}
      }
      window.dispatchEvent(new CustomEvent('tabarukan-store-updated'))
      broadcastSync('tabarukan')
    }
  }

  function saveTabarukanItem(item: Partial<TabarukanItem>) {
    if (item.id) {
      const idx = tabarukanItems.value.findIndex(t => t.id === item.id)
      if (idx !== -1) {
        tabarukanItems.value[idx] = { ...tabarukanItems.value[idx], ...item }
      }
    } else {
      const newItem: TabarukanItem = {
        id: Date.now(),
        title: item.title || 'Tabarukan Khidmah',
        category: item.category || 'Kaos & Pakaian',
        description: item.description || '',
        image_url: item.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
        price_info: item.price_info || '',
        contact_wa: item.contact_wa || '6281234567890',
        is_available: item.is_available !== undefined ? item.is_available : true,
        created_at: new Date().toISOString().split('T')[0]
      }
      tabarukanItems.value.unshift(newItem)
    }
    persistTabarukan()
    return true
  }

  function deleteTabarukanItem(id: number) {
    tabarukanItems.value = tabarukanItems.value.filter(t => t.id !== id)
    persistTabarukan()
  }

  // Load CP List (izinkan array kosong [] jika admin menghapus semua item)
  const savedCP = typeof window !== 'undefined' ? localStorage.getItem(CP_STORAGE_KEY) : null
  if (savedCP !== null) {
    try {
      const parsed = JSON.parse(savedCP)
      cpList.value = Array.isArray(parsed) ? parsed : DEFAULT_CP_ITEMS
    } catch {
      cpList.value = DEFAULT_CP_ITEMS
    }
  } else {
    cpList.value = DEFAULT_CP_ITEMS
  }

  function persistCP() {
    if (typeof window !== 'undefined') {
      const raw = JSON.parse(JSON.stringify(cpList.value))
      idbSet(CP_STORAGE_KEY, raw).catch(() => {})
      try {
        localStorage.setItem(CP_STORAGE_KEY, JSON.stringify(raw))
      } catch (e) {
        console.warn('LocalStorage error saving CP items:', e)
      }
      window.dispatchEvent(new CustomEvent('tabarukan-store-updated'))
      broadcastSync('tabarukan')
    }
  }

  function saveCP(cp: Partial<SecretariatContact>) {
    if (cp.id) {
      const idx = cpList.value.findIndex(c => c.id === cp.id)
      if (idx !== -1) {
        cpList.value[idx] = { ...cpList.value[idx], ...cp }
      }
    } else {
      const newCP: SecretariatContact = {
        id: Date.now(),
        name: cp.name || 'Panitia Sekretariat',
        role: cp.role || 'Staf Kesekretariatan',
        division: cp.division || 'Sekretariat',
        phone: cp.phone || '+62 812-3456-7890',
        whatsapp: (cp.whatsapp || cp.phone || '6281234567890').replace(/[^0-9]/g, ''),
        email: cp.email || '',
        is_active: cp.is_active !== undefined ? cp.is_active : true
      }
      cpList.value.push(newCP)
    }
    persistCP()
    return true
  }

  function deleteCP(id: number) {
    cpList.value = cpList.value.filter(c => c.id !== id)
    persistCP()
  }

  // ============================================================
  // PETA & TITIK LOKASI ACARA (CUSTOM GOOGLE MAPS & BAGAN)
  // ============================================================
  const locationConfig = ref<EventLocationConfig>({ ...DEFAULT_LOCATION_CONFIG })
  const savedLocCfg = typeof window !== 'undefined' ? localStorage.getItem(LOCATION_CONFIG_KEY) : null
  if (savedLocCfg) {
    try {
      const parsed = JSON.parse(savedLocCfg)
      if (parsed && typeof parsed === 'object') {
        locationConfig.value = { ...DEFAULT_LOCATION_CONFIG, ...parsed }
      }
    } catch {}
  }

  const locationPoints = ref<LocationPoint[]>([])
  const savedLocPts = typeof window !== 'undefined' ? localStorage.getItem(LOCATION_POINTS_KEY) : null
  if (savedLocPts !== null) {
    try {
      const parsed = JSON.parse(savedLocPts)
      locationPoints.value = Array.isArray(parsed) ? parsed : [...DEFAULT_LOCATION_POINTS]
    } catch {
      locationPoints.value = [...DEFAULT_LOCATION_POINTS]
    }
  } else {
    locationPoints.value = [...DEFAULT_LOCATION_POINTS]
  }

  function persistLocationConfig() {
    if (typeof window !== 'undefined') {
      const raw = JSON.parse(JSON.stringify(locationConfig.value))
      idbSet(LOCATION_CONFIG_KEY, raw).catch(() => {})
      try {
        localStorage.setItem(LOCATION_CONFIG_KEY, JSON.stringify(raw))
      } catch {}
      window.dispatchEvent(new CustomEvent('tabarukan-store-updated'))
      broadcastSync('tabarukan')
    }
  }

  function persistLocationPoints() {
    if (typeof window !== 'undefined') {
      const raw = JSON.parse(JSON.stringify(locationPoints.value))
      idbSet(LOCATION_POINTS_KEY, raw).catch(() => {})
      try {
        localStorage.setItem(LOCATION_POINTS_KEY, JSON.stringify(raw))
      } catch {
        try {
          const minimal = raw.map((p: LocationPoint) => ({
            ...p,
            image_url: p.image_url?.startsWith('data:') ? '' : (p.image_url || '')
          }))
          localStorage.setItem(LOCATION_POINTS_KEY, JSON.stringify(minimal))
        } catch {}
      }
      window.dispatchEvent(new CustomEvent('tabarukan-store-updated'))
      broadcastSync('tabarukan')
    }
  }

  function saveLocationConfig(cfg: Partial<EventLocationConfig>) {
    locationConfig.value = {
      ...locationConfig.value,
      ...cfg
    }
    persistLocationConfig()
    return true
  }

  function saveLocationPoint(point: Partial<LocationPoint>) {
    if (point.id) {
      const idx = locationPoints.value.findIndex(p => p.id === point.id)
      if (idx !== -1) {
        locationPoints.value[idx] = { ...locationPoints.value[idx], ...point }
      }
    } else {
      const newPoint: LocationPoint = {
        id: Date.now(),
        title: point.title || 'Titik Lokasi Acara',
        badge: point.badge || 'Lokasi Acara',
        address: point.address || '',
        maps_url: point.maps_url || '',
        image_url: point.image_url || '',
        is_dark: !!point.is_dark
      }
      locationPoints.value.push(newPoint)
    }
    persistLocationPoints()
    return true
  }

  function deleteLocationPoint(id: number) {
    locationPoints.value = locationPoints.value.filter(p => p.id !== id)
    persistLocationPoints()
  }

  function resetLocationDefaults() {
    locationConfig.value = { ...DEFAULT_LOCATION_CONFIG }
    locationPoints.value = [...DEFAULT_LOCATION_POINTS]
    persistLocationConfig()
    persistLocationPoints()
  }

  // Muat salinan lengkap dari IndexedDB saat startup & sinkronkan antar-tab
  if (typeof window !== 'undefined') {
    idbGet<GuideInfoItem[]>(GUIDE_STORAGE_KEY).then(d => {
      if (Array.isArray(d)) guideItems.value = d
    }).catch(() => {})

    idbGet<TabarukanItem[]>(TABARUKAN_STORAGE_KEY).then(d => {
      if (Array.isArray(d)) tabarukanItems.value = d
    }).catch(() => {})

    idbGet<SecretariatContact[]>(CP_STORAGE_KEY).then(d => {
      if (Array.isArray(d)) cpList.value = d
    }).catch(() => {})

    idbGet<EventLocationConfig>(LOCATION_CONFIG_KEY).then(d => {
      if (d && typeof d === 'object') locationConfig.value = { ...DEFAULT_LOCATION_CONFIG, ...d }
    }).catch(() => {})

    idbGet<LocationPoint[]>(LOCATION_POINTS_KEY).then(d => {
      if (Array.isArray(d)) locationPoints.value = d
    }).catch(() => {})

    onSyncBroadcast('tabarukan', () => {
      idbGet<GuideInfoItem[]>(GUIDE_STORAGE_KEY).then(d => { if (Array.isArray(d)) guideItems.value = d }).catch(() => {})
      idbGet<TabarukanItem[]>(TABARUKAN_STORAGE_KEY).then(d => { if (Array.isArray(d)) tabarukanItems.value = d }).catch(() => {})
      idbGet<SecretariatContact[]>(CP_STORAGE_KEY).then(d => { if (Array.isArray(d)) cpList.value = d }).catch(() => {})
      idbGet<EventLocationConfig>(LOCATION_CONFIG_KEY).then(d => { if (d && typeof d === 'object') locationConfig.value = { ...DEFAULT_LOCATION_CONFIG, ...d } }).catch(() => {})
      idbGet<LocationPoint[]>(LOCATION_POINTS_KEY).then(d => { if (Array.isArray(d)) locationPoints.value = d }).catch(() => {})
    })

    window.addEventListener('storage', (e) => {
      if (!e.newValue) return
      try {
        if (e.key === GUIDE_STORAGE_KEY) {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) guideItems.value = parsed
        } else if (e.key === TABARUKAN_STORAGE_KEY) {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) tabarukanItems.value = parsed
        } else if (e.key === CP_STORAGE_KEY) {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) cpList.value = parsed
        } else if (e.key === LOCATION_CONFIG_KEY) {
          const parsed = JSON.parse(e.newValue)
          if (parsed && typeof parsed === 'object') locationConfig.value = { ...DEFAULT_LOCATION_CONFIG, ...parsed }
        } else if (e.key === LOCATION_POINTS_KEY) {
          const parsed = JSON.parse(e.newValue)
          if (Array.isArray(parsed)) locationPoints.value = parsed
        }
      } catch {}
    })
  }

  // Aliases for compatibility
  const customCategories = guideCategories
  const allCategories = guideCategories
  const addCategory = addGuideCategory
  const deleteCategory = deleteGuideCategory
  const resetCategories = resetGuideCategories

  return {
    guideItems,
    tabarukanItems,
    cpList,
    guideCategories,
    customCategories,
    allCategories,
    locationConfig,
    locationPoints,
    addGuideCategory,
    deleteGuideCategory,
    resetGuideCategories,
    addCategory,
    deleteCategory,
    resetCategories,
    saveGuideItem,
    deleteGuideItem,
    saveTabarukanItem,
    deleteTabarukanItem,
    saveCP,
    deleteCP,
    saveLocationConfig,
    saveLocationPoint,
    deleteLocationPoint,
    resetLocationDefaults
  }
})
